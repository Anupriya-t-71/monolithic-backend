import { Server } from "socket.io";
import http from "http"
import app from "../../app.js";
import NotificationWaitingModel from "../models/WaitingNotification/index.js";
import NotificationModel from "../models/Institutes/Notification/notificationSubscription.js";
import mongoose from "mongoose";
import Branch from "../models/Institutes/Branch/index.js";
import sendNotifications from "./webpush.js";
import InstituteNotificationSubscriptionModel from "../models/Institutes/Notification/instituteNotificationSubscription.js";
import { getBranchDetailsWithUUID, getUserDetailsWithUUID } from "../controllers/Institutes/common/index.js";
import { sendNotification } from "../services/socket/notificationService.js";
import { MasterNotificationModel } from "../models/Notification/index.js";

const onlineuser = new Map()

const corsOrigins = [
    "http://localhost:3000",
    "http://localhost:3003",
    "http://192.168.29.174:3002",
    "http://localhost:3002",
    "http://localhost:3001",
    "http://192.168.29.174:3000",
    "https://learning-management-system-project.emern.netlify.app",
    "https://eflow-user-web.netlify.app",
    "exp://192.168.1.6:8081",
    "http://192.168.1.6:8081"
  ]

const server = http.createServer(app)
const io = new Server(server,{
     pingTimeout : 60000,
     cors:{
         origin:corsOrigins
     }
    })

    io.on("connection",(socket) => {
     console.log("Socket.IO: Client connected",socket.id)

     socket.on("registeronline",async({userId})=>{
      if(!onlineuser.has(userId)){
        onlineuser.set(userId,socket.id)
      }
         try {
       const data = await NotificationWaitingModel.find({student:userId})
      if(data){
         const subscription = await NotificationModel.findOne({user:userId});
            if (subscription) {
                data.map(async data =>{
                    await sendNotifications(data.payload, subscription);
                    await NotificationWaitingModel.findByIdAndDelete({_id:data._id})    
                }) 
                      
            }
      }
      } catch (error) {
        console.log(error,"socket")
      }
     })

       socket.on("joinNotification",async({userId}) => { 
          console.log(`institute branch joined socket room ${userId}`)
       })

     socket.on("JoinInstituteNotification",async({branchId})=>{    
        console.log(`institute branch joined socket room ${branchId}`)
     })

     socket.on("MasterNotification",async({instituteId,userId,title,branchId,body})=>{
      try {
        const data = await MasterNotificationModel.create({institute:instituteId,body,title,branch:branchId})
        if(!onlineuser.has(user)){
          await MasterNotificationModel.findOneAndUpdate({_id:data._id},{status:'waiting'})
        }else{
           sendNotification(userId,data)
        }
      } catch (error) {
        console.log(error)
      }
     }) 

     socket.on("reciveMasterNotification",async(user)=>{
       try {
         const data = await MasterNotificationModel.find({ status: 'waiting' });

        if (data.length > 0) {
            const subscription = await NotificationModel.findOne({ user: user });

            if (subscription) {
                const updatePromises = data.map(async (notification) => {
                    await sendNotifications(notification.payload, subscription);
                    return MasterNotificationModel.findOneAndUpdate(
                        { _id: notification._id },
                        { status: 'delivered' }
                    );
                });
                await Promise.all(updatePromises);
            }
        }
       } catch (error) {
         console.log(error)
       }
     })

     socket.on("disconnect",() => {
         console.log("Socket.IO: Client disconnected")
    })
})


export { io, server,onlineuser }