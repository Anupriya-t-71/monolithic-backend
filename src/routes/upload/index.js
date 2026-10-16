import express from "express"
import multer from "multer"
import { fileUplaodController,MutiplefileUplaodController,softDeleteFile,restoreFile,softDeleteMultipleFiles,restoreMultipleFiles,getAllUploadFiles,deleteUploadFiles } from "../../controllers/upload/index.js"


const FileUploadRouter = express.Router()
const FileRestoreRouter = express.Router()
const FileDeleteRouter = express.Router()

const Upload = multer()

/**
 * @swagger
 * tags:
 *   name: File Uploads
 *   description: Endpoints for uploading files
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a single file
 *     tags: [File Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /upload/mutiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [File Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Files to upload
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

FileUploadRouter.post("/",Upload.single("file"),fileUplaodController)
FileUploadRouter.post("/mutiple/",Upload.array("files"),MutiplefileUplaodController)




FileDeleteRouter.delete("/file/:fileId",softDeleteFile)

FileRestoreRouter.put("/file/:fileId",restoreFile)


FileDeleteRouter.delete("/delete-multiple", softDeleteMultipleFiles);


FileRestoreRouter.put("/restore-multiple", restoreMultipleFiles);

FileUploadRouter.get("/",getAllUploadFiles)
FileUploadRouter.put("/:id",deleteUploadFiles)
export default FileUploadRouter
export { FileRestoreRouter,FileDeleteRouter };