import mongoose from "mongoose";

const AdminReportSchema = new mongoose.Schema({
    uuid:String,
    userId:{
      type:String,
    },
    Institute:{
     type:Array
    },
    branch:{
      type:Array
    },
     Finance:{
        type:Array
     }
    
},{
    timestamps:true
})
export default mongoose.model("AdminReportModel",AdminReportSchema)