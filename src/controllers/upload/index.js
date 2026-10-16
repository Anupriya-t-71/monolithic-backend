import s3Client from "../../config/bucket.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import * as Helpers from "../../utils/helpers.js";
import Upload from "../../models/fileUpload/fileUpload.js";
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import mongoose from "mongoose";

import cron from "node-cron";

export const fileUplaodController = async (req, res) => {
  try {
    const file = req.file;
    const{user_id,entity} = req.body
    if (file.size > 1048576) {
       return res.status(500).json({ status: "failed", message: "upload file lesser than 1mb", data: null });
    }
    const uuid = await Helpers.generateUUID();
    const file_name = uuid + "." + file.originalname.split(".").slice(-1)[0];

    const params = {
      Bucket: process.env.bucket_name,
      Key: "staticfiles/eflow/" + file_name,
      Body: file.buffer,
      ContentType: "Mimetype",
    };
    console.log("came before sending");

    const data = await s3Client.send(new PutObjectCommand(params));
    console.log("came after sending");
    
    const uuid1 = await Helpers.generateUUID();
    const save_file_name = new Upload({ file: params.Key, uuid: uuid1,user:user_id,entity:entity });
    await save_file_name.save();
    res.status(200).json({ status: "success", message: "file upload successfully", data: save_file_name });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null });
  }
};

export const MutiplefileUplaodController = async (req, res) => {
  try {
    const files = req.files;
    const uploadedFiles = [];
    for(const file of files){
      if (file.size > 1048576) {
       return res.status(500).json({ status: "failed", message: "upload file lesser than 1mb", data: null });
      }
    }
    for (const file of files) {
      const uuid = await Helpers.generateUUID();
      const file_name = uuid + "." + file.originalname.split(".").slice(-1)[0];
      const params = {
        Bucket: process.env.bucket_name,
        Key: "staticfiles/eflow/" + file_name,
        Body: file.buffer,
        ContentType: "Mimetype",
      };
      const data = await s3Client.send(new PutObjectCommand(params));
      const uuid1 = await Helpers.generateUUID();
      const save_file_name = new Upload({ file: params.Key, uuid: uuid1 });
      await save_file_name.save();
      uploadedFiles.push(save_file_name);
    }

    res.status(200).json({ status: "success", message: "Files uploaded successfully", data: uploadedFiles });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null });
  }
};




export const softDeleteFile = async (req, res) => {
  try {
    console.log("came into soft deletion");

    const { fileId } = req.params;
    const fileRecord = await Upload.findById(fileId);

    if (!fileRecord || fileRecord.is_deleted) {
      return res.status(404).json({ status: "failed", message: "File not found or already deleted" });
    }

    // Move to recycle bin in S3
    const oldKey = fileRecord.file;
    const newKey = `recycle-bin/${oldKey.split("/").pop()}`;

    await s3Client.send(
      new CopyObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        CopySource: `${process.env.BUCKET_NAME}/${oldKey}`,
        Key: newKey,
      })
    );

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: oldKey,
      })
    );

    // Mark as deleted in DB
    fileRecord.is_deleted = true;
    fileRecord.deleted_at = new Date();
    fileRecord.file = newKey; // Update file location
    await fileRecord.save();

    res.status(200).json({ status: "success", message: "File moved to recycle bin", data: fileRecord });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};





