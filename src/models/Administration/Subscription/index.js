import mongoose from "mongoose"
const Schema = mongoose.Schema


import {  Sequence } from "../../common/common.js"
import * as Helpers from "../../../utils/helpers.js"

const subscriptionFeature = new Schema({
    id: { type: Number, unique: true },
    uuid: { type: String, unique: true },
    identity: { type: String, unique: true , require: true },
    description: { type: String, default: null },
    is_active : { type : Boolean, default : true },
    is_deleted : { type : Boolean, default : false }
},{ timestamps: true })

subscriptionFeature.pre("save", async function( next ){
    if(!this.id){
      try {
        const uuid = await Helpers.generateUUID()
        const sequence = await Sequence.findOneAndUpdate({_id:"SubscriptionsFeatureId"},{$inc:{seq:1}},{new: true , upsert: true })
        this.uuid = uuid 
        this.id = sequence.seq
        next()
      } catch (error) {
        next(error)
      }
    }else{
        next()
    }
})

export const SubscriptionFeatures = mongoose.model("SubscriptionsFeatures",subscriptionFeature)

const SubscriptionPlan = new Schema({
    id: { type: Number, unique: true },
    uuid: { type: String, unique: true },
    identity: { type: String, unique: true ,require: true },
    image : { type : String },
    is_popular : { type : Boolean,default:false},
    benefits : { type: Array},
    description: { type: String, },
    features: [{
        feature: { type: Schema.Types.ObjectId, ref: "SubscriptionsFeatures" ,require: true },
        count: { type: Schema.Types.Mixed, required: true } 
    }],
    duration: {
        value: { type: Number, required: true }, 
        unit: { type: String, enum: ['monthly', 'yearly','day'], required: true } 
    },
    price: { type: Number ,require: true },
    is_active : { type: Boolean, default: true},
    is_delete : { type : Boolean, default: false }
},{
  timestamps:true,
})

SubscriptionPlan.pre('save', async function(next) {
     try {
        if(!this.id){
          try{
           const uuid = await Helpers.generateUUID()
           const sequence = await  Sequence.findOneAndUpdate({_id: "SubscriptionsPlanId"},{$inc:{seq:1}},{ new: true, upsert: true })
           this.id = sequence.seq
           this.uuid = uuid
           next()
          }catch(error){
           next(error)
          }
        }else{
            next()
        }
     } catch (error) {
       next(error) 
     }
});

SubscriptionPlan.virtual("subscription_feature",{
    ref: "SubscriptionsFeatures",
    localField: "features.feature",
    foreignField: "_id",
    justOne:false,
})

export const SubscriptionPlans = mongoose.model("subscriptionsPlans",SubscriptionPlan)

const FeatureCountSchema = new Schema({
  feature: { type: Schema.Types.ObjectId, ref: "subscriptionsPlans", required: true },
  count: { type: Schema.Types.Mixed, required: true }
});

FeatureCountSchema.virtual("FeatureCount",{
  localField:"feature",
  ref:"subscriptionsPlans",
  foreignField:"features.feature"
})

const InstituteSubscriptionSchema = new Schema({
  id : { type: String, unique: true },
  uuid : { type: String, unique: true },
  instituteId: { type: Schema.Types.ObjectId, ref: "institutes", required: true },
  subscriptionId: { type: Schema.Types.ObjectId, ref: "subscriptionsPlans" },
  features: [FeatureCountSchema],
  startDate: { type: Date, required: true, default: Date.now },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'inactive', 'canceled'], default: 'active' },
    autoRenew: { type: Boolean, default: true },
    paymentMethod: { type: String, required: true },
  transactionHistory: [{
        transactionId: { type: String, required: true },
        date: { type: Date, required: true },
        amount: { type: Number, required: true }
  }],
  expirationDate: { type: Date, required: true },
  Cancelled_subscriptionId : { type: Schema.Types.ObjectId, ref: "subscriptionsPlans" },
  is_cancelled:{ type: Boolean, default: false },



},{timestamps: true ,toJSON:{virtuals:true},toObject:{virtuals:true}});

InstituteSubscriptionSchema.pre("save",async function(next){
  if(!this.id){
    try {
      const uuid = await Helpers.generateUUID()
      const sequence = await Sequence.findOneAndUpdate({_id:"InstituteSubscriptionId"},{$inc:{seq:1}},{ new: true, upsert: true })
      this.id = sequence.seq
      this.uuid = uuid
      next()
    } catch (error) {
      next(error)
    }
  }else{
    next()
  }
})

InstituteSubscriptionSchema.virtual("Institute",{
  localField:"instituteId",
  foreignField:"_id",
  ref: "institutes"
})

InstituteSubscriptionSchema.virtual("InstituteSubscription",{
  localField:"subscriptionId",
  ref:"subscriptionsPlans",
  foreignField:"_id"
})


export const InstituteSubscription = mongoose.model("InstituteSubscriptions", InstituteSubscriptionSchema);









const subscriptionSchedularSchema = new Schema({
  id: { type: Number, unique: true },
  uuid: { type: String, unique: true },
  instituteId: { type: Schema.Types.ObjectId, ref: "institutes", required: true },
  subscriptionId: { type: Schema.Types.ObjectId, ref: "subscriptionsPlans", required: true },
  schedular_history: [{
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "subscriptionsPlans" },
      identity: { type: String },
    }],
  is_scheduled : { type : Boolean, default : true },
  expirationDate: { type: Date, required: true },
  auto_renew: { type : Boolean},
  is_active : { type : Boolean, default : true },
  is_deleted : { type : Boolean, default : false }
},{ timestamps: true })

subscriptionSchedularSchema.pre("save", async function( next ){
  if(!this.id){
    try {
      const uuid = await Helpers.generateUUID()
      const sequence = await Sequence.findOneAndUpdate({_id:"SubscriptionSchedularId"},{$inc:{seq:1}},{new: true , upsert: true })
      this.uuid = uuid 
      this.id = sequence.seq
      next()
    } catch (error) {
      next(error)
    }
  }else{
      next()
  }
})

export const subscriptionSchedular = mongoose.model("SubscriptionSchedular", subscriptionSchedularSchema )