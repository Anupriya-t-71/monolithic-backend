import PlatformFaq from "../../models/Platform/Faq_Model.js";
import { DefaultUpdateFields } from "../../utils/data.js";
import { FilterData, generateUUID } from "../../utils/helpers.js";
import Validations from "../../validations/index.js";
import faqPlatformCategory from "../../models/Platform/Category_Model.js";

export const getPlatformCategoryWithId = async (id) => {
  const category = await faqPlatformCategory.findOne({ uuid: id });
  if (!category) {
    throw new Error("faq category not found");
  }
  return category;
};

export const createFaqController = async (req, res) => {
  try {
    const value = Validations.createPlatformFaqs(req.body);
    const category = await getPlatformCategoryWithId(value.category);
    const newFaq = new PlatformFaq({ ...value, category: category._id });
    await newFaq.save();
    res.status(200).send({
      success: true,
      message: "New Faq created successfully",
      data: newFaq,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const getAllFaqsController = async (req, res) => {
  try {
    let { page = 1, perPage = 10 } = req.query;

    const totalDocs = await PlatformFaq.countDocuments({
      is_delete: false,
    }).populate("category");
    const Faqs = await PlatformFaq.find({ is_delete: false })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("category");

    const totalPage = Math.ceil(totalDocs / perPage);
    res.status(200).send({
      success: true,
      message: "All Faqs retrieved successfully",
      data: { data: Faqs, last_page: totalPage },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

export const updateFaqController = async (req, res) => {
  try {
    const { id } = req.params;
    const value = FilterData(req.body, DefaultUpdateFields.platform_faq);
    const updatedFaq = await PlatformFaq.findOneAndUpdate({ uuid: id }, value, {
      new: true,
    });
    res.status(200).send({
      success: true,
      message: "Faq updated successfully",
      data: updatedFaq,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const deleteFaqController = async (req, res) => {
  try {
    const { id } = req.params;
    await PlatformFaq.findOneAndUpdate({ uuid: id }, { is_delete: true });
    res.status(200).send({
      success: true,
      message: "Faq deleted successfully",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      err,
    });
  }
};
