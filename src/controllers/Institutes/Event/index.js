// import slugify from "slugify";
// import Event from "../../../models/Institutes/Event/Event.js";
// import Validations from "../../../validations/index.js";

// export const createEventController = async (req,res) => {
//     try{   
//         const value = Validations.CreateEvent(req.body);

//          const {event_name} = value;
//         const existingevent = await Course.findOne({ slug: slugify(event_name), institute_id: institute_id, branch_id: branch_id });

//         if (existingevent) {
//             if (existingevent.is_deleted) {
//                 return res.status(400).send({
//                     success: false,
//                     message: 'Event with the same name already exists but is deleted contact admin to retrive',
//                 });
//             } else {
//                 return res.status(400).send({
//                     success: false,
//                     message: 'Event name already exists',
//                 });
//             }
//         }

//             const newEvent = new Event(req.body);  
//             newEvent.slug = slugify(event_name);      
//             await newEvent.save();
//             res.status(200).send({
//                 success: true,
//                 message: 'New Event Created Successfully',
//                 newEvent
//             })

//     } catch(error){
//         res.status(500).send({
//             success: false,
//             message: 'something went wrong',
//             error: error.message
//         })
//     }

// }

// export const updateEventController = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { event_name ,is_active } = req.body;

//         if (is_active !== undefined) {
//             return res.status(400).send({
//                 success: false,
//                 message: 'Updating the "is_active" field is not allowed',
//             });
//         }


//         const existingevent = await Event.findOne({ slug: slugify(event_name) });

//         if (existingevent) {
//             return res.status(400).send({
//                 success: false,
//                 message: 'Event name already exists',
//             });
//         } 

//         const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
//         updatedEvent.slug = slugify(event_name);
//         await updatedEvent.save();

//         res.status(200).send({
//             success: true,
//             message: 'Event updated successfully',
//             updatedEvent
//         });

       
//     } catch (error) {
//         res.status(500).send({
//             success: false,
//             message: 'Something went wrong',
//             error: error.message
//         });
//     }
// };


// export const updateEventStatusController = async (req, res) => {
//     try {
//         const { id } = req.params;
      
//         const { is_active, ...rest } = req.body;
        
//         if (Object.keys(rest).length > 0) {
//             return res.status(400).send({
//                 success: false,
//                 message: 'Only "is_active" field is allowed to be updated',
//             });
//         }
      
//         const updatedEventStatus = await Event.findByIdAndUpdate(id, { is_active }, { new: true });

//         res.status(200).send({
//             success: true,
//             message: 'Event status updated successfully',
//             updatedEventStatus
//         })
    
//     } catch (error) {
//         res.status(500).send({
//             success: false,
//             message: 'Something went wrong',
//             error: error.message
//         });
//     }
// };



// export const deleteEventController = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await Event.findByIdAndUpdate(id, { is_deleted: true });
//         res.status(200).send({
//             success: true,
//             message: 'Event deleted successfully'
//         });
//     } catch (error) {
//         res.status(500).send({
//             success: false,
//             message: 'Something went wrong',
//             error: error.message
//         });
//     }
// };

// export const getAllEventsController = async (req, res) => {
//     try {
//         const { id, keyword, instituteid, branchid, isActive, includeDeleted } = req.query;

//         let filterArgs = {};

//         if (id) {
//             const event = await Event.findById(id);
//             if (!event) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Event not found for the provided ID',
//                 });
//             }
//             return res.status(200).json({
//                 success: true,
//                 event,
//             });
//         }
             
//         if (instituteid) filterArgs.institute_id = instituteid;
//         if (branchid) filterArgs.branch_id = branchid;
//         if (isActive !== undefined) filterArgs.is_active = isActive;
//         if (includeDeleted) filterArgs.is_deleted = includeDeleted;
//         if (keyword) {
//             filterArgs.$or = [
//                 { event_name : { $regex: keyword, $options: "i" } }
//             ];
//         }



//         const events = await Event.find(filterArgs);
//         res.status(200).json({
//             success: true,
//             message: 'All events retrieved successfully',
//             events,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Something went wrong',
//             error: error.message,
//         });
//     }
// };
