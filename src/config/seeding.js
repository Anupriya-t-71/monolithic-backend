import database from "../config/database.js"; 
import dotenv from "dotenv"
import mongoose from "mongoose";
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library
dotenv.config()

import {InstitutePermissions} from '../models/Administration/Roles_And_Permissions/index.js'
import {PlatformFeatures} from '../models/Administration/Roles_And_Permissions/index.js'
import {PlatformPermissions} from '../models/Administration/Roles_And_Permissions/index.js'
import {PlatformRoles} from '../models/Administration/Roles_And_Permissions/index.js'
import {SubscriptionFeatures} from '../models/Administration/Subscription/index.js'
import {InstitutesRoles} from '../models/Administration/Roles_And_Permissions/index.js'
import {InstituteFeatures} from '../models/Administration/Roles_And_Permissions/index.js'

import {seedInstitutesRoles,seedPlatformRoles, seedPlatformfeatures, 
    seedPlatformPermission,  seedTeacherPermission,
    seedStudentPermission,
    seedAdminPermission,seedInstitutesfeatures, seedSubscriptionFeatures} from '../controllers/seeder/dbSeeder.js'
   
const filePath0= "../data/json_data/admin_permission.json";
const filePath1= "../data/json_data/features_seeding.json";
const filePath2= "../data/json_data/platform_features_seeding.json";
const filePath3= "../data/json_data/platform_permission_seeding.json";
const filePath4= "../data/json_data/platform_roles_seeding.json";
const filePath5= "../data/json_data/roles_seeding.json";
const filePath6= "../data/json_data/student_permission.json";
const filePath7= "../data/json_data/teacher_permission.json";
const filePath8= "../data/json_data/subscription_features_seeding.json";

const file_paths  = [filePath0,filePath6,filePath7,filePath1,filePath2,filePath3,filePath4,filePath5,filePath8]  
//  const file_paths  = [filePath1,filePath5,filePath7,filePath6,filePath0,filePath4,filePath2,filePath3,filePath8 ]  

const fileHandlers = {
     "admin_permission": seedAdminPermission,
     "features_seeding": seedInstitutesfeatures,
      "platform_features_seeding": seedPlatformfeatures,
    "platform_permission_seeding": seedPlatformPermission,
     "platform_roles_seeding": seedPlatformRoles,
    "roles_seeding": seedInstitutesRoles,
    "student_permission": seedStudentPermission,
    "teacher_permission": seedTeacherPermission,
     "subscription_features_seeding": seedSubscriptionFeatures
  };





for (const filePath of file_paths) {
    try {
        const jsonData = fs.readFileSync(filePath, 'utf8');
        let data = JSON.parse(jsonData);
        data = data.map(obj => ({
            ...obj,
             uuid: uuidv4() 
          }));


if (filePath.endsWith("/admin_permission.json")) {
    // console.log(filePath);
    const finaldata = JSON.stringify(data, null, 2);
    await seedAdminPermission(finaldata);

} else if  (filePath.endsWith("/features_seeding.json")) { 
    // console.log(filePath);
     const finaldata = JSON.stringify(data, null, 2);
      await seedInstitutesfeatures(finaldata);

} else if (filePath.endsWith("/platform_features_seeding.json")) {
    // console.log(filePath);
    const finaldata = JSON.stringify(data, null, 2);
      await seedPlatformfeatures(finaldata);

} else if (filePath.endsWith("/platform_permission_seeding.json")) {
    // console.log(filePath);
    const finaldata = JSON.stringify(data, null, 2);
     await seedPlatformPermission(finaldata);

} else if (filePath.endsWith("/platform_roles_seeding.json")) {
    // console.log(filePath);
    const finaldata = JSON.stringify(data, null, 2);
   await seedPlatformRoles(finaldata);

} else if (filePath.endsWith("/roles_seeding.json")) {
    // console.log(filePath);
    const finaldata = JSON.stringify(data, null, 2);
await seedInstitutesRoles(finaldata);

} else if (filePath.endsWith("/student_permission.json")) {
    //  console.log(filePath);
     const finaldata = JSON.stringify(data, null, 2);
      await seedStudentPermission(finaldata);

} else if (filePath.endsWith("/teacher_permission.json")) {
    //  console.log(filePath);
    const finaldata = JSON.stringify(data, null, 2);
     await seedTeacherPermission(finaldata);

} else if (filePath.endsWith("/subscription_features_seeding.json")) {
    //  console.log(filePath);
     const finaldata = JSON.stringify(data, null, 2);
     await seedSubscriptionFeatures(finaldata);

} else {
    console.log(`No handler found for file: ${filePath}`);
}

    } catch (error) {
        console.error(`Error reading/parsing file: ${filePath}`, error);
    }
    finally {
        console.log(`All Predefind seeding has be Completed`);

    }
}






