import  { StaffTicket } from "../../../models/Institutes/Ticket/Ticket.js";
import { DefaultFilterQuerys, DefaultUpdateFields } from "../../../utils/data.js";
import { FilterQuery } from "../../../utils/helpers.js";
import Validations from "../../../validations/index.js";
import { getBatchDetailsWithUUID } from "../Batch/index.js";
import { getBrachDetailswithId } from "../Branch/index.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../common/index.js";


export const createNonTeachingTicketController = async (req,res) => {
    try{   
        const value  = Validations.createticket(req.body)
        
        const newTicket = new StaffTicket(value);
        await newTicket.save();

        res.status(200).send({
            success: true,
            message: 'New Ticket Created Successfully',
            data : newTicket
        })

    } catch(error){
        res.status(500).send({
            success: false,
            message: error.message
        })
    }

}


export const getAllNonTeachingTicketsController = async (req, res) => {
    try {
        const {institute_id,branch_id} = req.query
        const value = FilterQuery(req.query,DefaultFilterQuerys.student_ticket)
        const institue = await getInstituteDetailswithUUID(institute_id)
        const branch = await getBranchDetailsWithUUID(branch_id)
        
        let {page=1,perPage=10} = req.query
        const count = await StaffTicket.countDocuments({...value, is_deleted: false,branch:branch?._id,institute:institue?._id })
        const Tickets = await StaffTicket.find({...value, is_deleted: false,branch:branch?._id,institute:institue?._id }).populate("user")
        .skip((page-1)*perPage)
        .limit(perPage)
        const totalPages = Math.ceil(count/perPage)
        res.status(200).send({
            success: true,
            message: 'All Staff Tickets retrieved successfully',
            data:Tickets,
            last_page : totalPages
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};


export const getNonTeachingTicketByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await StaffTicket.findById(id);
        if (!ticket) {
            return res.status(404).send({
                success: false,
                message: 'Ticket not found'
            });
        }
        res.status(200).send({
            success: true,
            message: 'Ticket retrieved successfully',
            ticket
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const updateNonTeachingTicketController = async (req, res) => {
    try {
        const { id } = req.params;
        const value = FilterQuery(req.body,DefaultUpdateFields.student_ticket)

        const updatedTicket = await StaffTicket.findOneAndUpdate({uuid:id}, {value}, { new: true });
        res.status(200).send({
            success: true,
            message: 'Ticket updated successfully',
            data:updatedTicket
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const updateNonTeachingTicketStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active, ...rest } = req.body;
                
        if (Object.keys(rest).length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Only "is_active" field is allowed to be updated',
            });
        }

        const updatedTicketStatus = await StaffTicket.findByIdAndUpdate(id, { is_active }, { new: true });

        res.status(200).send({
            success: true,
            message: 'Ticket status updated successfully',
            updatedTicketStatus
        })
    
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};



export const deleteNonTeachingTicketController = async (req, res) => {
    try {
        const { id } = req.params;
        await StaffTicket.findByIdAndUpdate(id, { is_deleted: true });
        res.status(200).send({
            success: true,
            message: 'Ticket deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const searchNonTeachingTicketController = async (req, res) => {
    try {
        const { query } = req.params;

        
        const tickets = await StaffTicket.find({
            $and: [
                { is_deleted: false }, 
                { subject: { $regex: new RegExp(query, 'i') } }
               
            ]
        });

        if (tickets.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No tickets found matching the search criteria'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Tickets retrieved successfully',
            tickets
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

