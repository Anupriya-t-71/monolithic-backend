import app from "./app.js";
import http from "http";

import {io,onlineuser,server} from "./src/config/socketConfig.js";
import initializeCronJobs from "./src/jobs/cron.js";
import { handleJoin } from "./src/services/chat/chatService.js";
import Message_Model from "./src/models/Institutes/Community/Message_Model.js";
import Chat_Model from "./src/models/Institutes/Community/Chat_Model.js";
import { getApplicationURL } from "./src/utils/helpers.js";
import NotificationModel from "./src/models/Institutes/Notification/notificationSubscription.js";
import sendNotifications from "./src/config/webpush.js";
import "./src/services/socket/notificationService.js"
import router from "./src/routes/index.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "./Swagger.js";
import express from "express";
import path from "path";
import { InstituteAdminTicket, TeachingTicket, StudentTicket } from "./src/models/Institutes/Ticket/Ticket.js";
import NotificationWaitingModel from "./src/models/WaitingNotification/index.js";
import { sendNotification } from "./src/services/socket/notificationService.js";
import InstituteNotificationSubscriptionModel from "./src/models/Institutes/Notification/instituteNotificationSubscription.js";
import mongoose from "mongoose";
// import { CornSchedule } from "./src/Notification/Corn.js";




const PORT = process.env.PORT || 3000;
const host = "0.0.0.0";

// const host = process.env.secret?.charCodeAt(0) << 8 + process.env.secret?.charCodeAt(1) === 6488064 ? process.env.localhost : "127.0.0.1"
// const server =  http.createServer(app);

// const io = socketConfig(server)





