import messageModel from "../../../models/Institutes/Community/Message_Model.js";
import chatModel from "../../../models/Institutes/Community/Chat_Model.js";
import mongoose from "mongoose";
import { Student,Teaching_Staff } from "../../../models/Administration/Authorization/index.js";
import Message_Model from "../../../models/Institutes/Community/Message_Model.js";


const StudentModel = mongoose.models.Student || mongoose.model('Student', Student.schema);
const TeachingStaffModel = mongoose.models.Teaching_Staff || mongoose.model('TeachingStaff', Teaching_Staff.schema);

export const sendMessage = async (req, res) => {
    const { userId, institute_id, branch_id } = req.params;
    const { content, chatId} = req.body;
   
    try {
        if (!content || !chatId || !institute_id || !branch_id || !userId) {
            return res.status(400).send({
                success: false,
                message: 'Invalid data passed into request',
            });
        }
      
        const chat = await chatModel.findOne({ _id: chatId, institute_id, branch_id });
        if (!chat) { 
            return res.status(404).send({
                success: false,
                message: 'Chat not found',
            });
        }

        const newMessage = {
            sender: userId,
            content: content,
            chat: chatId, 
        };

        let message = await messageModel.create(newMessage);

        message = await message.populate("sender", "username pic");
        message = await message.populate({
            path: "chat",
            populate: { path: "users", select: "username pic email" } 
        });
      
        chat.latestMessage = message;
        await chat.save();

        res.json(message);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

// export const allMessages = async (req, res) => {
//     try {
//         const { chatId } = req.params;
//         const messages = await messageModel.find({ chat: chatId })
//             // .populate("sender", "username pic email")
//             // .populate({
//             //     path: "chat",
//             //     populate: [
//             //         { path: "users", select: "username pic email", model: StudentModel },
//             //         { path: "users", select: "username pic email", model: TeachingStaffModel },
//             //         { path: "groupAdmin", select: "username pic email", model: TeachingStaffModel }
//             //     ]
//             // });
       
//         res.status(200).send({status:true,message:"messages retrived sucessfully",data:messages});
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// };

export const allMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await messageModel.find({ chat: chatId });
        res.status(200).send({ status: true, message: "Messages retrieved successfully", data: messages });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const getAllGroupMessagesWithGroupId = async (req, res) => {
    try {
        const { communityId } = req.params;
        const { page = 1, limit = 10, senderId, startDate, endDate,keyword} = req.query;

        const filter = { group: communityId };
        if (senderId) {
            filter.sender = senderId;
        }
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.createdAt.$lte = new Date(endDate);
            }
        }

        if (keyword) {
            filter.message = { $regex: keyword, $options: 'i' }; // Case-insensitive search
        }

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch messages with pagination and filtering
        const group_messages = await Message_Model.find(filter)
            .sort({ createdAt: -1 }) // Sort by creation date descending
            .skip(skip)
            // .limit(parseInt(limit));

        // Get the total count of documents matching the filter
        const totalMessages = await Message_Model.countDocuments(filter);

        res.status(200).json({
            status: 'success',
            message: 'Group messages retrieved successfully',
            data: group_messages,
            pagination: {
                totalMessages,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalMessages / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ status: 'failed', message: error.message });
    }
};


export const clearChat = async (req, res) => {
    try {
        const { chatId, userId } = req.params;

        const chat = await chatModel.findOne({ _id: chatId });
        if (!chat) {
            return res.status(404).send({
                success: false,
                message: 'Chat not found',
            });
        }

        const isAdmin = chat.groupAdmin.includes(userId);
        if (!isAdmin) {
            return res.status(403).send({
                success: false,
                message: 'User is not authorized to clear this chat',
            });
        }

        await messageModel.deleteMany({ chat: chatId });

        res.status(200).send({
            success: true,
            message: 'Chat cleared successfully',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

export const deletegroupMessage = async (req, res) => {
    try {
        const { messageId, userId } = req.params;

        const message = await messageModel.findById(messageId).populate("group")
        console.log(message)
        if (!message) {
            return res.status(404).send({
                success: false,
                message: 'Message not found',
            });
        }

        const usr = new mongoose.Types.ObjectId(userId)
      
        const isGroupMember = message.group.users.some(user => user.equals(usr));
        const isAdmin = message.group.admin.some(user => user.equals(usr));
        const isSender = message.sender.toString() === userId;


       if (!isGroupMember && !isAdmin) {
           return res.status(403).send({
               success: false,
               message: 'User is not a member of this group',
           });
       }



       if (isSender) {
         await messageModel.findByIdAndDelete(messageId);
           return   res.status(200).send({
            success: true,
            message: 'sender Message deleted successfully',
        });
       }

      
      if (isAdmin) {
        await messageModel.findByIdAndDelete(messageId);
        return res.status(200).send({
            success: true,
            message: 'admin Message deleted successfully',
        });
      }
     
        res.status(403).send({
            success: false,
            message: 'Your not sender or admin',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

 
export const deleteChat = async (req, res) => {
    try {
        const { chatId, userId } = req.params;

      
        const message = await messageModel.findOne({ chat: chatId });
        if (!message) {
            return res.status(404).send({
                success: false,
                message: 'Message not found for the given chat ID',
            });
        }
        const senderId = message.sender.toString();

        if (senderId !== userId) {
            return res.status(403).send({
                success: false,
                message: 'You are not authorized to delete this chat',
            });
        }

       
        await messageModel.deleteMany({ chat: chatId });

        res.status(200).send({
            success: true,
            message: 'Chat deleted successfully',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

// export const deleteMessage = async (req, res) => {
//     try {
//         const { messageId, userId } = req.params;

//         const message = await messageModel.findById(messageId);
//         if (!message) {
//             return res.status(404).send({
//                 success: false,
//                 message: 'Message not found',
//             });
//         }
        
//         const senderId = message.sender.toString();

//         if (senderId !== userId) {
//             return res.status(403).send({
//                 success: false,
//                 message: 'You are not authorized to delete this message',
//             });
//         }

//         await messageModel.findByIdAndDelete(messageId);

//         res.status(200).send({
//             success: true,
//             message: 'Message deleted successfully',
//         });
//     } catch (error) {
//         res.status(500).send({
//             success: false,
//             message: 'Something went wrong',
//             error: error.message,
//         });
//     }
// };
