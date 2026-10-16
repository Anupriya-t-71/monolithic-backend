import InstituteNotification from "../../../models/Platform/Notifications"
import Validations from "../../../validations/index"




export const createInstituteNotificationController = async (req,res) => {
     try {
      const value = Validations.platform.instituteNotification(req.body)
      const new_notification = new InstituteNotification({...value})
      await new_notification.save()
      res.status(200).json({ status: 'success', message: "notification received successfully", data: new_notification})
     } catch (error) {
       res.status(500).json({ status: 'failed', message: error?.message})
     }
}