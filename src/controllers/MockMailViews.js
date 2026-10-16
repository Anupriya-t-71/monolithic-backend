import { MockEmailData } from "../utils/data.js"

export const GetMockMail =(req,res)=>{
    try {
        const data = MockEmailData.reverse()
        // console.log(data)
        res.render('MockEmailView',{data})
    } catch (error) {
        console.log("mock mail",error)
        res.status(500).send('Error fetching data')
    }
}