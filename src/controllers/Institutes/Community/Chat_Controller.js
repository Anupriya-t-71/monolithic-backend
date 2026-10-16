import mongoose from "mongoose";
import chatModel from "../../../models/Institutes/Community/Chat_Model.js";
import { Student,Teaching_Staff,Non_TeachingStaff } from "../../../models/Administration/Authorization/index.js";
import { getBranchDetailsWithUUID, getFullUserDetailsWithPopulate, getInstituteDetailswithUUID, getRoleDetailsWithName, getRoleDetailsWithObjectId } from "../common/index.js";
import { InstituteUser } from "../../../models/Institutes/Administration/Authorization/index.js";
import Batch from "../../../models/Institutes/Batch/index.js";
import { InstituteRoleToMainModel } from "../../../utils/helpers.js";
import Message_Model from "../../../models/Institutes/Community/Message_Model.js";

const getModelNameFromId = async (userId) => {
    const userModel = await Student.findById(userId);
    if (userModel) return 'Student';
    
    const teachingModel = await Teaching_Staff.findById(userId);
    if (teachingModel) return 'Teaching_Staff';
    
    const nonTeachingModel = await Non_TeachingStaff.findById(userId);
    if (nonTeachingModel) return 'Non_TeachingStaff';
    
    return null;
};

export const getCommunityDetailsWithStudentId = async (req,res) => {
    try {
    const {studentId} = req.params  
    const student_details = await InstituteUser.findOne({uuid:studentId}).populate({path:"userDetail",model:"Student_Login"})
    const chat = await chatModel.find({users:student_details?._id})  
    res.status(200).json({status:"sucess",message:"chats retrieved successfully",data:chat})
    } catch (error) {
      res.status(200).json({status:"failed",message:error?.message})  
    }
}

