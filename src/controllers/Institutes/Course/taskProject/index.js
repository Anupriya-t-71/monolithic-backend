import { TaskProject } from "../../../../models/Institutes/Course/task_projects.js";

export const taskProjectCreate = async(req,res) => {
    try {
        const {
            instructor,
            module,
            course,
            task_name,
            question,
            task_type,
            question_file,
            deadline,
            answers 
        } = req.body;

        const newTask = new TaskProject({
            instructor,
            module,
            course,
            task_name,
            question,
            task_type,
            question_file,
            deadline,
            answers: answers || [] 
        });

        const savedTask = await newTask.save();

        res.status(201).json({
            success: true,
            message: "Task/Project created successfully",
            data: savedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating task",
            error: error.message
        });
    }

}

export const getTaskProject = async(req,res)=> {
    try {
        const { taskId, studentId } = req.params;

        // Find the task first
        const task = await TaskProject.findById(taskId).populate({path:"instructor",select:"-password -image -email"}).populate("module");
        if (!task) {
            return res.status(404).json({ 
                success: false, 
                message: "Task not found" 
            });
        }

        // Find the answer by student ID
        const studentAnswer = task.answers.find(
            ans => ans?.student?.toString() === studentId
        );

        if (!studentAnswer) {
            return res.status(404).json({ 
                success: false, 
                message: "No answer found for this student" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Student answer fetched successfully",
            data: studentAnswer
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching student answer",
            error: error.message
        });
    }
}

export const getTaskProjectByCourse = async(req,res)=> {
    try {
        const { courseid} = req.params;

        const task = await TaskProject.find({course:courseid}).populate({path:"instructor",select:"-password -image -email"}).populate("module").populate({path:"answers.student",select:"_id uuid first_name last_name email"});
        if (!task) {
            return res.status(404).json({ 
                success: false, 
                message: "Task not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Get All task by course id",
            data:task,
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error fetching student answer",
            error: error.message
        });
    }
}

export const updateTaskProject = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { student, file, status, mark, remark } = req.body;

        const task = await TaskProject.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const existingAnswer = task.answers.find(
            ans => ans?.student?.toString() === student
        );

        if (existingAnswer) {
            existingAnswer.file = file || existingAnswer.file;
            existingAnswer.status = status || existingAnswer.status;
            existingAnswer.mark = mark ?? existingAnswer.mark;
            existingAnswer.remark = remark || existingAnswer.remark;
            existingAnswer.completed_at = Date.now();
        } else {
            task.answers.push({
                student,
                file,
                status,
                mark,
                remark,
                completed_at: Date.now()
            });
        }

        const updatedTask = await task.save();

        res.status(200).json({
            success: true,
            message: existingAnswer ? "Answer updated successfully" : "Answer added successfully",
            data: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating answer",
            error: error.message
        });
    }
}

export const deleteTaskProject = async (req,res)=> {
    try {
        const {id} = req.params
        const deleteData = await TaskProject.findOneAndUpdate({_id: id}, {is_delete: true}, {new: true})
        res.status(200).json({
            success: true,
            message: "TaskProject Deleted Successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const getTaskProjectReport = async(req,res)=>{
    try {
        const {studentId,courseId} = req.params

        const data = await TaskProject.find({course:courseId})

        const track = {
            pending:0,
            completed:0,
            total:0
        }

        data.forEach((item)=>{
            item.answers.forEach((item)=>{
                if (item.student == studentId) {
                    track.completed += 1
                }else{
                    track.pending += 1
                }
            })
        })

        track.total = track.pending + track.completed

        res.status(200).json({status:"success",message:"report fetched",track})
    } catch (error) {
        res.status(500).json({status:"failed",message:error.message})
    }
}