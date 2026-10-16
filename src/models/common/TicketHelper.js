
import mongoose from 'mongoose';
import { Sequence } from './common.js';
import Institute from '../Institutes/Institute/index.js';
import Branch from '../Institutes/Branch/index.js';

export async function generateTicketId(ticketData) {
    try {
        const { institute, branch, user } = ticketData;

        const fetchedInstitute = await mongoose.model('institutes').findById(institute);
        if (!fetchedInstitute) {
            throw new Error('Institute not found');
        }

        const fetchedBranch = await mongoose.model('branches').findById(branch);
        if (!fetchedBranch) {
            throw new Error('Branch not found');
        }

        const fetchedUser = await mongoose.model('Instituteuserlist').findById(user).populate({path:"userDetail"})
        if (!fetchedUser) {
            throw new Error('User not found');
        }

        const instituteName = fetchedInstitute.institute_name ? fetchedInstitute.institute_name.slice(0, 2).toUpperCase() : 'IN';
        const branchName = fetchedBranch.branch_identity ? fetchedBranch.branch_identity.slice(0, 2).toUpperCase() : 'BR';
        const userBatchName = fetchedUser.userDetail && fetchedUser.userDetail.batch_id && fetchedUser.userDetail.batch_id.batch_name ?
            fetchedUser.userDetail.batch_id.batch_name.slice(0, 2).toUpperCase() : 'TS';

        const sequence = await Sequence.findByIdAndUpdate(
            { _id: "TicketId" + instituteName + branchName },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const ticket_id = `${instituteName}${branchName}${userBatchName}${sequence.seq.toString().padStart(2, '0')}`;

        return ticket_id;
    } catch (error) {
        console.error('Error generating ticket ID:', error.message);
        throw error;
    }
}

export async function createInstituteAdminTicketId(data){
    try {
     const { institute, branch } = data
     
     const institute_name = institute?.institute_name?.slice(0,2).toUpperCase() ?? "IN"
     const branch_name = branch?.branch_identity?.slice(0,2).toUpperCase() ?? "BR"

     const ticket_sequence = await Sequence.findOneAndUpdate({_id: "InstituteAdminTicket" + institute_name + branch_name + "ADTKID"},{ $inc: { seq: 1 }},{ upsert: true , new: true })
     const ticket_id = "InstituteAdminTicket" + institute_name + branch_name + "ADTKID" + ticket_sequence?.seq
     return ticket_id

    } catch (error) {
      throw error
    }
}
