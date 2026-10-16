import slugify from "slugify";
import faqPlatformCategory from "../../models/Platform/Category_Model.js";
import { FilterData, FilterQuery, generateUUID } from "../../utils/helpers.js";
import Validations from "../../validations/index.js";
import { DefaultUpdateFields } from "../../utils/data.js";

export const createFaqCategoryController = async (req, res) => {
  try {
    const value = Validations.createPlatformFaq(req.body);

    const newFaqCategory = await faqPlatformCategory(value);

    await newFaqCategory.save();

    res.status(200).send({
      status: true,
      message: "new FaqCategory created successfully",
      data: newFaqCategory,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const getAllFaqCategoryController = async (req, res) => {
  try {
    let { page = 1, perPage = 10 } = req.query;

    console.log(req.query, page);
    const allfaqs=await faqPlatformCategory.find({is_deleted:false})
    const FaqCategory = await faqPlatformCategory
      .find({ is_deleted: false })
      .skip((page - 1) * perPage)
      .limit(perPage);
    const total = await faqPlatformCategory.countDocuments({
      is_deleted: false,
    });

    const totalPages = Math.ceil(total / perPage);
    res.status(200).send({
      success: true,
      message: "All FaqCategorys retrieved successfully",
      data: { data: FaqCategory, last_page: totalPages, page: page, total,all:allfaqs},
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const getFaqCategoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const FaqCategory = await faqPlatformCategory.findById(id);
    if (!FaqCategory) {
      return res.status(404).send({
        success: false,
        message: "FaqCategory not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "FaqCategory retrieved successfully",
      FaqCategory,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const updateFaqCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const value = FilterQuery(
      req.body,
      DefaultUpdateFields.platform_faq_category
    );
    const updatedFaqCategory = await faqPlatformCategory.findOneAndUpdate(
      { uuid: id },
      value,
      { new: true }
    );

    await updatedFaqCategory.save();

    res.status(200).send({
      status: true,
      message: "FaqCategory updated successfully",
      data: updatedFaqCategory,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const deleteFaqCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await faqPlatformCategory.findOneAndUpdate(
      { uuid: id },
      { is_deleted: true }
    );
    res.status(200).send({
      status: true,
      message: "FaqCategory deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