export const softDeleteMultipleFiles = async (req, res) => {
  try {
    const { fileIds } = req.body; 

    console.log("Received fileIds:", fileIds);

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ status: "failed", message: "Invalid or missing file IDs" });
    }

    const files = await Upload.find({ _id: { $in: fileIds }, is_deleted: false });

    if (files.length === 0) {
      return res.status(404).json({ status: "failed", message: "No matching files found or already deleted" });
    }

    const deletePromises = files.map(async (fileRecord) => {
      const oldKey = fileRecord.file;
      const newKey = `recycle-bin/${oldKey.split("/").pop()}`;

      await s3Client.send(new CopyObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        CopySource: `${process.env.BUCKET_NAME}/${oldKey}`,
        Key: newKey,
      }));

      await s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: oldKey,
      }));

      fileRecord.is_deleted = true;
      fileRecord.deleted_at = new Date();
      fileRecord.file = newKey;
      return fileRecord.save();
    });

    const deletedFiles = await Promise.all(deletePromises);

    res.status(200).json({ status: "success", message: "Files moved to recycle bin", data: deletedFiles });
  } catch (error) {
    console.error("Soft delete error:", error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};




export const restoreFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const fileRecord = await Upload.findById(fileId);

    if (!fileRecord || !fileRecord.is_deleted) {
      return res.status(404).json({ status: "failed", message: "File not found or not in recycle bin" });
    }

    const oldKey = fileRecord.file;
    const restoredKey = `staticfiles/eflow/${oldKey.split("/").pop()}`;

    await s3Client.send(
      new CopyObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        CopySource: `${process.env.BUCKET_NAME}/${oldKey}`,
        Key: restoredKey,
      })
    );

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: oldKey,
      })
    );

    // Mark as restored in DB
    fileRecord.is_deleted = false;
    fileRecord.deleted_at = null;
    fileRecord.file = restoredKey;
    await fileRecord.save();

    res.status(200).json({ status: "success", message: "File restored successfully", data: fileRecord });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};












export const restoreMultipleFiles = async (req, res) => {
  try {
    const { fileIds } = req.body; // Expecting an array of file IDs
    const restoredFiles = [];

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ status: "failed", message: "Invalid file IDs" });
    }

    for (const fileId of fileIds) {
      const fileRecord = await Upload.findById(fileId);

      if (!fileRecord || !fileRecord.is_deleted) {
        continue; 
      }

      const oldKey = fileRecord.file;
      const restoredKey = `staticfiles/eflow/${oldKey.split("/").pop()}`;

      await s3Client.send(
        new CopyObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          CopySource: `${process.env.BUCKET_NAME}/${oldKey}`,
          Key: restoredKey,
        })
      );

      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: oldKey,
        })
      );

      fileRecord.is_deleted = false;
      fileRecord.deleted_at = null;
      fileRecord.file = restoredKey;
      await fileRecord.save();

      restoredFiles.push(fileRecord);
    }

    if (restoredFiles.length === 0) {
      return res.status(404).json({ status: "failed", message: "No files restored" });
    }

    res.status(200).json({ status: "success", message: "Files restored successfully", data: restoredFiles });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};




export const cleanupUnusedFiles = async () => {
  try {
    const expirationTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Files older than 30 days

    const oldFiles = await Upload.find({
      is_deleted: true,
      deleted_at: { $lt: expirationTime },
    });

    for (const file of oldFiles) {
      await s3Client.send(new DeleteObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: file.file }));
      await file.deleteOne();
    }

    console.log(`Deleted ${oldFiles.length} old files from S3.`);
  } catch (error) {
    console.error("Error in cleanup job:", error);
  }
};

cleanupUnusedFiles();
cron.schedule("0 0 * * *", cleanupUnusedFiles);
export const getAllUploadFiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const query = req.query.query || '';

    const filters = { is_active: true, is_deleted: false };

    if (query) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(query)) {
        filters.date = query;
      } else {
        filters.file = { $regex: query, $options: 'i' };
      }
    }
    const files = await Upload.find(filters)
      .skip(skip)
      .limit(limit);

    const totalDocuments = await Upload.countDocuments(filters);
    const totalPages = Math.ceil(totalDocuments / limit);

    res.status(200).json({ files, totalPages, totalDocuments });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const deleteUploadFiles = async (req, res) => {
  const { id } = req.params;
  try {
    await Upload.updateOne({ _id: id }, { is_deleted: true });

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
}
