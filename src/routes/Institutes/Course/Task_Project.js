import express  from "express"
import { deleteTaskProject, getTaskProject, getTaskProjectByCourse, getTaskProjectReport, taskProjectCreate, updateTaskProject } from "../../../controllers/Institutes/Course/taskProject/index.js";
const TaskProjectRouter = express.Router({mergeParams: true});

TaskProjectRouter.post("/", taskProjectCreate)
TaskProjectRouter.get("/get", getTaskProject)
TaskProjectRouter.get("/get/:courseid", getTaskProjectByCourse)
TaskProjectRouter.patch("/update/:taskId", updateTaskProject)
TaskProjectRouter.delete("/delete/:id", deleteTaskProject)
TaskProjectRouter.get("/:courseId/report/:studentId",getTaskProjectReport)

export default TaskProjectRouter;