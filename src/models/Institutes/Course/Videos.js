import mongoose from "mongoose";
import { generateUUID } from "../../../utils/helpers.js";
import { Sequence } from "../../common/common.js";
const Schema = mongoose.Schema

const CourseVideosSchema = new Schema({
    id : { type: Number },
    uuid : { type: String },
    title : { type: String, require: true },
    description : { type: String },
    course : { type: mongoose.Types.ObjectId, ref: "courses"},
    file : { type: String },
    url : { type: String },
    is_active : { type: Boolean, default: true},
    is_delete : { type: Boolean, default: false }
})

CourseVideosSchema.pre("save",async function(next){
    try {
    if(!this.id){
     const uuid = await generateUUID()
     const sequence = await Sequence.findByIdAndUpdate({_id:"courseVideoId"},{$set:{seq:1}},{upsert:true,new:true})
     this.id = sequence.seq
     this.uuid = uuid
     next()
    }else{
        next()
    }    
    } catch (error) {
      next(error)  
    }
})

const CourseVideoModel = mongoose.model("course_video",CourseVideosSchema)

export default CourseVideoModel