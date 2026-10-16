

import {InstitutePermissions} from '../../models/Administration/Roles_And_Permissions/index.js'
import {PlatformFeatures} from '../../models/Administration/Roles_And_Permissions/index.js'
import {PlatformPermissions} from '../../models/Administration/Roles_And_Permissions/index.js'
import {PlatformRoles} from '../../models/Administration/Roles_And_Permissions/index.js'
import {SubscriptionFeatures} from '../../models/Administration/Subscription/index.js'
import {InstitutesRoles} from '../../models/Administration/Roles_And_Permissions/index.js'
import {InstituteFeatures} from '../../models/Administration/Roles_And_Permissions/index.js'
import { Sequence } from "../../models/common/common.js";

  async function updateSequence(sequenceId, count) {
	if (count === 0) return; 

	await Sequence.findByIdAndUpdate(
		{ _id: sequenceId }, 
		{ $inc: { seq: count } },  // Increase seq by count
		{ new: true, upsert: true }
	);

	console.log(`Updated sequence '${sequenceId}' by ${count}`);
}


export async function seedInstitutesRoles(data) {
	try {
		const count = await InstitutesRoles.countDocuments();
        data = JSON.parse(data)
		if (count === 0) {
			const insertedDocs =await InstitutesRoles.insertMany(data);
			console.log(`Predefined institute roles added: ${insertedDocs.length}`);
            await updateSequence("InstitutesRolesId",insertedDocs.length)

		} else {
            const existingRecords = await InstitutesRoles.find({}, { id: 1 });
			const existingIds = existingRecords.map(record => record.id);
            const missingRoles = data.filter(role => !existingIds.includes(Number(role.id)));
            if (missingRoles.length > 0) {
				const missedinsertedDocs = 	await InstitutesRoles.insertMany(missingRoles);
				console.log('Inserted missing institute roles.');
				console.log(`Predefined institute roles added: ${missedinsertedDocs.length}`);
				await updateSequence("InstitutesRolesId",missedinsertedDocs.length)

			} else {
				console.log('All institute roles are already present. No new insertions.');
			}
		}
	} catch (error) {
		console.error('Error seeding InstitutesRoles:', error);
	}
}



export async function seedInstitutesfeatures(data) {
	try {
        data = JSON.parse(data)

		const count = await InstituteFeatures.countDocuments();
		if (count === 0) {

			const insertedDocs =await InstituteFeatures.insertMany(data);
			console.log(`Predefined institute features added: ${insertedDocs.length}`);
            await updateSequence("InstituteFeatureId",insertedDocs.length)

		} else {
			const findvalues = await InstituteFeatures.find({}, { id: 1 })
			const extractedid = findvalues.map((value) => value.id)
			const missingfeature = data.filter(role => !extractedid.includes(Number(role.id)));
			if (missingfeature.length > 0) {
				const missedinsertedDocs = await InstituteFeatures.insertMany(missingfeature);
				console.log("Inserted missing Institute features")
				console.log(`Predefined institute features added: ${missedinsertedDocs.length}`);
				await updateSequence("InstituteFeatureId",missedinsertedDocs.length)

			}
			console.log('All institute features are already present. No new insertions.');
		}
	} catch (error) {
		console.error('Error seeding InstitutesRoles:', error);
	}
}




export async function seedAdminPermission(data) {
	try {
        data = JSON.parse(data)
		const count = await InstitutePermissions.countDocuments();
		if (count === 0) {
			const insertedDocs = await InstitutePermissions.insertMany(data);
			console.log(`Predefined Admin permissions added: ${insertedDocs.length}`);
            await updateSequence("InstitutionPermissionIds",insertedDocs.length)
		} else { 
			const findvalues = await InstitutePermissions.find({}, { id: 1 })
			const extractedid = findvalues.map((value) => value.id)
			const missingfeature = data.filter(role => !extractedid.includes(Number(role.id)));

			if (missingfeature.length > 0) {
				const missedinsertedDocs = 	await InstitutePermissions.insertMany(missingfeature);
				console.log("Inserted missing admin default features ")
				console.log(`Predefined Admin permissions added: ${missedinsertedDocs.length}`);
				await updateSequence("InstitutionPermissionIds",missedinsertedDocs.length)

			}else{
				console.log('All Admin permission are already present. No new insertions.');
			}
		}
	} catch (error) {
		console.error('Error seeding InstitutesPermission:', error);
	}
}




export async function seedTeacherPermission(data) {
	try {
        data = JSON.parse(data)

		const count = await InstitutePermissions.countDocuments();
		if (count === 0) {
			const insertedDocs = await InstitutePermissions.insertMany(data);
			console.log(`Predefined Teacher permissions added: ${insertedDocs.length}`);
			await updateSequence("InstitutionPermissionIds",insertedDocs.length)

		} else { 
			const findvalues = await InstitutePermissions.find({}, { id: 1 })
			const extractedid = findvalues.map((value) => value.id)
			const missingfeature = data.filter(role => !extractedid.includes(Number(role.id)));
			if (missingfeature.length > 0) {
				const missedinsertedDocs =  await InstitutePermissions.insertMany(missingfeature);
				console.log("Inserted missing Teacher default features ")
				console.log(`Predefined Teacher permissions added: ${missedinsertedDocs.length}`);
				await updateSequence("InstitutionPermissionIds",missedinsertedDocs.length)

			}
			else{
				console.log('All Teacher permission are already present. No new insertions.');

			}
		}
	} catch (error) {
		console.error('Error seeding InstitutesPermission:', error);
	}
}


