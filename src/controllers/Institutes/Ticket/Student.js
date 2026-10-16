import sendEmail from "../../../Notification/Mail.js";
import sendNotifications from "../../../config/webpush.js";
import Institute from "../../../models/Institutes/Institute/index.js";
import NotificationModel from "../../../models/Institutes/Notification/notificationSubscription.js";
import  { StudentTicket } from "../../../models/Institutes/Ticket/Ticket.js";
import { DefaultFilterQuerys, DefaultUpdateFields } from "../../../utils/data.js";
import { FilterQuery } from "../../../utils/helpers.js";
import studentValidationSchema from "../../../validations/Institutes/User/Student/index.js";
import Validations from "../../../validations/index.js";
import { createLogger } from "../../ActivityLogs/index.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../common/index.js";

const currentDate = new Date();


const options = {
  weekday: 'long', 
  day: 'numeric', 
  year: 'numeric', 
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
};

// Format the date according to the options
const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);

export const createStudentTicketController = async (req,res) => {
    try{   
        const value   = Validations.createticket(req.body)
        
        const newTicket = new StudentTicket(value); 
        await newTicket.save();
        const subscription = await NotificationModel.find({user:value.institute})
       const payload = JSON.stringify({
                 title: value.issue_type,
                 body: value.description,
                 data: {
                   url: "http://localhost:3003/student/notifications",
                 },
               });
        await sendNotifications(payload,subscription)
        const log_data = {role:req?.user?.role,user:req?.user?._id,model:"Student_tickets",action : "Ticket Create",title:"Ticket Created Successfully",details:`${newTicket?.user?.full_name} + ${formattedDate}`}
        await createLogger(log_data)
        res.status(200).send({
            success: true,
            message: 'New Ticket Created Successfully',
            data:newTicket
        })

    } catch(error){
        res.status(500).send({
            success: false,
            message: 'something went wrong',
            error: error.message
        })
    }

}


// export const getAllStudentTicketsController = async (req, res) => {
//     try {
//         const {institute_id,branch_id}  = req.query
//         const value = FilterQuery(req.query,DefaultFilterQuerys.student_ticket)
//         const institute = await getInstituteDetailswithUUID(institute_id)
//         const branch = await getBranchDetailsWithUUID(branch_id)
//         let {page=1,perPage=10} = req.query
//         parseInt(page)
//         parseInt(perPage)
//         const count = await StudentTicket.countDocuments({...value,institute:institute?._id,branch:branch?._id,is_deleted: false })
//         const Tickets = await StudentTicket.find({...value,institute:institute?._id,branch:branch?._id,is_deleted: false }).populate("user")
//         .skip((page-1)*perPage)
//         .limit(perPage)

//         const totalPages = Math.ceil(count/perPage)
//         res.status(200).send({
//             success: true,
//             message: 'All Tickets retrieved successfully',
//             data:Tickets,
//             count : count,
//             last_page : totalPages
//         });
//     } catch (error) {
//         res.status(500).send({
//             success: false,
//             message: 'Something went wrong',
//             error: error.message
//         });
//     }
// };

export const getAllStudentTicketsController = async (req, res) => {
    try {
        const studentId = req.user._id; 
        const filterOptions = FilterQuery(req.query, DefaultFilterQuerys.student_ticket);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Validate page and limit
        if (page < 1 || limit < 1) {
            return res.status(400).send({
                success: false,
                message: 'Page and limit must be positive integers'
            });
        }
        console.log(filterOptions,"filterOptions")
        // Total tickets count
        const totalTickets = await StudentTicket.countDocuments({
            ...filterOptions,
            is_deleted: false,
            user: studentId
        });
        
        // Calculate total pages
        const totalPages = Math.ceil(totalTickets / limit);
    

        // Fetch tickets with pagination
        const tickets = await StudentTicket.find({
            ...filterOptions,
            is_deleted: false,
            user: studentId
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user');

        res.status(200).send({
            success: true,
            message: 'All Tickets retrieved successfully!',
            data: {
                tickets: tickets,
                currentPage: page,
                totalPages: totalPages,
                totalTickets: totalTickets,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};



export const getAlllStudentTicketsController = async (req, res) => {
    try {
        const instituteId = req.user.institute_id; 
        const { branch_id } = req.query
        let { page=1,perPage=10} = req.query
        const filterOptions = FilterQuery(req.query, DefaultFilterQuerys.student_ticket);
        const branch_details = await getBranchDetailsWithUUID(branch_id)
        console.log(filterOptions,"filterOptions")
        const countDocs = await StudentTicket.countDocuments({   
            ...filterOptions,
            is_deleted: false,
            institute: instituteId,
            branch: branch_details?._id })

        const Tickets = await StudentTicket.find({
            ...filterOptions,
            is_deleted: false,
            institute: instituteId,
            branch: branch_details?._id
        }).populate('user').skip((page-1) *perPage).limit(perPage)
        const total_page = Math.ceil( countDocs / perPage)
        res.status(200).send({
            success: true,
            message: 'All Tickets retrieved successfully',
            data: { data: Tickets, last_page: total_page }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const getStudentTicketByIdController = async (req, res) => {
    try {
    const { id } = req.params;
    const ticket = await StudentTicket.findOne({ uuid: id }).populate({path: "user", model: "Instituteuserlist"});

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


export const updateStudentTicketController = async (req, res) => {                                      
    try {

        const { id } = req.params;
        const value = FilterQuery(req.body,DefaultUpdateFields.student_ticket)
        console.log("req", req.user)
        const updatedTicket = await StudentTicket.findOneAndUpdate({uuid:id}, value, { new: true });
        const log_data = {role:req?.user?.role,user:req?.user?._id,model:"Student_tickets",action : "Ticket Update",title:"Ticket Updated Successfully",details:`${updatedTicket.user?.full_name} + ${formattedDate}`}
        await createLogger(log_data)

        // const mailOption = {
        //   from: process.env.sender_mail,
        //   to: process.env.reciver_mail,
        //   subject: "Ticket Status Update",
        //   html: `<h1>Your Ticket has been Updated</h1><p>ticket Id is ${id}</p><p>Please vist and read our teachers resolved solution</p>`,
        // };

        // await sendEmail(mailOption)

         const subscription = await NotificationModel.find({user:updatedTicket?.user})

        const payload = JSON.stringify({
                 title: "Ticket Updated Successfully",
                 body: "Your Ticket has been Updated",
                 data: {
                   url: "http://localhost:3003/student/notifications",
                 },
               });
        await sendNotifications(payload,subscription)

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


export const updateTicketStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, ...rest } = req.body;
                
        if (Object.keys(rest).length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Only "status" field is allowed to be updated',
            });
        }

        const updatedTicketStatus = await StudentTicket.findOneAndUpdate({uuid: id}, { status },  { new: true });

        const mailOption = {
          from: process.env.sender_mail,
          to: process.env.reciver_mail,
          subject: "Ticket Status Closed",
          html: `<h1>Your Ticket has been Closed</h1><p>ticket Id is ${id}</p><p>Please vist and read our teachers resolved solution</p>`,
        };

        await sendEmail(mailOption)

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




export const deleteStudentTicketController = async (req, res) => {
    try {
        const { id } = req.params;
        await StudentTicket.findByIdAndUpdate(id, { is_deleted: true });
        const log_data = {
            role: req.user.role,
            user: req.user._id, 
            model: "Student_tickets",
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

