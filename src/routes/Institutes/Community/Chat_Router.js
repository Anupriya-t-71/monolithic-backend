import express from "express";
import { accesschat, addtogroup, fetchchats, removefromgroup, renamegroup ,getAllCommunities,getcommunityWithId, getCommunityDetailsWithStudentId, getCommunityWithCourse, UpdateCommunity,blockuser} from "../../../controllers/Institutes/Community/Chat_Controller.js";
import { checkSubscriptionController } from "../../../middlewares/subscription/index.js";
import { VerifyToken } from "../../../middlewares/permission/index.js";

const ChatRouter = express.Router();


ChatRouter.post('/',(req,res,next)=>checkSubscriptionController("community-support",req.user.institute_id,req,res,next),accesschat);

ChatRouter.get('/:instituteId/branch/:branchid/:userId', fetchchats);

ChatRouter.get("/:instituteId/branches/:branchId/all-community/",getAllCommunities)
ChatRouter.get("/:batchId",getcommunityWithId)
ChatRouter.get("/course/:courseId",VerifyToken,getCommunityWithCourse)
// ChatRouter.get("/course/:courseId",getCommunityWithCourse)
ChatRouter.post("/update/:id",VerifyToken,UpdateCommunity)
ChatRouter.get("/student/:studentId",getCommunityDetailsWithStudentId)
ChatRouter.put('/rename/:userId', renamegroup);
ChatRouter.put('/add/:userId', addtogroup );
ChatRouter.put('/remove/:userId', removefromgroup );
ChatRouter.put('/block/:userId', blockuser );


export default ChatRouter;