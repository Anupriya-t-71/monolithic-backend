import { MANotificationModel, NotificationTemplateModel } from "../../../models/Developers/MANotification/index.js"
import { generateUUID } from "../../../utils/helpers.js"
import { getMANotificationValidation } from "../../../validations/MasterNotification/index.js"

export const MasterNotificationCreate=async(req,res)=>{
 try {
    const data = req.body
        await getMANotificationValidation(req.body)

        const findtemp = await NotificationTemplateModel.findOne({tempName:data.tempName})

        if (findtemp) {
                const noti = await MANotificationModel.create({
                uuid: await generateUUID(),
                properties:{
                    type:data.type,
                    template:findtemp._id,
                    data:data.data,
                    recipients:data.recipients
                },
                trigger:data.trigger,
                meta:data.meta,
                preferences:{channels:data.channels, doNotDisturb:{start:data.startTime,end:data.endTime}},
                })

                if(!noti){
                    return res.status(500).json({status:"failed",message:"internal server error"})
                }

        
            return res.status(200).json({status:"success",message:"notification created"})
        }

        const temp = await NotificationTemplateModel.create({
            tempType:data.tempType,
            tempName:data.tempName,
            tempContent:data.tempContent,
            tempSubject:data.tempSubject
        })
 
        const noti = await MANotificationModel.create({
            uuid: await generateUUID(),
            properties:{
                type:data.type,
                template:temp._id,
                data:data.data,
                recipients:data.recipients
            },
            trigger:data.trigger,
            meta:data.meta,
            preferences:{channels:data.channels, doNotDisturb:{start:data.startTime,end:data.endTime}},
        })

        if(!noti){
            return res.status(500).json({status:"failed",message:"internal server error"})
        }

 
    res.status(200).json({status:"success",message:"notification created"})
   
 } catch (error) {
    console.log("master admin errror:",error)
    res.status(500).json({status:"failed",message:error.message})
 }
}

export const getMasterNotification =async(req,res)=>{
  try { 
    const notification = await MANotificationModel.find({}).populate({path:"properties",populate:"template"})
    res.status(200).json({status:"success",message:"retrived all notification",notification})
  } catch (error) {
      console.log("master admin errror:",error)
      res.status(500).json({status:"failed",message:error.message})
  }
}
