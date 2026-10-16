import mongoose from "mongoose";
import { generateUUID } from "../../../utils/helpers.js";
import { Sequence } from "../../common/common.js";

const courseTempleSchema = new mongoose.Schema({
   id : { type : Number},
   uuid : { type : String },
   course : { type: mongoose.Schema.Types.ObjectId,ref:"courses" },
   file : { type: String, require:true },
   is_active : { type: Boolean,default:true},
   is_delete : { type: Boolean, default: false}
})

courseTempleSchema.pre("save",async function(next){
    try {
    if(!this?.id){
      const uuid = await generateUUID()
      const sequence = await Sequence.findOneAndUpdate({_id:"CourseTemplateId"},{$inc:{seq:1}},{new:true,upsert:true})
      this.uuid = uuid
      this.id = sequence.seq
      next()
    }else{
        next()
    }   
    } catch (error) {
       return next(error) 
    }
})

const courseTempleate = mongoose.model("course_template",courseTempleSchema)

export default courseTempleate