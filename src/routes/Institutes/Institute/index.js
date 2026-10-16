import express from "express";
import * as InstituteController from "../../../controllers/Institutes/Institute/index.js";
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";
import { getreports,getplatformreports } from "../../../controllers/Reports/Institute.js";

const Instituterouter = express.Router({mergeParams:true});


Instituterouter.post('/', checkTokenAndPermission("institute",'create_permission'), InstituteController.createInstituteController);
Instituterouter.get('/', checkTokenAndPermission("institute_all",'read_permission'), InstituteController.getAllInstitutesController);

 Instituterouter.put('/:id', checkTokenAndPermission("institute",'update_permission'), InstituteController.updateInstituteController);

Instituterouter.put('/update-status/:id', checkTokenAndPermission("institute",'update_permission'),  InstituteController.updateInstituteStatusController);
Instituterouter.delete('/:id', checkTokenAndPermission("institute",'delete_permission'), InstituteController.deleteInstituteController);

Instituterouter.put('/modify-status/update', checkTokenAndPermission("institute",'update_permission'), InstituteController.StatusUpdateController);

Instituterouter.get('/report/:branchid', getreports);
Instituterouter.get('/report', getplatformreports);



export default Instituterouter;