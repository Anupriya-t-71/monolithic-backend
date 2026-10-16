import express from "express";
import { allMessages,  clearChat,  deleteChat,  deletegroupMessage,  getAllGroupMessagesWithGroupId,  sendMessage } from "../../../controllers/Institutes/Community/MessageController.js";
import { VerifyToken } from "../../../middlewares/permission/index.js";


const MessageRouter = express.Router();


MessageRouter.post('/:institute_id/:branch_id/:userId', sendMessage);

MessageRouter.get('/:chatId', allMessages);
MessageRouter.get("/all/:communityId",VerifyToken,getAllGroupMessagesWithGroupId)

MessageRouter.delete('/group/:chatId/:userId', clearChat);

MessageRouter.delete('/group/msg/:messageId/:userId', deletegroupMessage);

MessageRouter.delete('/:chatId/:userId', deleteChat);

// MessageRouter.delete('/msg/:messageId/:userId', deleteMessage);


export default MessageRouter;