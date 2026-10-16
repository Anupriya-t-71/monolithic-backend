import slugify from "slugify";
import Institute from "../../../models/Institutes/Institute/index.js";

import Branch from "../../../models/Institutes/Branch/index.js";
import Batch from "../../../models/Institutes/Batch/index.js";
import Course from "../../../models/Institutes/Course/index.js"
import {Student} from "../../../models/Administration/Authorization/index.js"
import {Teaching_Staff} from "../../../models/Administration/Authorization/index.js"

import Validations from "../../../validations/index.js";
import { InstituteSubscription, SubscriptionPlans } from "../../../models/Administration/Subscription/index.js";
import { sendWelcomeEmail } from "../../../utils/CentralizedeEmailHandler/centralizedEmailControler.js";

const getSubscriptionExpireDate = ( value,unit) => {
      const expirationDate = new Date()
      
      if(unit === 'monthly'){
        expirationDate.setMonth(expirationDate.getMonth()+value)
        expirationDate.setHours(0,0,0,0)
      }else if (unit === 'yearly') {
        const currentMonth = expirationDate.getMonth(); 
        expirationDate.setFullYear(expirationDate.getFullYear() + value); 
        expirationDate.setMonth(currentMonth); 
        expirationDate.setHours(0, 0, 0, 0); 
    } else {
        throw new Error('Invalid duration unit');
    }
    return expirationDate
}

export const createInstituteController = async (req,res) => {
    try{     
        const value =  Validations.InstituteCreate(req.body) 

        const { institute_name,subscription } = value;

        const findSubscription = await SubscriptionPlans.findById(subscription)
        
        if(!findSubscription){
           return res.status(200).json({status:"failed",message:"subscription is required"})
        }
        
        const existingInstitute = await Institute.findOne({ slug: slugify(institute_name) });

        if (existingInstitute) {
            if (existingInstitute.is_deleted) {
                return res.status(400).send({
                    success: false,
                    message: 'Institute with the same name already exists but is deleted contact admin to retrive',
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'Institute name already exists',
                });
            }
        }
        const expireDate = getSubscriptionExpireDate(findSubscription.duration.value,findSubscription.duration.unit)
        const instituteFeatures = [];

        findSubscription.features.forEach(feature => {
            
            const instituteFeature = {
                feature: feature.feature,
                count: typeof(feature.count) === 'string' || typeof(feature.count) === 'boolean' ? '0' : 0 
            };

            instituteFeatures.push(instituteFeature);
        });
            const registered_date = new Date().toLocaleDateString()
            const newInstitute = new Institute({...value,registered_date}); 
            newInstitute.slug = slugify(institute_name); 
            await newInstitute.save();
            const addSubscription = await InstituteSubscription.create(
                {
                    instituteId:newInstitute._id,
                    subscriptionId:findSubscription._id,
                    features:instituteFeatures,
                    expirationDate:expireDate
                })
            await sendWelcomeEmail(value.email)
            res.status(200).send({
                success: true,
                message: 'New Institute Created Successfully',
                newInstitute
            })

    } catch(error){
        res.status(500).send({
            success: false,
            message: 'something went wrong',
            error: error.message
        })
    }

}

export const updateInstituteController = async (req, res) => {
    try {
        console.log("came into status update");

        const { instituteId } = req.params;
        const { institute_name ,is_active } = req.body;

        if (is_active !== undefined) {
            return res.status(400).send({
                success: false,
                message: 'Updating the "is_active" field is not allowed',
            });
        }
         
        const updatedInstitute = await Institute.findOneAndUpdate({uuid:instituteId}, req.body, { new: true });

        if(institute_name){
        const existingInstitute = await Institute.findOne({ slug: slugify(institute_name) });
        if (existingInstitute) {
            return res.status(400).send({
                success: false,
                message: 'Institute name already exists',
            });
        }
        updatedInstitute.slug = slugify(institute_name); 
    }             
      
        await updatedInstitute.save();
  
        res.status(200).send({
            success: true,
            message: 'Institute updated successfully',
            updatedInstitute
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};



export const updateInstituteStatusController = async (req, res) => {
    try {
        const { instituteId } = req.params;
       
        const { is_active, ...rest } = req.body;
            
        if (Object.keys(rest).length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Only "is_active" field is allowed to be updated',
            });
        }
        const updatedInstituteStatus = await Institute.findByIdAndUpdate({uuid:instituteId}, { is_active }, { new: true });

        res.status(200).send({
            success: true,
            message: 'institute status updated successfully',
            updatedInstituteStatus
        })  
    
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const deleteInstituteController = async (req, res) => {
    try {
        const { instituteId } = req.params;
        await Institute.findOneAndUpdate({uuid:instituteId}, { is_deleted: true });
        res.status(200).send({
            success: true,
            message: 'Institute deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const getAllInstitutesController = async (req, res) => {
    try {
        const {instituteId} = req.params
        const { isActive, keyword, includeDeleted } = req.query;
        let filterArgs = {};

        if (instituteId) {
            const institute = await Institute.findOne({uuid:instituteId});

            if (institute) {

                const institute_id = institute._id
                 const institutesubscriptiondetails = await InstituteSubscription.findOne({instituteId:institute_id})

                // const findSubscription = await SubscriptionPlans.findById(subscription)

                const branches = await Branch.find({institute_id:institute_id})
                const branchesWithData = [];

                for (const branch of branches) {
                    const branch_id = branch._id

                    const courses = await Course.find({branch_id:branch_id})
                    const coursesWithData = [];

                    if (courses.length > 0) {
                        console.log("Courses for branch " + branch_id  );
                        for (const course of courses) {
                            console.log("the course id for the branch "+course._id); 

                  const students = await Student.find({course:course._id})
                  const teachers = await Teaching_Staff.find({ course: { $in: course._id } });

                
                  

                  coursesWithData.push({
                    ...course._doc, 
                    students: students,
                    teachers: teachers,
                });
            }
            
                    } else {
                        console.log("No courses found for branch " + branch_id);
                    }
                    branchesWithData.push({
                        ...branch._doc,
                        courses: coursesWithData,
                    });
                }
            
                return res.status(200).json({
                    success: true,
                    institute,institutesubscriptiondetails,branches: branchesWithData,

                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Institute not found for the provided ID',
                });
            }
        }

        if (isActive !== undefined) {
            filterArgs.is_active = isActive;
        }

        if (includeDeleted) {
            filterArgs.is_deleted = includeDeleted;
        }

        if (keyword) {
            filterArgs.$or = [
                { institute_name: { $regex: keyword, $options: "i" } }
            ];
        }

        const institutes = await Institute.findOne({uuid:instituteId})
       


        res.status(200).json({
            success: true,
            message: 'Institutes retrieved successfully',
            institutes
            
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};







export const StatusUpdateController = async (req, res) => {
    try {
        const { instituteId } = req.params;
        const { status } = req.body;
        console.log(instituteId);
        await Institute.findOneAndUpdate({uuid:instituteId}, { Institute_Status: status });
        res.status(200).send({
            success: true,
            message: 'Institute Status updated successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};
