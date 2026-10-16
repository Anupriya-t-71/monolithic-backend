import StaffSettingModel from '../../models/Settings/Staff.js'


//use userdb populate
export const StaffSettingInfo=async(req,res)=>{
   try {
     const {userId}=req.body
    
    const data = await StaffSettingModel.findOne({userId})

     if(!data){
         res.json({status:'failed'})
      }
      res.status(200).json({status:'done',data})

   } catch (error) {
     console.log("student setting error", error)
   }
}

export const notificationSetting =async(req,res)=>{
    try {
    const {
        NewStudentAssignments,
        ClassScheduleUpdates,
        CommunityMessages,
        PaymentNotifications,
        CourseContentNotifications,
        userId
      }=req.body

      const data = await StaffSettingModel.updateOne({userId},
         {notification:{NewStudentAssignments,ClassScheduleUpdates,CommunityMessages,PaymentNotifications,CourseContentNotifications}})
      if(!data){
         res.json({status:'failed'})
      }
      res.status(200).json({status:'done'})
    } catch (error) {
        console.log('staff setting', error)
    }
}

export const UpdatePersonal=async(req,res)=>{
   try {
    const {userId,name,email,contact,image}=req.body
    const data = await StaffSettingModel.findOneAndUpdate({userId},{name,email,contact,image},{new:true}).populate('Instituteuserlist')
      if(!data){
         res.json({status:'failed'})
      }
      res.status(200).json({status:'done',data})
 } catch (error) {
  console.log("staff setting error", error)
 }
}

//file uploaded
export const PaymentSetting =(req,res)=>{
  const {taxDoc,bankFile}=req.body
  try {
    
  } catch (error) {
  console.log("staff setting error", error)
    
  }

}