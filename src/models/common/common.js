import mongoose from "mongoose";

const Schema = mongoose.Schema;

const sequenceSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

export const Sequence = mongoose.model('Sequence', sequenceSchema);






