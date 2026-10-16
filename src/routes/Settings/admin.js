import express from 'express'

const AdminSettingsRouter = express.Router()

AdminSettingsRouter.get('/general',()=>{})
AdminSettingsRouter.put('/general',()=>{})

AdminSettingsRouter.post('/notification',()=>{})
AdminSettingsRouter.get('/notification',()=>{})



export default AdminSettingsRouter