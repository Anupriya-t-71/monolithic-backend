import Note from "../../../../models/Institutes/Course/Notes_Model.js";
import Course from "../../../../models/Institutes/Course/index.js";
import slugify from "slugify";
import Validations from "../../../../validations/index.js";
import { FilterQuery } from "../../../../utils/helpers.js";
import { DefaultFilterQuerys, DefaultUpdateFields } from "../../../../utils/data.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../../common/index.js";
import { createLogger } from "../../../ActivityLogs/index.js";
import Upload from "../../../../models/fileUpload/fileUpload.js";

export const createNoteController = async (req,res) => {
    try{
        const value = Validations.NotesCreate(req.body);

        const {title,institute,branch,course} = value;
        const branchDetails = await getBranchDetailsWithUUID(branch)
        const instituteDetails = await getInstituteDetailswithUUID(institute)
               
        const newNote = new Note({...value,branch:branchDetails._id,institute:instituteDetails._id,slug:slugify(title)}); 
        await newNote.save();
        Upload.updateOne({file:newNote.file},{$set:{is_active:true}})
        
        await Course.findByIdAndUpdate(course,{$push:{notes:newNote._id}})
        const log_data = {user:req.user._id,role:req.user.role,model:"notes",action:"create",title:"notes created",details:`${newNote?.title} - notes created`,institute:req.user.institute_id,branch:req.user.branch_id}
        await createLogger(log_data)
        res.status(200).send({
            success: true,
            message: 'New Note Created Successfully',
            data:newNote
        })

    } catch(error){
        res.status(500).send({
            success: false,
            message: error.message
        })
    }

}

export const updateNoteController = async (req, res) => {
    try {
        const { noteId } = req.params;
        const value = FilterQuery(req.body,DefaultUpdateFields.notes)
        const updatedNote = await Note.findOneAndUpdate({uuid:noteId}, value, { new: true });
         Upload.updateOne({file:updatedNote.file},{$set:{is_active:true}})
        updatedNote.slug = slugify(updatedNote.title);
        await updatedNote.save();

        res.status(200).send({
            success: true,
            message: 'Note updated successfully',
            updatedNote
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};


export const deleteNoteController = async (req, res) => {
    try {
        const { noteId } = req.params;
        const data = await Note.findOneAndUpdate({uuid:noteId}, { is_delete: true });
        const log_data = {user:req.user._id,role:req.user.role,model:"notes",action:"delete",title:'notes deleted',details:`${data.title} - note deleted`,institute:req.user.institute_id,branch:req.user.branch_id}
        await createLogger(log_data)
        res.status(200).send({
            success: true,
            message: 'Note deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

export const getAllNotesController = async (req, res) => {
    try {

        const perPage = 8;
        const page = req.query.page ? req.query.page : 1;
        const filterArgs = FilterQuery(req.query,DefaultFilterQuerys.notes)
        
        const branch = await getBranchDetailsWithUUID(filterArgs.branch)

        const totalPages = await Note.countDocuments({...filterArgs,branch:branch._id,is_delete:false})
        const Notes = await Note.find({...filterArgs,branch:branch._id,is_delete:false}).populate("course")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({createdAt: -1});
        
        const last_page = Math.ceil( totalPages / perPage)

        res.status(200).send({
            success: true,
            message: 'Notes retrieved successfully',
            data:{ data: Notes, last_page}
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};
