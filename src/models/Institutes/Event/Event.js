
// import mongoose from "mongoose";
// import { Sequence } from "../../common/common.js";
// import { generateUUID } from "../../../utils/helpers.js";

// const EventSchema = new mongoose.Schema({
//     id:{type: Number},
//     uuid: {type: String},
//     title: {
//         type: String,
//         required: true
//     },
//     event_name: {
//         type: String, 
//         required: true,
//     },
//     slug:{
//         type:String,
//         lowercase:true,
//     },
//     start_date: {
//         type: Date,
//         required: true
//     },
//     end_date: {
//         type: Date,
//         required: true
//     },
//     event_url: {
//         type: String,
//         required: true
//     },
//     guest: [{
//         type: String,
//         required: true
//     }],
//     description: {
//         type: String,
//         required: true
//     },
//     is_active: {
//         type: Boolean,
//         default: true
//     },
//     is_deleted: {
//         type: Boolean,
//         default: false
//     }
// }, {
//     timestamps: true
// });

// EventSchema.pre('save', async function(next) {
//     try {
//         if(!this.id){
//             const uuid = await generateUUID()
//             const sequence = await Sequence.findByIdAndUpdate(
//                 {_id:"EventId"},
//                 { $inc: { seq: 1 } }, 
//               { new: true, upsert: true }
//               )
//             this.uuid = uuid
//             this.id = sequence.seq
//             next();
//         }else{
//             next()
//         }

//     } catch (error) {
//         return next(error);
//     }
// });

// export default mongoose.model("Event", EventSchema);

