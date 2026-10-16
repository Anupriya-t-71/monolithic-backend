import slugify from "slugify";
import Category from "../../../../models/Institutes/Category/index.js";
import Course from "../../../../models/Institutes/Course/index.js";
import Validations from "../../../../validations/index.js";
import { getInstituteDetailswithUUID } from "../../common/index.js";
import { FilterQuery } from "../../../../utils/helpers.js";
import { DefaultFilterQuerys, DefaultUpdateFields } from "../../../../utils/data.js";
import { createLogger } from "../../../ActivityLogs/index.js";
import { cleanObjectId, formatChanges, getChanges } from "../../../../utils/db_helpers/index.js";
import Upload from "../../../../models/fileUpload/fileUpload.js";

export const createCategoryController = async (req,res) => {
    try{      
        const value = Validations.CategoryCreate(req.body);
        const {instituteId} = req.params
        
        const {category_name,branch_id} = value;

        const institute = await getInstituteDetailswithUUID(instituteId)

        const existingcategory = await Category.findOne({ slug: slugify(category_name), institute_id: institute._id, branch_id: branch_id });
        console.log(existingcategory)
        if (existingcategory) {
            if (existingcategory.is_deleted) {
                return res.status(400).send({
                    success: false,
                    message: 'category with the same name already exists but is deleted contact admin to retrive',
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'category name already exists',
                });
            }
        }
          
        const newCategory = new Category({...value,branch_id:branch_id,category_name:category_name,institute_id:institute._id,slug: slugify(category_name)}); 

        await newCategory.save();
        const log_data = {role:req?.user?.role,user:req.user?._id,model:"category",action : "create",title:"new course category created",details:`${newCategory?.category_name} category created`,institute:req.user?.insitute_id,branch:req.user?.branch_id}
        await createLogger(log_data)
        //status upload
        Upload.updateOne({file:value.image},{$set:{is_active:true}})
        res.status(200).send({
            status: true,
            message: 'New Category Created Successfully',
            data:newCategory
        })

    } catch(error){
        res.status(500).send({
            success: false,
            message: 'something went wrong',
            error: error.message
        })
    }

}

export const updateCategoryController = async (req, res) => {
    try {
        const {instituteId, categoryId } = req.params;
        const institue = await getInstituteDetailswithUUID(instituteId)
        const data = FilterQuery(req.body,DefaultUpdateFields.category)
        const { category_name ,is_active } = data 
        const existingCategory = await Category.findOne({uuid:categoryId,institute_id:institue._id}) 
        const updatedCategory = await Category.findOneAndUpdate({uuid:categoryId,institute_id:institue._id}, data, { new: true });
        updatedCategory.slug = slugify(updatedCategory.category_name);
        await updatedCategory.save();
        const changes = getChanges(existingCategory.toObject(),updatedCategory.toObject())
        const log_data = {user:req?.user?._id ,role: req?.user?.role,model:"category",action:"update",title:"category updated",details:formatChanges(changes),institute: req?.user?.institute_id,branch:req?.user?.branch_id}
        await createLogger(log_data)
        res.status(200).send({
            status: true,
            message: 'Category updated successfully',
            data:updatedCategory
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
};


export const deleteCategoryController = async (req, res) => {
    try {
        const {instituteId,categoryId } = req.params;

        const institue = await getInstituteDetailswithUUID(instituteId)

        const data = await Category.findOneAndUpdate({uuid:categoryId,institute_id:institue._id}, { is_deleted: true });
        const log = {user:req?.user?._id,action:"delete",model:"category",title:"category deleted",details:`${data?.category_name} - category deleted`,role:req.user.role,institute:req.user?.institute_id,branch:req.user?.branch_id}
        await createLogger(log)
        res.status(200).send({
            status: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const getAllCategoriesController = async (req, res) => {
    try {
        const {instituteId} = req.params

        const institute = await getInstituteDetailswithUUID(instituteId)
        let {page=1,perPage=10} = req.query
        let filterArgs = FilterQuery(req.query,DefaultFilterQuerys.category)

        const count = await Category.countDocuments({...filterArgs,institute_id:institute._id,is_deleted:false})
        const categories = await Category.find({...filterArgs,institute_id:institute._id,is_deleted:false})
        .skip((page-1)*perPage).limit(perPage)

        const last_page = Math.ceil(count/perPage)

        res.status(200).json({
            status: true,
            count,
            data:categories,
            last_page
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving categories.',
            error: error.message,
        });
    }
};

export const getCategoryWithUUID = async (req,res) => {
    try {
     const {instituteId,categoryId} = req.params
     const institute = await getInstituteDetailswithUUID(instituteId)
     const category = await Category.findOne({institute_id:institute._id,uuid:categoryId})
     res.status(200).json({status:"success",message:"category retrived successfully",data:category})
    } catch (error) {
       res.status(500).json({status:"failed",message:error.message}) 
    }
}
