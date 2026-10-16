import { HelpCenterModel } from "../../../models/Institutes/Help_Center/Help_faq.js"

export const GetAllHelpCenters = async (req,res)=>{
    try {
        const data = await HelpCenterModel.find()
        res.status(200).json({status:"success",message:"fetch all help",data})
    } catch (error) {
        res.status(500).json({status:"failed",message:error.message})
    }
}

export const CreateHelpCenters = async(req,res)=>{
    try {
        const value = req.body

        const data = await HelpCenterModel.create({...value})

        res.status(200).json({status:"success",message:"created successfully",data})
    } catch (error) {
        res.status(500).json({status:"failed",message:error.message})
    }
}

export const UpdateHelpCenters = async (req,res)=>{
    try {
        const {id} = req.params
        const value = req.body

        const data = await HelpCenterModel.findByIdAndUpdate(id,{...value})

        res.status(200).json({status:"success",message:"updated successfully",data})
    } catch (error) {
        res.status(500).json({status:"failed",message:error.message})
    }
}

export const DeleteHelpCenters = async(req,res)=>{
    try {
        const {id} = req.body

        await HelpCenterModel.deleteOne({_id:id})

        res.status(200).json({status:"success",message:"deleted successfully"})
    } catch (error) {
        res.status(500).json({status:"failed",message:error.message})
    }
}

export const GetByIdHelpCenters = async(req,res)=>{
    try {
        const {id} = req.params

        const data = await HelpCenterModel.findById(id)

        res.status(200).json({status:"success",message:"data fetched",data})
    } catch (error) {
        res.status(500).json({status:"failed",message:error.message})
    }
}