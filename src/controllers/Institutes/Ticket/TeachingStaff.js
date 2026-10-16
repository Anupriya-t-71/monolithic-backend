import  { TeachingTicket } from "../../../models/Institutes/Ticket/Ticket.js";
import { DefaultFilterQuerys } from "../../../utils/data.js";
import { FilterQuery } from "../../../utils/helpers.js";
import Validations from "../../../validations/index.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../common/index.js";


export const createTeachingTicketController = async (req,res) => {
    try{   
        const value = Validations.createticket(req.body)

        const newTicket = new TeachingTicket(value);
        
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

export const getTechingTicketControllerWithUserId = async (req,res) => {
    try {
        const staffId = req.user._id
        const filterOptions = FilterQuery(req.query,DefaultFilterQuerys.teaching_staff_ticket)
        const Tickets = await TeachingTicket.find({...filterOptions,is_deleted: false, user : staffId });
        res.status(200).send({
            success: true,
            message: 'All Tickets retrieved successfully',
            data : Tickets
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
}


export const getAllTeachingTicketsController = async (req, res) => {
    try {
        const {institute_id,branch_id} = req.query
        let { page=1,perPage=10} = req.query
        const institute = await getInstituteDetailswithUUID(institute_id)
        const branch = await getBranchDetailsWithUUID(branch_id)
        const filterOptions = FilterQuery(req.query,DefaultFilterQuerys.teaching_staff_ticket)
        
        const totalTickets = await TeachingTicket.countDocuments({ ...filterOptions, is_deleted: false,institute: institute?._id, branch: branch?._id})
        const Tickets = await TeachingTicket.find({...filterOptions,is_deleted: false,institute:institute?._id,branch:branch?._id})
                              .skip((page-1) * perPage).limit(perPage).populate({ path: "user", model: "Instituteuserlist"})

        const total_pages = Math.ceil( totalTickets / perPage )
        res.status(200).send({
            success: true,
            message: 'All Tickets retrieved successfully',
            data : { data: Tickets, last_page: total_pages } 
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const getTeachingTicketByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await TeachingTicket.findOne({ uuid: id }).populate({path: "user", model: "Instituteuserlist"});
    
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


export const updateTeachingTicketController = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        if (is_active !== undefined) {
            return res.status(400).send({
                success: false,
                message: 'Updating the "is_active" field is not allowed',
            });
        }

        const updatedTicket = await TeachingTicket.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).send({
            success: true,
            message: 'Ticket updated successfully',
            updatedTicket
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const updateTeachingTicketStatusController = async (req, res) => {
    try {
        const { id } = req.params;  
        const { status, ...rest } = req.body;
                
        if (Object.keys(rest).length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Only "status" field is allowed to be updated',
            });
        }

        const updatedTicketStatus = await TeachingTicket.findOneAndUpdate({uuid: id}, { status:"closed" }, { new: true });

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



export const deleteTeachingTicketController = async (req, res) => {
    try {
        const { id } = req.params;
        await TeachingTicket.findByIdAndUpdate(id, { is_deleted: true });
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

export const searchTeachingTicketController = async (req, res) => {
    try {
        const { query } = req.params;

        
        const tickets = await TeachingTicket.find({
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

