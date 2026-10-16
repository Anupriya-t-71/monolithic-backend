import express from "express";
import { createNoteController, deleteNoteController, getAllNotesController, updateNoteController} from "../../../controllers/Institutes/Course/Notes/index.js";
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";


const NotesRouter = express.Router();

NotesRouter.post("/",checkTokenAndPermission("Course Notes","create_permission"), createNoteController);
NotesRouter.get('/',checkTokenAndPermission("Course Notes","read_permission"),getAllNotesController);
NotesRouter.put('/update/:noteId',checkTokenAndPermission("Course Notes","update_permission"), updateNoteController);
NotesRouter.delete('/:noteId',checkTokenAndPermission("Course Notes","delete_permission"),deleteNoteController);

export default NotesRouter;