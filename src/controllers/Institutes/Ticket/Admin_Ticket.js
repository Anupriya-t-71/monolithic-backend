import { InstituteAdminTicket } from "../../../models/Institutes/Ticket/Ticket.js";
import { FilterQuery } from "../../../utils/helpers.js";
import { DefaultFilterQuerys, DefaultUpdateFields } from "../../../utils/data.js";
import { createLogger } from "../../ActivityLogs/index.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../common/index.js";
import Validations from "../../../validations/index.js";
import { createInstituteAdminTicketId } from "../../../models/common/TicketHelper.js";

const currentDate = new Date();
const options = {
  weekday: 'long', 
  day: 'numeric', 
  year: 'numeric', 
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
};
const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);


export const createInstituteAdminTicketController = async (req, res) => {
    try {
        console.log("req", req.body)
        const value   = Validations.createAdminTicket(req.body);

        console.log(value,"value")
        const branch = await getBranchDetailsWithUUID(value.branch)
        const institute = await getInstituteDetailswithUUID(value?.institute)
        const ticket_id = await createInstituteAdminTicketId({ institute,branch})
        const user = await req.user

        const newTicket = new InstituteAdminTicket({
           institute : institute?._id,
           branch : branch?._id,
           query : value?.query,
           description : value?.description,
           priority : value?.priority,
           file : value?.file,
           ticket_id : ticket_id,
           user: user?._id
        });
        await newTicket.save();

        const log_data = { role: req?.user?.role, user: user?._id, model: "InstituteAdminTickets", action: "create", 
            title: "New ticket created", details : `New Ticket - ${newTicket?.query}`,institute: institute?._id, branch: branch?._id
        }
        await createLogger(log_data)

        res.status(200).send({
            success: true,
            message: 'New Institute Admin Ticket Created Successfully',
            data: newTicket
        });
    } catch (error) {
        console.log(error,"ticketerror")
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// Get all Institute Admin Tickets with pagination
export const getAllInstituteAdminTicketsController = async (req, res) => {
    try {
        const { institute_id, branch_id , status} = req.query;
        const filterOptions = FilterQuery(req.query, DefaultFilterQuerys.admin_ticket);
        const institute = await getInstituteDetailswithUUID(institute_id);
        const branch = await getBranchDetailsWithUUID(branch_id);

        let { page = 1, perPage = 10 } = req.query;
        page = parseInt(page);
        perPage = parseInt(perPage);

        const count = await InstituteAdminTicket.countDocuments({
            ...filterOptions,
            status: status,
            is_deleted: false
        });

        const tickets = await InstituteAdminTicket.find({
            ...filterOptions,
            institute: institute?._id,
            branch: branch?._id,
            is_deleted: false,
            status: status
        })
        .populate("institute").populate({ path: "user", model: "InstituteAdmin"})
        .skip((page - 1) * perPage)
        .limit(perPage);

        const totalPages = Math.ceil(count / perPage);
        res.status(200).send({
            success: true,
            message: 'All Institute Admin Tickets retrieved successfully',
            data : { data: tickets, total: count, last_page: totalPages}
        });
    } catch (error) {
        console.log(error,"error")
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const getAllAdminTicketsController = async (req, res) => {
    try {
        const filterOptions = FilterQuery(req.query, DefaultFilterQuerys.admin_ticket);

        let { page = 1, perPage = 10 } = req.query;
        page = parseInt(page);
        perPage = parseInt(perPage);

        const count = await InstituteAdminTicket.countDocuments({
            ...filterOptions,
            is_deleted: false
        });

        const tickets = await InstituteAdminTicket.find({
            ...filterOptions,
            is_deleted: false
        })
        .populate("institute").populate({path:"user",populate:{ path: "role"}}).populate({ path: "messages.sender" })
        .populate({
            path: "messages.sender",       
            select: "name email",          
            options: { strictPopulate: false }
        })
        .skip((page - 1) * perPage)
        .limit(perPage);


        const totalPages = Math.ceil(count / perPage);
        res.status(200).send({
            success: true,
            message: 'All Institute Admin Tickets retrieved successfully',
            data : { data: tickets, total: count, last_page: totalPages }
        });
    } catch (error) {
        console.log(error,"error")
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// Get Institute Admin Ticket by ID
export const getInstituteAdminTicketByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await InstituteAdminTicket.findOne({ uuid: id });

        if (!ticket) {
            return res.status(404).send({
                success: false,
                message: 'Ticket not found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Ticket retrieved successfully',
            data: ticket
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const closeAdminTicketController = async (req,res) => {
    try {
    const { id } = req.params
    const close_ticket = await InstituteAdminTicket.findOneAndUpdate({ uuid: id}, { status: "closed"}) 
    res.status(200).json({ status: "success", message: "Ticket Closed Successfully", data: close_ticket})  
    } catch (error) {
      res.status(500).json({ status: 'failed', message: error?.message }) 
    }
}

// Update Institute Admin Ticket
export const updateInstituteAdminTicketController = async (req, res) => {
    try {
        const { id } = req.params;
        const value = FilterQuery(req.body, DefaultUpdateFields.admin_ticket);
        console.log(value,"update ticketValue",id)
        const updatedTicket = await InstituteAdminTicket.findOneAndUpdate(
            { uuid: id },
            value ,
            { new: true }
        );

        const log_data = {
            role: req.user.role,
            user: req.user._id,
            model: "InstituteAdminTickets",
            action: "Ticket Update",
            title: "Ticket Updated Successfully",
            details: null
        };
        await createLogger(log_data);

        res.status(200).send({
            success: true,
            message: 'Ticket updated successfully',
            data: updatedTicket
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

// Delete Institute Admin Ticket (Soft delete)
export const deleteInstituteAdminTicketController = async (req, res) => {
    try {
        const { id } = req.params;
        await InstituteAdminTicket.findByIdAndUpdate(id, { is_deleted: true });

        const log_data = {
            role: req.user.role,
            user: req.user._id,
            model: "InstituteAdminTickets",
            action: "Delete Ticket",
            title: "Ticket Deleted Successfully",
            details: `Ticket with ID ${id} deleted at ${new Date().toLocaleString()}`
        };
        await createLogger(log_data);

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