export  async function seedStudentPermission(data) {
	try {
        data = JSON.parse(data)

		const count = await InstitutePermissions.countDocuments();
		if (count === 0) {
			const insertedDocs =  await InstitutePermissions.insertMany(data);
			console.log(`Predefined Student permissions added: ${insertedDocs.length}`);
			await updateSequence("InstitutionPermissionIds",insertedDocs.length)

		} else { 
			const findvalues = await InstitutePermissions.find({}, { id: 1 })
			const extractedid = findvalues.map((value) => value.id)
			const missingfeature = data.filter(role => !extractedid.includes(Number(role.id)));
			if (missingfeature.length > 0) {
				const missedinsertedDocs = 	await InstitutePermissions.insertMany(missingfeature);
				console.log("Inserted missing admin Student features ")
				console.log(`Predefined student permissions added: ${missedinsertedDocs.length}`);
				await updateSequence("InstitutionPermissionIds",missedinsertedDocs.length)

			} 
			else{
				console.log('All Student permission are already present. No new insertions.');

			}
		}
	} catch (error) {
		console.error('Error seeding InstitutesPermission:', error);
	}
}



export async function seedPlatformRoles(data) {
	try {

		const count = await PlatformRoles.countDocuments();
        data = JSON.parse(data)

		if (count === 0) {
			const insertedDocs = 	await PlatformRoles.insertMany(data);
			console.log(`Predefined platform role  added: ${insertedDocs.length}`);
			await updateSequence("PlatformRoleId",insertedDocs.length)

		} else {

            const existingRecords = await PlatformRoles.find({}, { id: 1 });
			const existingIds = existingRecords.map(record => record.id);
            const missingRoles = data.filter(role => !existingIds.includes(Number(role.id)));
            if (missingRoles.length > 0) {
				const missedinsertedDocs = 	await PlatformRoles.insertMany(missingRoles);
				console.log('Inserted missing Platform roles.');
				console.log(`Predefined Platform roles added: ${missedinsertedDocs.length}`);
				await updateSequence("PlatformRoleId",missedinsertedDocs.length)
			} else {
				console.log('All platform roles are already present. No new insertions.');
			}
		}
	} catch (error) {
		console.error('Error seeding InstitutesRoles:', error);
	}
}


export async function seedPlatformfeatures(data) {
	try {

		const count = await PlatformFeatures.countDocuments();
        data = JSON.parse(data)
		
		if (count === 0) {
			const insertedDocs = await PlatformFeatures.insertMany(data);
			console.log(`Predefined platform feature  added: ${insertedDocs.length}`);
			await updateSequence("PlatformFeatureId",insertedDocs.length)

		} else {
            const existingRecords = await PlatformFeatures.find({}, { id: 1 });
			const existingIds = existingRecords.map(record => record.id);
            const missingRoles = data.filter(role => !existingIds.includes(Number(role.id)));
            if (missingRoles.length > 0) {
				const missedinsertedDocs = 		await PlatformFeatures.insertMany(missingRoles);
				console.log('Inserted missing platform features.');
				console.log(`Predefined Platform features added: ${missedinsertedDocs.length}`);
				await updateSequence("PlatformFeatureId",missedinsertedDocs.length)

			} else {
				console.log('All platform features are already present. No new insertions.');
			}
		}
	} catch (error) {
		console.error('Error seeding InstitutesRoles:', error);
	}
}

export async function seedPlatformPermission(data) {
	try {

		const count = await PlatformPermissions.countDocuments();
        data = JSON.parse(data)
		
		if (count === 0) {
			const insertedDocs = 	await PlatformPermissions.insertMany(data);
			console.log(`Predefined platform permission  added: ${insertedDocs.length}`);
			await updateSequence("PlatformPermissionIds",insertedDocs.length)

		} else {
            const existingRecords = await PlatformPermissions.find({}, { id: 1 });
			const existingIds = existingRecords.map(record => record.id);
            const missingRoles = data.filter(role => !existingIds.includes(Number(role.id)));
            if (missingRoles.length > 0) {
				const missedinsertedDocs = 	await PlatformPermissions.insertMany(missingRoles);
				console.log('Inserted missing platform permission.');
				console.log(`Predefined Platform permission added: ${missedinsertedDocs.length}`);
				await updateSequence("PlatformPermissionIds",missedinsertedDocs.length)

			} else {
				console.log('All platform permission are already present. No new insertions.');
			}
		}
	} catch (error) {
		console.error('Error seeding platformpermission:', error);
	}
}


export async function seedSubscriptionFeatures(data) {
	try {
        data = JSON.parse(data)
		
		const count = await SubscriptionFeatures.countDocuments();
		if (count === 0) {
			const insertedDocs = 	await SubscriptionFeatures.insertMany(data);
			console.log(`Predefined subscription feature    added: ${insertedDocs.length}`);
			await updateSequence("SubscriptionsFeatureId",insertedDocs.length)

		} else {
            const existingRecords = await PlatformPermissions.find({}, { id: 1 });
			const existingIds = existingRecords.map(record => record.id);
            const missingRoles = data.filter(role => !existingIds.includes(Number(role.id)));
            if (missingRoles.length > 0) {
				const missedinsertedDocs =await PlatformPermissions.insertMany(missingRoles);
				console.log('Inserted missing Subscription features.');
				console.log(`Predefined Subscription features added: ${missedinsertedDocs.length}`);
				await updateSequence("SubscriptionsFeatureId",missedinsertedDocs.length)
			} else {
				console.log('All Subscription features are already present. No new insertions.');
			}
		}
	} catch (error) {
		console.error('Error seeding InstitutesRoles:', error);
	}
}









