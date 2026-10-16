import {IdCard} from "../../../models/Institutes/Administration/Authorization/index.js"
import StaffIdCard from "../../../models/Institutes/IdCard/Staff_IdCard.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../common/index.js";

export const getAllIdCardsController = async (req, res) => {
    try {
        const { InstituteId, branchid } = req.params;
        const { isActive, type, keyword, query } = req.query;
       
        const page = req.query.page ? req.query.page : 1;
        const perPage = 10;
        
        const institute_details = await getInstituteDetailswithUUID(InstituteId)
        const branch_details = await getBranchDetailsWithUUID(branchid)

        const idCardCount = await StaffIdCard.countDocuments({ institute: institute_details?._id, branch: branch_details?._id, is_deleted: false })
        const idCards = await StaffIdCard.find({ institute: institute_details?._id, branch: branch_details?._id, is_deleted: false }).populate('role')
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({createdAt: -1});

        const totalPages = Math.ceil( idCardCount/ perPage)

        res.status(200).json({
            status: "success",
            data: { data: idCards, last_page : totalPages },
        });

    } catch (error) {
        res.status(500).json({
            status: "failed",
            message:  error.message,
        });
    }
};



export const updateCardStatusController = async (req, res) => {
    try {
        const { id } = req.params;
       
        const { is_active } = req.body;
                
        const updatedidcardStatus = await StaffIdCard.findOneAndUpdate({uuid:id}, { is_active }, { new: true });

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

export const createStaffIdCards = async (data) => {
    try{
    const new_id_card = await StaffIdCard.create({...data})
    await new_id_card.save()
    return new_id_card
    }catch(error){
     throw new Error(error?.message)
    }
}

export const updateStaffIdCard = async (uuid,data) => {
    try {
     const update_id_card = await StaffIdCard.findOneAndUpdate({ student: uuid },data)  
     return update_id_card 
    } catch (error) {
      throw new error 
    }
}


