import mongoose from "mongoose"
import { generateUUID } from "../../../../utils/helpers.js"
import { Sequence } from "../../../common/common.js"

const StaffAttedence = new mongoose.Schema({
    id : { type : Number },
    uuid : { type: String },
    date : { type: Date, required : true },
    institute : { type : mongoose.Types.ObjectId,ref:"institutes",required:true},
    branch : { type: mongoose.Types.ObjectId, ref: "branches" },
    status : { type: String, enum : ["present","absent"],default:null},
    staff : { type : mongoose.Types.ObjectId, ref: "Instituteuserlist" },
    is_active : { type : Boolean , default : true},
    is_delete : { type : Boolean, default : false }
})

StaffAttedence.pre("save",async function(next){
    try {
    if(!this.id){
    const uuid = await generateUUID()
    const sequence = await Sequence.findOneAndUpdate({_id:"StaffAttedenceId"},{$inc:{seq:1}},{new:true,upsert:true})
    this.uuid = uuid
    this.id = sequence.seq
    next()
    }else{
        next()
    }
    } catch (error) {
      next(error) 
    }
})

const staff_attedence = mongoose.model("staff_attedence",StaffAttedence)

export default staff_attedence