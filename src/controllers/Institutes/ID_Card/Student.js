import { IdCard, InstituteUser } from "../../../models/Institutes/Administration/Authorization/index.js"
import StudentIdCard from "../../../models/Institutes/IdCard/Student_IdCard.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../common/index.js";
import puppeteer from "puppeteer";
import path from "path";
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs"

export const getAllIdCardsController = async (req, res) => {
    try {
        const { isActive, keyword, query, batch_id, branchid, instituteid } = req.query;

        const page = req.query.page ? req.query.page : 1;
        const perPage = 10;

        const institute_details = await getInstituteDetailswithUUID(instituteid)
        const branch_details = await getBranchDetailsWithUUID(branchid)

        const totalStudentIds = await StudentIdCard.countDocuments({ institute: institute_details?._id, branch: branch_details?._id, is_deleted: false })
        const idCards = await StudentIdCard.find({ institute: institute_details?._id, branch: branch_details?._id, is_deleted: false }).populate('role')
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });

        const last_page = Math.ceil(totalStudentIds / perPage)

        res.status(200).json({ status: 'success', message: "Student ID Cards retrive successfully", data: { data: idCards, last_page } });

    } catch (error) {
        res.status(500).json({ success: 'failed', message: error?.message });
    }
};




export const updateCardStatusController = async (req, res) => {
    try {
        const { id } = req.params;

        const { is_active } = req.body;

        const updatedidcardStatus = await StudentIdCard.findOneAndUpdate({ uuid: id }, { is_active }, { new: true });

        res.status(200).send({
            status: true,
            message: 'idcard status updated successfully',
            updatedidcardStatus: updatedidcardStatus
        })

    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const createStudentsIdCards = async (data) => {
    try{
    const new_id_card = await StudentIdCard.create({...data})
    return new_id_card
    }catch(error){
     throw new Error(error?.message)
    }
}

export const updateStudentIdCard = async (uuid, data) => {
    try {
        const update_id_card = await StudentIdCard.findOneAndUpdate({ student: uuid }, data)
        return update_id_card
    } catch (error) {
        throw new error
    }
}

const __filename = fileURLToPath(import.meta.url);
console.log("FileName", __filename)
const __dirname = dirname(__filename);
console.log("DirName", __dirname)

export const downloadStudentIdCard = async (req, res) => {
    const { studentId, format } = req.body;
    const student = await InstituteUser.findOne({ _id: studentId }).populate({ path: "userDetail", populate: { path: "course" } });

    if (!student) return res.status(404).json({ error: "Student not found" });


    const getTemplate = (templateName, data) => {
        const filepath = path.join(__dirname, `${templateName}.html`);
        console.log("FilePath", filepath)
        const source = fs.readFileSync(filepath, 'utf-8').toString();
        const template = handlebars.compile(source);

        return template(data)

    }

    if (format === "pdf") {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();


        const content = getTemplate("studentId_template", {
            name: student.full_name,
            dob: student.dob,
            id: student.userDetail.studentId,
            course: student.userDetail.course.course_name,
            image: student.image

        });
        await page.setContent(content);
        const pdfBuffer = await page.pdf({ format: "A4" });
        console.log("Pdf", pdfBuffer)
        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=Student_ID_.pdf`);
        res.send(pdfBuffer);
    } else {
        res.status(400).json({ error: "Invalid format" });
    }
};

export const viewStudentIdCard = async (req, res) => {
    try {
        const student = await InstituteUser.findOne({ _id: req.params.id }).populate({ path: "userDetail", populate: { path: "course" } })
        if (!student) { return res.status(404).json({ error: "Student not found" }); }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
} 