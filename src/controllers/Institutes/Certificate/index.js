import slugify from "slugify";
import certificate from "../../../models/Institutes/Certificate/index.js";
import Course from "../../../models/Institutes/Course/index.js";
import {
  getBranchDetailsWithUUID,
  getCourseDetailsWithUUID,
  getInstituteDetailswithUUID,
} from "../common/index.js";
import Validations from "../../../validations/index.js";
import * as Helpers from "../../../utils/helpers.js";
import {
  DefaultFilterQuerys,
  DefaultUpdateFields,
} from "../../../utils/data.js";
import Certificate from "../../../models/Institutes/Certificate/index.js";
import { StudentCertificate } from "../../../templates/Certificate/student.js";
import { HTMLtoPDF } from "../../../utils/puppeteer.js";
import path from "path"

export const createcertificateController = async (req, res) => {
  try {
    const value = Validations.createcertificate(req.body);
    const institute = await getInstituteDetailswithUUID(value.institute_id);
    const branch = await getBranchDetailsWithUUID(value.branch_id);
    const course = await getCourseDetailsWithUUID(value.course);

    const {student } = value; 

    const existingcertificate = await certificate.findOne({student:{$in : student},certificate_name:course?.course_name,is_deleted:false});

    if (existingcertificate) {
      if (existingcertificate.is_deleted) {
        return res.status(400).send({
          success: false,
          message:
            "certificate with the same name already exists but is deleted contact admin to retrieve",
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "certificate name already exists",
        });
      }
    }

    const newcertificate = new certificate({
      ...value,
      certificate_name:course.course_name,
      description:course.description,
      institute_id: institute._id,
      branch_id: branch._id,
      course: course._id,
    });

    await newcertificate.save()

    res.status(200).send({
      success: true,
      message: "New certificate Created Successfully",
      newcertificate,
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

export const updatecertificateController = async (req, res) => {
  try {
    const { certificateid } = req.params;
    const data = Helpers.FilterQuery(req.body, DefaultUpdateFields.certificate);
    const { certificate_name, is_active } = data;

    const updatedcertificateStatus = await certificate.findOneAndUpdate(
      { uuid: certificateid },
      { is_active },
      { new: true }
    );

    res.status(200).send({
      status: true,
      message: "certificate status updated successfully",
      updatedcertificateStatus: updatedcertificateStatus,
    });

    const existingcertificate = await certificate.findOne({
      slug: slugify(certificate_name),
    });

    if (existingcertificate) {
      return res.status(400).send({
        status: false,
        message: "certificate name already exists",
      });
    }
    const updatedcertificate = await certificate.findOneAndUpdate(
      { uuid: certificateid },
      data,
      { new: true }
    );
    updatedcertificate.slug = slugify(certificate_name);
    await updatedcertificate.save();

    res.status(200).send({
      status: true,
      message: "certificate updated successfully",
      updatedcertificate,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// export const updatecertificateStatusController = async (req, res) => {
// try {
// const { certificateid } = req.params;
//
// const { is_active, ...rest } = req.body;
//
// if (Object.keys(rest).length > 0) {
//     return res.status(400).send({
//         status: false,
//         message: 'Only "is_active" field is allowed to be updated',
//     });
// }
//
// const updatedcertificateStatus = await certificate.findOneAndUpdate({uuid:certificateid}, { is_active }, { new: true });
//
// res.status(200).send({
// status: true,
// message: 'certificate status updated successfully',
// updatedcertificateStatus: updatedcertificateStatus
// })
//
// } catch (error) {
// res.status(500).send({
// status: false,
// message: 'Something went wrong',
// error: error.message
// });
// }
// };
//

export const deletecertificateController = async (req, res) => {
  try {
    const { certificateid } = req.params;
    await certificate.findOneAndUpdate(
      { uuid: certificateid },
      { is_deleted: true }
    );
    res.status(200).send({
      status: true,
      message: "certificate deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getAllCertificatesController = async (req, res) => {
  try {
    const { InstituteId, branchid } = req.params;
    let { page = 1, perPage = 10 } = req.query;
    parseInt(page), parseInt(perPage);
    
    const institute = await getInstituteDetailswithUUID(InstituteId);
    const branch = await getBranchDetailsWithUUID(branchid);

    const certificates = await certificate
      .find({
        is_deleted: false,
        institute_id: institute?._id,
        branch_id: branch?._id,
      })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .populate("student");
    const count = await certificate.countDocuments({
      is_deleted:false});
    res.status(200).json({
      status: true,
      count,
      data: certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving certificates.",
      error: error.message,
    });
  }
};

export const PrintCertificate=async(req,res)=>{
  try {
       const {id} = req.params
       const data = await Certificate.findById(id)
            .populate({ path: 'institute_id' })
            .populate({ path: 'branch_id'})
            .populate({ path: 'course' })
            .populate({ path: 'batch_id', select: 'batch_code' })
            .populate({ path: 'student' })
            .exec();


      const name = data.student[0].first_name+' '+ data.student[0].last_name


      const htmlContent = StudentCertificate(name,data.course.course_name,'branch',data.certificate_name,data.description,data.course.duration)

      // HTMLtoPDF(htmlContent,id)
      // const dirname = path.resolve()
      // const exportPath = path.join(dirname,'public','ExportPdf',`${id}.pdf`)
      res.status(200).json({htmlContent})
      // res.sendFile(exportPath,(err) => {
      //   if (err) {
      //     console.error('Error sending file:', err);
      //     res.status(500).json({
      //       success: false,
      //       message: 'An error occurred while sending the file.',
      //     });
      //   }
      // })


  } catch (error) {
    console.log("print",error)
    res.status(500).json({
      success: false,
      message: "An error occurred while creating certificates.",
      error: error.message,
    });
  }
}

export const getAllCertificatesBySutdent = async (req, res) => {
  try {
    const {studentId} = req.params;
    let { page = 1, perPage = 10 } = req.query;
    parseInt(page), parseInt(perPage);

    const certificates = await certificate
      .find({
        is_deleted: false,
        student:studentId,
      })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .populate("student")
      .populate("course")
      .populate("institute_id");
    res.status(200).json({
      status: true,
      message:"student certificated fetched",
      data: certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving certificates.",
      error: error.message,
    });
  }
};