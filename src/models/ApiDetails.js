import mongoose from "mongoose";

const apiDetailSchema = new mongoose.Schema({
    endpoint: {
        type: String,
        required: true,
        // unique: true
      },
      method: {
        type: String,
        enum: ['GET', 'POST', 'PUT', 'DELETE'],
        required: true
      },
      description: String,
      requestHeaders: [{
        key: String,
        value: String,
        description: String
      }],
      requestBody: mongoose.Schema.Types.Mixed,
      responseBody: mongoose.Schema.Types.Mixed,
      exampleRequest: String,
      exampleResponse: String,
      statusCodes: [{
        code: Number,
        message: String
      }],
      tags: [String],
      createdAt: {
        type: Date,
        default: Date.now
      }
    });
const ApiDetail=mongoose.model('ApiDetail',apiDetailSchema);

export default ApiDetail;