import Ticket from "../../../models/Institutes/Ticket/Ticket.js";
import Validations from "../../../validations/index.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../common/index.js";



export const createTicketController = async (req,res) => {
    try{   
        const value  =Validations.createticket (req.body);

        const institute = await getInstituteDetailswithUUID(value.institute_id)
        const branch = await getBranchDetailsWithUUID(value.branch_id)


         const {query} = value; 
            const newTicket = new Ticket({...value,institute_id:institute._id,branch_id:branch._id});
         
            await newTicket.save();
            res.status(200).send({
                success: true,
                message: 'New Ticket Created Successfully',
                newTicket
            })

    } catch(error){
        res.status(500).send({
            success: false,
            message: 'something went wrong',
            error: error.message
        })
    }

}


export const getAllTicketsController = async (req, res) => {
    try {
        const Tickets = await Ticket.find({ is_deleted: false }).populate('institute_id')
        .populate('branch_id'); 
        res.status(200).send({
            success: true,
            message: 'All Tickets retrieved successfully',
            data:Tickets
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const getTicketByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findById(id);
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


export const updateTicketController = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        if (is_active !== undefined) {
            return res.status(400).send({
                success: false,
                message: 'Updating the "is_active" field is not allowed',
            });
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(id, req.body, { new: true });
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


export const updateTicketStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active, ...rest } = req.body;
                
        if (Object.keys(rest).length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Only "is_active" field is allowed to be updated',
            });
        }

        const updatedTicketStatus = await Ticket.findByIdAndUpdate(id, { is_active }, { new: true });

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



export const deleteTicketController = async (req, res) => {
    try {
        const { id } = req.params;
        await Ticket.findByIdAndUpdate(id, { is_deleted: true });
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

export const searchTicketController = async (req, res) => {
    try {
        const { query } = req.params;

        
        const tickets = await Ticket.find({
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

