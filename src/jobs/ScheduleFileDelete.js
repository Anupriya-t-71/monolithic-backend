import corn from 'node-cron'
import Upload from '../models/fileUpload/fileUpload.js'
import s3 from '../config/bucket.js'
import { DeleteObjectCommand ,ListObjectVersionsCommand} from '@aws-sdk/client-s3'
import { MockEmailData } from '../utils/data.js'
import { onlineuser } from '../config/socketConfig.js'

export const ScheduleFileDelete =async()=>{
    corn.schedule("0 0 * * *",async()=>{
        try {
            const data = await Upload.find({is_active:false})
            for(const files of data){
                const vid = await s3.send(new ListObjectVersionsCommand({Bucket: process.env.BUCKET_NAME, Prefix: files.file}))
                await s3.send(new DeleteObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: files.file, VersionId: vid}))
            }
            await Upload.updateMany({is_active:false},{ $set:{is_deleted:true}})         
        } catch (error) {
            console.log("schedule file delete:",error)
        }
    })

    corn.schedule("0 0 * * *",()=>{
        try {
            MockEmailData.length = 0
            onlineuser.clear()
        } catch (error) {
            console.log("schedule 12am:",error)
        }
    })
}