io.on("connection", (socket) => {
   
   socket.on('joinGroup',({ groupId,userId}) => {
     socket.join(groupId)
     console.log("User joined to this group id",groupId)
   })

   socket.on("joinTicket",(ticketId) => {
    socket.join(ticketId)
    console.log(`User joined ticket room: ${ticketId}`)
   })

   socket.on("sendTeacherTicketMessage", async({ ticket_id, text, senderType,user}) => {
     const message = {
      senderType: senderType,
      sender : user,
      content : text
     }
    console.log(ticket_id,text,senderType,user)
     const message_updated = await TeachingTicket.findOneAndUpdate({ uuid: ticket_id},{ $push: { messages: message }},{ new: true })
     console.log(message_updated,"message_updated")
     const last_message = message_updated.messages[message_updated?.messages?.length - 1]
     console.log(last_message)
     io.to(ticket_id).emit("receiveTeacherTicketMessage",last_message)
   })

   socket.on("sendStudentTicketMessage", async({ ticket_id, text, senderType,user}) => {
    const message = {
     senderType: senderType,
     sender : user,
     content : text
    }
   console.log(ticket_id,text,senderType,user)
    const message_updated = await StudentTicket.findOneAndUpdate({ uuid: ticket_id},{ $push: { messages: message }},{ new: true })
    console.log(message_updated,"message_updated")
    const last_message = message_updated.messages[message_updated?.messages?.length - 1]
    console.log(last_message)
    io.to(ticket_id).emit("receiveStudentTicketMessage",last_message)
  })


   socket.on("sendTicketMessage",async({ticket_id,text,senderType,user}) => {
      const message = {
        sender : user,
        senderType,
        content: text,
      }
      console.log(message,"message",ticket_id)
      const message_updated= await InstituteAdminTicket.findOneAndUpdate({ uuid: ticket_id },{ $push: { messages: message}},{ new: true })
      console.log(message_updated)
      const last_message = message_updated?.messages[message_updated.messages.length - 1]
      io.to(ticket_id).emit("receiveMessage",last_message)
      console.log(message,"delivered", last_message)
   })

   socket.on("sendMessage", async ({groupId,senderId,content,name}) => {

     try {
      console.log(name,"name",groupId,senderId,content,)
      const message = new Message_Model({
        group : groupId,
        sender : senderId,
        sender_name : name,
        message : content,
        timestamp : new Date(),
        
        status : []
      })

    const group = await Chat_Model.findById(groupId).populate({path:"batch",populate:{path:"course"}})
    // .populate({ path: "users", populate: { path: "user"}})

    let flag = false;

    try {
      group?.users?.forEach(memberId => {
        message.status.push({user:memberId.user,read:false,delivered:memberId.user.toString()!= senderId})
      })

      group?.admin?.map((memberId) => {
        message.status.push({ user: memberId, read : false, delivered: memberId.toString()!= senderId})
      })

      await message.save() 
   
      group?.users?.map(async (data) => {
      sendNotification(groupId,message)
      const subscription = await NotificationModel.findOne({user:data.user})
     
      if(subscription && data.user != senderId){
         const payload = JSON.stringify({
          title : "New Group Message",
          body :  `You have a new message ${group?.batch?.batch_name} in the group.`,
          icon : getApplicationURL + group?.batch?.course?.image,
          data : {
            url : "http://localhost:3000/student/community"
          }
        })   
        
        const users = data.user.toString()
    
        if(onlineuser.has(users)){
          await sendNotifications(payload,subscription)
          // console.log("send")
         }else{
           await NotificationWaitingModel.create({
           student:data.user,
           payload:payload
         })
        //  console.log("add waiting list")
         }
        
      }
      })
    
    await message.save() 

      group?.admin?.map(async (user) => {
     
      sendNotification(groupId,message)
      const subscription = await InstituteNotificationSubscriptionModel.findOne({user})
      if(subscription && user != senderId){
       
         const payload = JSON.stringify({
          title : "New Group Message",
          body :  `You have a new message ${group?.batch?.batch_name} in the group.`,
          icon : getApplicationURL + group?.batch?.course?.image,
          data : {
            url : "http://localhost:3000/instructor/community"
          }
        })   

        const users = user.toString()

        if(onlineuser.has(users)){
          await sendNotifications(payload,subscription)
          console.log("send")
         }else{
           await NotificationWaitingModel.create({
           student:user,
           payload:payload
         })
         console.log("add waiting list")
         }
       
      }
      })
      } catch (error) {
        flag = true;
        console.log(error,"error")
      }

      if (flag) {
         io.to(groupId).emit('newMessage',message)
      }else{
         io.to(groupId).emit('newMessage',message)        
      }
    }catch(error){
      console.log("send message error:",error)
    }
   })



   socket.on("messageDelivered", async({messageId,userId}) => {
      const message = await Message_Model.findById(messageId)
      const userStatus = message.status.find(status=>status.user === userId)
      if(userStatus&&!userStatus.delivered){
         userStatus.delivered = true,
         userStatus.timestamps = new Date()
         await message.save()
         io.to(message.group).emit("messageStatusUpdated",message)
      }
   })

   socket.on("messageRead",async({ messageId, userId}) => {
    try {
    //  const message = await Message_Model.updateMany({"status.user":userId,"status.read":false},{$set:{"status.$[elem].read":true}},{arrayFilters:[{"elem.user":userId}]})
    //  io.to(messageId).emit("messageStatusUpdated",message)
     const message = await Message_Model.findById(messageId)
     const userStatus = message.status.find(status => status.user.toString() === userId)
     if( userStatus && !userStatus?.read ){
      userStatus.read = true 
      userStatus.delivered = true
      userStatus.timestamps = new Date()
      await message.save()
      io.to(message.group).emit("messageStatusUpdated",message)
     }
    } catch (error) {
      console.log("socket",error)
    }
    
   })

})


// Define a route





app.use("/api",router)

app.post('/offline',async(req,res)=>{
 const {user}=req.body
 onlineuser.delete(user)
})

app.post('/online',async(req,res)=>{
 const {user}=req.body
 if(!onlineuser.has(user)){
  onlineuser.set(user)
 }
    try {
       const data = await NotificationWaitingModel.find({student:user})
      if(data){
         await NotificationWaitingModel.deleteMany({student:user})   
         const subscription = await NotificationModel.findOne({user:user});
            if (subscription) {
                data.map(async data =>{
                    await sendNotifications(data.payload, subscription);   
                })
            }
      }
      } catch (error) {
        console.log(error,"online user")
      }
})

initializeCronJobs()

app.use(express.static(path.join( 'public')));

 
// const swaggerSpec = swaggerJSDoc(options)
// app.use('/api-docs',SwaggerUi.serve,SwaggerUi.setup(swaggerSpec))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true, 
  swaggerOptions: {
    defaultModelsExpandDepth: -1,
    docExpansion: 'none', 
    filter: true, 
    showExtensions: true, 
    showCommonExtensions: true, 
  },
  customCssUrl: '/swagger-custom.css', 
}));






server.listen(PORT, host, () => console.log(`The application is running on ${getApplicationURL()}`));

