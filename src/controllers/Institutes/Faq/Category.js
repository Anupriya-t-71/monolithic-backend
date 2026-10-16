import slugify from "slugify";
import FaqCategory from "../../../models/Institutes/Faq/Category_Model.js";
import faqcategoryValidationSchema from "../../../validations/Institutes/Faq/Faq_Category/index.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../common/index.js";
import { FilterData } from "../../../utils/helpers.js";
import { DefaultFilterQuerys, DefaultUpdateFields } from "../../../utils/data.js";


export const createFaqCategoryController = async (req,res) => {
    
    try{      
        console.log("req body :",req.body);
        const { error,value } =faqcategoryValidationSchema.validate(req.body);
        console.log("error :",error);
        console.log("value :",value);
        
        if(error&&error.details){
            const {message} = error.details[0]
            return res.status(400).json({status:"failed",message:message})
         }

         const {category_name,institute_id, branchid} = value;

         

         const branch = await getBranchDetailsWithUUID(branchid);
         if (!branch) {
             return res.status(404).json({ success: false, message: "Branch not found" });
         }

         
        const existingcategory = await FaqCategory.findOne({ slug: slugify(category_name), institute_id: institute_id,  branch_id: branch._id });


        if (existingcategory) {
            if (existingcategory.is_deleted) {
                return res.status(400).send({
                    status: false,
                    message: 'category with the same name already exists but is deleted contact admin to retrive',
                });
            } else {
                return res.status(400).send({
                    status: false,
                    message: 'category name already exists',
                });
            }
        }
   
            const newFaqCategory = new FaqCategory({ ...req.body, branch_id: branch._id }); 
            newFaqCategory.slug = slugify(category_name);

            await newFaqCategory.save();
            console.log(newFaqCategory," newFaqCategory");
            res.status(200).send({
                status: true,
                message: 'New FaqCategory Created Successfully',
                newFaqCategory
            })

    } catch(error){
        res.status(500).send({
            status: false,
            message: 'something went wrong',
            error: error.message
        })
    }
}

export const updateFaqCategoryController = async (req, res) => {
    try {
        const { uuid } = req.params;
        
        const { category_name,accessby } = req.body;
        const data = FilterData(req.body,DefaultUpdateFields.faq_category)

        const existingCategory = await FaqCategory.findOne({ uuid:uuid});

        

        if (existingCategory && existingCategory.uuid != uuid) {
            return res.status(400).send({
                status: false,
                message: 'Category name already exists',
            });
        } 
        
        const updatedFaqCategory = await FaqCategory.findOneAndUpdate({uuid:uuid},data, { new: true });
        // updatedFaqCategory.slug = slugify(category_name);
        // await updatedFaqCategory.save();

        res.status(200).send({
            status: true,
            message: 'FaqCategory updated successfully',
            updatedFaqCategory
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const deleteFaqCategoryController = async (req, res) => {
    try {
        const { uuid } = req.params;
        await FaqCategory.findOneAndUpdate({uuid:uuid}, { is_deleted: true });
        res.status(200).send({
            status: true,
            message: 'FaqCategory deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const getAllFaqCategorysController = async (req, res) => {
    try {
        console.log('hello');
        const {branchid,instituteid} = req.query;
        console.log("req query :",req.query);
        console.log("req body :",req.body);
        console.log("branchid :",branchid);
        console.log("instituteid :",instituteid);

        let filterArgs = FilterData(req.query,DefaultFilterQuerys.faq_category)
        
        const institute = await getInstituteDetailswithUUID(instituteid)
        console.log("institutedata :",institute);
        const branch = await getBranchDetailsWithUUID(branchid)

        let {page=1,perPage=10} = req.query
        page = parseInt(page)
        perPage = parseInt(perPage)

        const count = await FaqCategory.countDocuments({...filterArgs,is_deleted:false,institute_id:institute._id})

        const faqCategories = await FaqCategory.find({...filterArgs,is_deleted:false,institute_id:institute._id})
        .skip((page-1)*perPage)
        .limit(perPage)

        const totalPages = Math.ceil(count / perPage);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        res.status(200).json({
            status: true,
            count : count,
            currentPage: page,
            last_page:totalPages,
            hasNextPage,
            hasPreviousPage,
            message:'All FAQ categories retrieved successfully',
            data: faqCategories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const getFaqCategoryByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        const faqCategory = await FaqCategory.findOne({ _id: id, is_deleted: false });

        if (!faqCategory) {
            return res.status(404).json({
                success: false,
                message: 'FAQ category not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'FAQ category retrieved successfully',
            data: faqCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