export const accesschat = async (req, res) => {
    try {
        const { userId } = req.body;
        
        const { institute_id, branch_id } = req.user;

        if (!userId) {
            return res.sendStatus(400);
        }   

        if (!req.user || !req.user._id) {
            return res.status(401).send("User not authenticated");
        }

        const userModel = await Student.findById(userId) ||
                           await Teaching_Staff.findById(userId) ||
                           await Non_TeachingStaff.findById(userId);

        if (!userModel) {
            return res.status(404).send("User not found");
        }

        const user = userModel.constructor.modelName;

        const isChat = await chatModel.findOne({
            institute_id,
            branch_id,
            isGroupChat: false,
            users: { $all: [req.user._id, userId] },
        })
        .populate({
            path: "users",
            select: "-password",
            model: mongoose.model(user),
        })
        .populate("latestMessage")
        .populate("latestMessage.sender", "first_name pic email");

        if (isChat) {
            res.send(isChat);
        } else {
            const chatData = {
                institute_id,
                branch_id,
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
                User: user, 
            };

            const createdChat = await chatModel.create(chatData);
            const fullChat = await chatModel.findOne({ _id: createdChat._id }).populate({
                path: "users",
                select: "-password",
                model: mongoose.model(user), 
            });
            res.status(200)  
            .send({
                status: true,
                fullChat
            });          
        }
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

// export const fetchchats = async (req, res) => {
//     try {
//         const { institute_id, branch_id } = req.params;

//         const { userId } = req.body;

//         if (!userId) {
//             return res.sendStatus(400);
//         }


//         if (!req.user || !req.user._id) {
//             return res.status(401).send("User not authenticated");
//         }
  
//         const chats = await chatModel.find({ users: { $elemMatch: { $eq: req.user._id } },institute_id, branch_id })
//             .populate({
//                 path: "users",
//                 select: "-password"
//             })
//             .populate("groupAdmin", "-password")
//             .populate("latestMessage")
//             .sort({ updatedAt: -1 });

//         const populatedChats = await Promise.all(chats.map(async (chat) => {
//             if (chat.latestMessage && chat.latestMessage.sender) {
//                 const senderId = typeof chat.latestMessage.sender === 'object' ? chat.latestMessage.sender._id : chat.latestMessage.sender;
//                 const senderModel = await getModelNameFromId(senderId);
//                 switch (senderModel) {
//                     case 'Student':
//                         chat.latestMessage.sender = await Student.findById(senderId, "username pic email");
//                         break;
//                     case 'Teaching_Staff':
//                         chat.latestMessage.sender = await Teaching_Staff.findById(senderId, "username pic email");
//                         break;
//                     case 'Non_TeachingStaff':
//                         chat.latestMessage.sender = await Non_TeachingStaff.findById(senderId, "username pic email");
//                         break;
//                     default:
//                         chat.latestMessage.sender = { error: "Sender's model not recognized" };
//                         break;
//                 }
//             }
//             return chat;
//         }));

//         res.status(200).send(populatedChats);
//     }  catch (error) {
//         res.status(500).send({
//             success: false,
//             message: 'Something went wrong',
//             error: error.message,
//         });
//     }
// };

export const getAllCommunities = async (req,res) => {
    try {
     const {instituteId,branchId} = req.params  
     const institue = await  getInstituteDetailswithUUID(instituteId)
     const branch =  await getBranchDetailsWithUUID(branchId)
     const communites = await chatModel.find({institute:institue._id,branch:branch._id})
     .populate({
      path:"batch",
      populate : {
        path : "course"
      }
    }).populate({path:"admin"}).populate({path:"users"}).populate({path:"last_message"})

     res.status(200).json({status:"sucess",message:"communites retrived successfully",data:communites})
    } catch (error) {
      res.status(500).json({status:"false",message:error.message})  
    }
}

export const getcommunityWithId = async (req,res) => {
    try{
    const {batchId} = req.params
    const community = await chatModel.find({batch:batchId})
    .populate({
        path:"batch",
        populate : {
          path : "course"
        }
      }).populate({path:"admin"}).populate({path:"users"}).populate({path:"last_message"})

    res.status(200).json({status:"success",message:"community retrived succesfully",data:community})
    }catch(error){
     res.status(500).json({status:"failed",message:error?.message})
    }
}

export const getCommunityWithCourse = async (req, res) => {
    try {
      const { _id, role } = req.user;
      const role_details = await getRoleDetailsWithObjectId(role);
      const user_details = await getFullUserDetailsWithPopulate(_id, InstituteRoleToMainModel[role_details?.identity]);
      const course = user_details?.userDetail?.course;
  
      const batch = await Batch.find({ course: { $in: course } });
      const batch_ids = batch?.map((batch) => batch?._id);
  
      
      const community = await chatModel.find({ batch: { $in: batch_ids } })
        .populate({ path: "users", select: "-password" })
        .populate({ path: "admin", select: "-password" })
        .populate({ path: "batch", populate: { path: "course" } });
  
      const groups_ids = community?.map((i) => i._id);
  
     const community1 = await Promise.all(groups_ids.map(async (group) => {
        const last_message = await Message_Model.findOne({ group: group }).sort({ createdAt: -1 }).exec();
        const current_community = community.find(com => com._id.toString() === group.toString());

        if (last_message) {
          if (current_community) {
            const communityWithLastMessage = {...current_community.toObject(),last_message: last_message || null};
            return communityWithLastMessage;
          }
          return current_community
        }
        return current_community
      }));
  
      // Send the response only after all updates are done
      res.status(200).json({ status: "success", message: "Communities retrieved successfully", data: community1 });
  
    } catch (error) {
      res.status(500).json({ status: "failed", message: error?.message });
    }
  };


// export const getCommunityWithCourse = async (req, res) => {
//     try {
//       const { _id, role } = req.user;
//       const role_details = await getRoleDetailsWithObjectId(role);
//       const user_details = await getFullUserDetailsWithPopulate(_id, InstituteRoleToMainModel[role_details?.identity]);
//       const course = user_details?.userDetail?.course;
  
//       const batch = await Batch.find({ course: { $in: course } });
//       const batch_ids = batch?.map((batch) => batch?._id);
  
      
//       const community = await chatModel.find({ batch: { $in: batch_ids },$or:[{users:{$in:_id}},{admin:{$in:_id}}] })
//         .populate({ path: "users", select: "-password" })
//         .populate({ path: "admin", select: "-password" })
//         .populate({ path: "batch", populate: { path: "course" } });
  
//       const groups_ids = community?.map((i) => i._id);
  
//      const community1 = await Promise.all(groups_ids.map(async (group) => {
//         const last_message = await Message_Model.findOne({ group: group }).sort({ createdAt: -1 }).exec();
//         const current_community = community.find(com => com._id.toString() === group.toString());

//         if (last_message) {
//           if (current_community) {
//             current_community.last_message = last_message;
//             return current_community
//           }
//           return current_community
//         }
//         return current_community
//       }));
  
//       // Send the response only after all updates are done
//       res.status(200).json({ status: "success", message: "Communities retrieved successfully", data: community1 });
  
//     } catch (error) {
//       res.status(500).json({ status: "failed", message: error?.message });
//     }
//   };
  

export const fetchchats = async (req, res) => {
    try {
        
        const { userId, instituteId, branchid } = req.params;
     
        if (!userId) {
            throw new Error("Missing parameters: userId");
        }

        const branch = await getBranchDetailsWithUUID(branchid);
        const institute = await getInstituteDetailswithUUID(instituteId)

        const query = {
            users: { $elemMatch: { $eq: userId } }, 
            institute_id: institute._id, 
            branch_id: branch._id 
        };
    
        const results = await chatModel.find(query);

       
        res.status(200).send({status:true,message:"chat retrived sucessfully",data:results});
    } catch (error) {
         res.status(400).send(error.message);
    }
};

export const renamegroup = async (req, res) => {
    try {
        const { userId } = req.params;
        const { chatId, chatName, grpImg } = req.body;

        const chat = await chatModel.findById(chatId);

        if (!chat) {
            return res.status(404).send("Chat not found");
        }

        // Check if the user is an admin
        const isAdmin = chat.admin.some(adminId => adminId.equals(userId));
        if (!isAdmin) {
            return res.status(403).send("Only group admin can rename the chat");
        }

        const updateFields = {};
        if (chatName) updateFields.group = chatName;
        if (grpImg) updateFields.groupimage = grpImg;

        // Update the chat document
        const updatedChat = await chatModel.findByIdAndUpdate(
            chatId,
            { $set: updateFields },
            { new: true }
        );

        res.json(updatedChat);

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};


export const addtogroup = async (req, res) => {
    const { userId } = req.params;
    const { chatId, newuser } = req.body;
    try {
        const chat = await chatModel.findOne({ _id: chatId});

        if (!chat) {
            return res.status(404).send("Chat not found");
        }
        const isAdmin = chat.admin.some(adminId => adminId.equals(userId));
        if (!isAdmin) {
            return res.status(403).send("Only group admin can add members to the group");
        }

        const adduser = await chatModel.findByIdAndUpdate(chatId, { $push: { users: { user: newuser } } }, { new: true })
            .populate("users", "-password")
            .populate("admin", "-password");
        if (!adduser) {
            res.status(404).send("Chat not found");
        } else {
            res.json(adduser);
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

export const removefromgroup = async (req, res) => {
    const { userId } = req.params;
    const { chatId, user } = req.body;
    try {

        const chat = await chatModel.findOne({ _id: chatId});

        if (!chat) {
            return res.status(404).send("Chat not found");
        }
        const isAdmin = chat.admin.some(adminId => adminId.equals(userId));
        if (!isAdmin) {
            return res.status(403).send("Only group admin can remove members to the group");
        }

        const removeuser = await chatModel.findByIdAndUpdate(chatId,
            { $pull: { users: { user: user } } },{ new: true })
            .populate("users", "-password")
            .populate("admin", "-password");
        if (!removeuser) {
            res.status(404).send("Chat not found");
        } else {
            res.json(removeuser);
        }
    }  catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};


export const UpdateCommunity= async(req,res)=>{
  try {
    const {id} = req.params;
    const {group,users,admin} = req.body
    if (!req.user) {
      res.status(400).json("access denied");
    }
    const data = await chatModel.findOneAndUpdate({_id:id},{
        group,
        $push:{
            admin:{$each:admin || []},
            users:{$each:users || []}
        }
    })

    if (!data) {
       throw new Error("group not updated db error") 
    }

    res.status(200).json({status:"done",message:"group updated success"})

  } catch (error) {
    console.log(error)
    res.status(500).json({status:"failed",message:error.message})
  }
}
export const blockuser = async (req, res) => {
    const { userId } = req.params;
    const { chatId, user,block } = req.body;
    try {

        const chat = await chatModel.findOne({ _id: chatId});

        if (!chat) {
            return res.status(404).send("Chat not found");
        }
        const isAdmin = chat.admin.some(adminId => adminId.equals(userId));
        if (!isAdmin) {
            return res.status(403).send("Only group admin can remove members to the group");
        }

        const blockuserdet = await chatModel.findByIdAndUpdate(
            chatId,
            { $set: { "users.$[elem].isblock": block } },
            { 
                new: true,
                arrayFilters: [{ "elem.user": user }]
            }
        )
        .populate("users.user", "-password")
        .populate("admin", "-password");
        
        if (!blockuserdet) {
            res.status(404).send("Chat not found");
        } else {
            res.json(blockuserdet);
        }
    }  catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};




