import sendNotifications from "../../config/webpush.js";
import Chat_Model from "../../models/Institutes/Community/Chat_Model.js";
import Message_Model from "../../models/Institutes/Community/Message_Model.js";
import NotificationModel from "../../models/Institutes/Notification/notificationSubscription.js";

export const handleJoin = async (socket,io) => {
   socket.on("join",async (groupId,userId)=>{
    try {
    socket.join(groupId)    
   
    const storedMessages = await Message_Model.find({ group: groupId });
    storedMessages.forEach((msg) => {
      socket.emit("message", msg);
    });
    } catch (error) {
      console.log("Error joining group:",error) 
    }
   })
}

export const handleMessage = async(socket,io) => {
    // socket.on("sendMessage", async ({ message, user, group }) => {
    //     try {
    //     //   const newMessage = new Message_Model({
    //     //     sender: user,
    //     //     message: message,
    //     //     group: group
    //     //   });
    //     //   await newMessage.save();
    //     const subscription = await NotificationModel.findOne({ user: user });
    //      if (subscription) {
    //       const payload = JSON.stringify({
    //       title: data.title,
    //       body: data.body,
    //       icon: getApplicationURL + institute?.image,
    //       data: {
    //         url: "http://localhost:3003/student/notifications",
    //       },
    //     });
    //      await sendNotifications(payload, subscription);
    //      console.log("chat webpush")
    //     }

    //       io.to(group).emit("message", message);
    //     } catch (error) {
    //       console.error("Error sending message:", error);
    //     }
    //   });
} 