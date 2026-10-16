import StudyMaterial from "../../../../models/Institutes/Course/Study_Material_Model.js";
import Course from "../../../../models/Institutes/Course/index.js";
import slugify from "slugify";
import Validations from "../../../../validations/index.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../../common/index.js";
import { FilterQuery } from "../../../../utils/helpers.js";
import { DefaultFilterQuerys, DefaultUpdateFields } from "../../../../utils/data.js";
import Branch from "../../../../models/Institutes/Branch/index.js";
import { createLogger } from "../../../ActivityLogs/index.js";
import Upload from "../../../../models/fileUpload/fileUpload.js";

export const createStudyMaterialController = async (req,res) => {
    try{  
        const value = Validations.StudyMaterialCreate(req.body);
        const { title, institute, branch, course} = value

        const instituteDetails = await getInstituteDetailswithUUID(institute)
        const branchDetails = await getBranchDetailsWithUUID(branch)        
      
        const newStudyMaterial = new StudyMaterial({...value,institute:instituteDetails._id,slug:slugify(title),branch:branchDetails?._id}); 
        await newStudyMaterial.save();
        
        Upload.updateOne({file:newStudyMaterial.file},{$set:{is_active:true}})
        
        await Course.findByIdAndUpdate(course,{$push:{studymaterials:newStudyMaterial._id}})
        const log_data = {user:req?.user?._id,role:req?.user?.role,model:"study materials",action:"create",title:"notes created",details:`${newStudyMaterial?.title} - study material created`,institute:req.user?.institute_id,branch:req.user?.branch_id}
        await createLogger(log_data)
        res.status(200).send({
            success: true,
            message: 'New StudyMaterial Created Successfully',
            data:newStudyMaterial
        })

    } catch(error){
        res.status(500).send({
            success: false,
            message: error.message
        })
    }

}

export const updateStudyMaterialController = async (req, res) => {
    try {
        const { studymaterialId } = req.params;
        const value = FilterQuery(req.body,DefaultUpdateFields.study_material)
        const updatedStudyMaterial = await StudyMaterial.findOneAndUpdate({uuid:studymaterialId}, value, { new: true });
         Upload.updateOne({file:updatedStudyMaterial.file},{$set:{is_active:true}})
        console.log(value,studymaterialId,updatedStudyMaterial)
        res.status(200).send({
            success: true,
            message: 'StudyMaterial updated successfully',
            updatedStudyMaterial
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const deleteStudyMaterialController = async (req, res) => {
    try {
        const { studymaterialId } = req.params;
        const data = await StudyMaterial.findOneAndUpdate({uuid:studymaterialId}, { is_delete: true });
        const log_data = {user:req.user._id,role:req.user?.role,model:"study material",action:"delete",title:"study material delete",details:`${data?.title} - study material deleted`,institute:req.user.institute_id,branch:req.user.branch_id}
        await createLogger(log_data)
        res.status(200).send({
            success: true,
            message: 'StudyMaterial deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

export const getAllStudyMaterialsController = async (req, res) => {
    try {
        
        let filterArgs = FilterQuery(req.query,DefaultFilterQuerys.study_material)
        const branch = await getBranchDetailsWithUUID(filterArgs.branch)

        let { page= 1 , perPage=10} = req.query

        if(Object.keys(filterArgs).length===0){
            throw new Error("study material not found")
        }
         
        const total = await StudyMaterial.countDocuments({...filterArgs,is_delete:false,branch:branch._id})
        const StudyMaterials = await StudyMaterial.find({...filterArgs,is_delete:false,branch:branch._id})
        .populate("course").skip((page-1)*perPage).limit(perPage)
    
        const last_page = Math.ceil( total/perPage)
        
        res.status(200).send({
            success: true,
            message: 'StudyMaterials retrieved successfully',
            data:{ data: StudyMaterials, last_page : last_page  }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};
