import express from "express";
import * as ActivityControllers from "../../controllers/ActivityLogs/index.js"
import { VerifyToken } from "../../middlewares/permission/index.js";

const activityLogsRouter = express.Router()


/**
 * @swagger
 * /api/institutes/user/activity:
 *   get:
 *     summary: Get user activity logs
 *     tags: [Activity Logs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user activity logs
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
activityLogsRouter.get("/",VerifyToken,ActivityControllers.getUserActivityLogs)
/**
 * @swagger
 * /api/institutes/user/activity/staff/{staffId}:
 *   get:
 *     summary: Get activity logs for a specific staff member
 *     tags: [Activity Logs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: staffId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of activity logs for the specified staff member
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Staff not found
 *       500:
 *         description: Internal Server Error
 */
activityLogsRouter.get("/staff/:staffId",ActivityControllers.getStaffActivityLogs)
activityLogsRouter.get("/student/:studentId",ActivityControllers.getStudentActivityLogs)

export default activityLogsRouter