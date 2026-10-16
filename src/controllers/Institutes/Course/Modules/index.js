import Module from "../../../../models/Institutes/Course/Module_Model.js"
import Course from "../../../../models/Institutes/Course/index.js";
import slugify from "slugify";
import Validations from "../../../../validations/index.js";
import { getBranchDetailsWithUUID, getCategoryDetailsWithUUID, getCourseDetailsWithUUID, getInstituteDetailswithUUID } from "../../common/index.js";
import { FilterQuery } from "../../../../utils/helpers.js";
import { DefaultFilterQuerys, DefaultUpdateFields } from "../../../../utils/data.js";
import { createLogger } from "../../../ActivityLogs/index.js";

export const createModuleController = async (req, res) => {
    try {
        const value =   Validations.CourseModuleCreate(req.body);
        const branch = await getBranchDetailsWithUUID(value.branch)
        const course = await getCourseDetailsWithUUID(value.course)
        
         const {title} = value;
        const existingModule = await Module.findOne({ slug: slugify(title), branch: branch._id,is_delete:false });
        
        if (existingModule) {
            if (existingModule.is_delete) {
                throw new Error("A module with the same title exists but is deleted. Contact admin to retrieve.")
            } else {
                throw new Error("A module with the same title already exists.")
            }
        }
        
        const newModule = new Module({...value,branch:branch._id,course:course._id,title:slugify(title)});
        await newModule.save();

  
        const new_course = await Course.findByIdAndUpdate(course._id,{$push:{coursemodules:newModule._id}})
        const log_data = {user:req.user._id,role:req.user.role,model:"course modules",action:"create",title:"course module created",details:`${newModule?.title} - course module created`,institute:req.user.institute_id,branch:req.user?.branch_id}
        await createLogger(log_data)
        res.status(200).json({
            success: true,
            message: 'New Module Created Successfully',
            data:newModule
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
};

export const updateModuleController = async (req, res) => {
    try {
            
        const { moduleId } = req.params;
        const value = FilterQuery(req.body,DefaultUpdateFields.course_modules)
        const { title ,is_active } = req.body;

        if (is_active !== undefined) {
            return res.status(400).send({
                success: false,
                message: 'Updating the "is_active" field is not allowed',
            });
        }


        const existingtitle = await Module.findOne({ slug: slugify(title) });

        if (existingtitle) {
            return res.status(400).send({
                success: false,
                message: 'Title name already exists',
            });
        } 
        

        const updatedModule = await Module.findOneAndUpdate({uuid:moduleId}, value, { new: true });
        updatedModule.slug = slugify(title);
        await updatedModule.save();

        res.status(200).send({
            success: true,
            message: 'Module updated successfully',
            updatedModule
        });
        } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
        }
        };


export const updateModuleStatusController = async (req, res) => {
    try {
        const { moduleId } = req.params;
        
        const { is_active} = req.body;
        

        const updatedModuleStatus = await Module.findOneAndUpdate({uuid:moduleId}, { is_active }, { new: true });

        res.status(200).send({
            success: true,
            message: 'Module status updated successfully',
            updatedModuleStatus
        })
    
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const updateModuleStatusTrackController = async (req, res) => {
    try {
        const { moduleId } = req.params;
        
        const { status } = req.body;
        

        const updatedModuleStatus = await Module.findOneAndUpdate({uuid:moduleId}, { status }, { new: true });

        res.status(200).send({
            success: true,
            message: 'Module status updated successfully',
            updatedModuleStatus
        })
    
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const deleteModuleController = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const data = await Module.findOneAndUpdate({uuid:moduleId}, { is_delete: true });
        const log_data = {user:req.user._id, role:req.user.role,model:"course module",title:"course module deleted",details:`${data.title} - deleted successfully`,action:"delete",institute:req.user.institute_id,branch:req.user.branch_id}
        await createLogger(log_data)
        res.status(200).send({
            success: true,
            message: 'Module deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const getAllModulesController = async (req, res) => {
    try {
        
        const {institute_id,branch_id} = req.query
        let { page=1, perPage=10} = req.query
        const value = FilterQuery(req.query,DefaultFilterQuerys.course_modules)
        const branch = await getBranchDetailsWithUUID(branch_id)

        console.log("chec bwob",branch)
       
        const countDocs = await Module.countDocuments({...value,branch:branch._id,is_delete:false})
        const Modules = await Module.find({...value,branch:branch._id,is_delete:false}).populate("course")
;
        const total_pages = Math.ceil( countDocs/ perPage)

        res.status(200).send({
            success: true,
            message: 'Modules retrieved successfully',
            data : { data : Modules, last_page : total_pages } 
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};
