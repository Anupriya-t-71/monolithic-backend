import express from 'express'
import { CreateHelpCenters, DeleteHelpCenters, GetAllHelpCenters, GetByIdHelpCenters, UpdateHelpCenters } from '../../../controllers/Institutes/Help_Center/Help_Faq.js'
const HelpFaqRoutes = express.Router()

HelpFaqRoutes.post('/',CreateHelpCenters)
HelpFaqRoutes.get('/all',GetAllHelpCenters)
HelpFaqRoutes.get('/get/:id',GetByIdHelpCenters)
HelpFaqRoutes.put('/update/:id',UpdateHelpCenters)
HelpFaqRoutes.delete('/delete/:id',DeleteHelpCenters)


export default HelpFaqRoutes