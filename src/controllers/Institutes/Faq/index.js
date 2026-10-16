import { InstituteUser } from "../../../models/Institutes/Administration/Authorization/index.js";
import Faq from "../../../models/Institutes/Faq/Faq_Model.js";
import faqValidationSchema from "../../../validations/Institutes/Faq/Faq_Models/index.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../common/index.js";
import mongoose from 'mongoose';
import { InstitutesRoles } from "../../../models/Administration/Roles_And_Permissions/index.js";
import faqcategory from "../../../models/Institutes/Faq/Category_Model.js"
import Branch from "../../../models/Institutes/Branch/index.js";
import Institute from "../../../models/Institutes/Institute/index.js";

export const createFaqController = async (req, res) => {
    try {
        const { error, value } = faqValidationSchema.validate(req.body);
        if (error && error.details) {
            const { message } = error.details[0]
            return res.status(400).json({ status: "failed", message: message })
        }

         const {category_id} = value;
            const newFaq = new Faq(value); 
            console.log("created data :",newFaq);
            await newFaq.save();

            return res.status(200).send({
                success: true,
                message: 'New Faq Created Successfully',
                newFaq
            })

    } catch(error){
        res.status(500).send({
            success: false,
            message: 'something went wrong',
            error: error.message
        })
    }

}

export const updateFaqController = async (req, res) => {
  try {
    const { uuid } = req.params;

    console.log("Received UUID:", uuid);
    console.log("Update Data:", req.body);

        if (!uuid) {
            return res.status(400).json({
                status: false,
                message: "UUID is required",
            });
        }
        
        const updatedFaq = await Faq.findOneAndUpdate({uuid:uuid}, req.body, { new: true, runValidators: true  });
        
        if (!updatedFaq) {
            return res.status(404).json({
                status: false,
                message: "FAQ not found or not updated",
                updatedFaq: null
            });
        }
        
        return res.status(200).send({
            status: true,
            message: 'Faq updated successfully',
            updatedFaq
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const updateFaqStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const updatedFaqStatus = await Faq.findByIdAndUpdate(
      id,
      { is_active },
      { new: true }
    );

        res.status(200).send({
            success: true,
            message: 'Faq status updated successfully',
            updatedFaqStatus
        })
    
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const deleteFaqController = async (req, res) => {
    try {
        const { uuid } = req.params;
        await Faq.findOneAndUpdate({uuid:uuid}, { is_deleted: true });
        res.status(200).send({
            status: true,
            message: 'Faq deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const getAllFaqsController = async (req, res) => {
  try {
    const { catid, keyword, includeDeleted, instituteId, branchid, isActive } = req.query;
    const tokendata = req.data;

    const includeDeletedFlag = includeDeleted === 'true';

   
    async function getRoleIdentity(roleId) {
      const role = await InstitutesRoles.findOne({ _id: roleId });
      return role ? role.identity : "Role not found";
    }
    const id = await getRoleIdentity(tokendata.role);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID (role) is required",
      });
    }

    let query = { accessby: { $in: [id] } };
    if (!includeDeletedFlag) query.is_deleted = false;   

  
    if (!catid) {
      const institutes = await Institute.findOne({ uuid: instituteId }).select('_id');
      const branchs = await getBranchDetailsWithUUID(branchid);
      const facat = await faqcategory.find({ institute_id: institutes._id, branch_id: branchs._id });

      if (keyword) query.title = { $regex: keyword, $options: 'i' };

      
      const faqQuery = !includeDeletedFlag ? { is_deleted: false } : {};

      const arraydata = await Promise.all(
        facat.map(item => Faq.find({ category_id: item._id, ...faqQuery }))
      );

      // Pagination
      let page = parseInt(req.query.page) || 1;
      let perPage = parseInt(req.query.perPage) || 10;
      const flatData = arraydata.flat().sort((a, b) => a.id - b.id);
      const count = flatData.length;
      const totalPages = Math.ceil(count / perPage);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return res.status(200).json({
        success: true,
        count,
        currentPage: page,
        last_page: totalPages,
        hasNextPage,
        hasPreviousPage,
        message: "All FAQs retrieved successfully",
        id,
        data: flatData.slice((page - 1) * perPage, page * perPage)
      });
    }

    
    query.category_id = catid;
    if (keyword) query.title = { $regex: keyword, $options: 'i' };

    // Fetch FAQs
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;
    const count = await Faq.countDocuments(query);
    const faqs = await Faq.find(query)
      .populate('category_id')
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalPages = Math.ceil(count / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      success: true,
      count,
      currentPage: page,
      last_page: totalPages,
      hasNextPage,
      hasPreviousPage,
      message: keyword ? "FAQs retrieved successfully with search" : "All FAQs retrieved successfully",
      id,
      data: faqs
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};


export const getFaqsByRoleController = async (req, res) => {
    try {
      const userId = req.user?._id;
      const user = await InstituteUser.findById(userId).populate({path: "role", model:"InstitutesRoles", select: "identity"})
      const role = user.role.identity;
      if (!role) {
        return res.status(400).json({ success: false,message: 'Role is required'});
      }
  
      const validRoles = ['Student', 'Institute Admin', 'Teaching Staff', 'Non Teaching Staff'];
  
      if (!validRoles.includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role provided'});
      }
  
      const faqs = await Faq.find({ accessby: role, is_deleted: false}).populate('category_id');
  
      res.status(200).json({ success: true, data: faqs});
    } catch (error) {
      res.status(500).json({success: false, message: 'Something went wrong', error: error.message,});
    }
  };

export const getFaqByIdController = async (req, res) => {
    try {
        const { _id } = req.params;
        const faq = await Faq.findById(_id).populate('category_id');
        if (!faq) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found for the provided ID',
            });
        }
        res.status(200).json({
            success: true,
            message: 'FAQ retrieved successfully',
            faq
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};
