import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";
import roles_seeding from "../../../data/roles_seeding.js"
import features_seeding from "../../../data/features_seeding.js";
import student_permission from "../../../data/student_permission.js";
import teacher_permission from "../../../data/teacher_permission.js";
import admin_permission from "../../../data/admin_permission.js";



const Schema = mongoose.Schema;


const PlatformFeature = new Schema({
	id: { type: Number, unique: true },
	uuid: { type: String, unique: true },
	identity: { type: String, require: true, unique: true },
	description: { type: String, default: null },
	is_active: { type: Boolean, default: true },
	is_delete: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

PlatformFeature.pre("save", async function (next) {
	if (!this.id) {
		try {
			const uuid = await generateUUID()
			const sequence = await Sequence.findByIdAndUpdate(
				{ _id: "PlatformFeatureId" }, { $inc: { seq: 1 } }, { new: true, upsert: true }
			)
			this.id = sequence.seq
			this.uuid = uuid
			next()
		} catch (error) {
			next(error)
		}
	} else {
		next()
	}
})

const PlatformFeatures = mongoose.model("PlatformFeatures", PlatformFeature);

export { PlatformFeatures }

const permissionSchema = new Schema({
	name: { type: String, enum: ["create", "update", "read", "delete"], required: true },
	is_active: { type: Boolean, default: true }
});

const InstituteFeature = new Schema({
	id: { type: Number, unique: true },
	uuid: { type: String, unique: true },
	identity: { type: String, require: true, unique: true },
	description: { type: String, default: null },
	is_active: { type: Boolean, default: true },
	is_delete: { type: Boolean, default: false },
	permission: [permissionSchema]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

InstituteFeature.pre("save", async function (next) {
	if (!this.id) {
		try {
			const uuid = await generateUUID()
			const sequence = await Sequence.findByIdAndUpdate(
				{ _id: "InstituteFeatureId" }, { $inc: { seq: 1 } }, { new: true, upsert: true }
			)
			this.id = sequence.seq
			this.uuid = uuid
			next()
		} catch (error) {
			next(error)
		}
	} else {
		next()
	}
})

const InstituteFeatures = mongoose.model("InstituteFeatures", InstituteFeature);


// async function seedInstitutesfeatures() {
// 	try {

// 		const count = await InstituteFeatures.countDocuments();
// 		if (count === 0) {

// 			await InstituteFeatures.insertMany(features_seeding);
// 			console.log('Predefined features seeded successfully.');
// 		} else {
// 			const findvalues = await InstituteFeatures.find({}, { id: 1 })
// 			const extractedid = findvalues.map((value) => value.id)
// 			const missingfeature = features_seeding.filter(role => !extractedid.includes(Number(role.id)));
// 			if (missingfeature.length > 0) {
// 				await InstituteFeatures.insertMany(missingfeature);
// 				console.log("someone deleted default features")
// 			}
// 			console.log('Predefined features already exist. Skipping seeding.');
// 		}
// 	} catch (error) {
// 		console.error('Error seeding InstitutesRoles:', error);
// 	}
// }
// seedInstitutesfeatures()
export { InstituteFeatures }

const PlatformRole = new Schema({
	id: { type: Number, unique: true },
	uuid: { type: String, unique: true },
	identity: { type: String, require: true, unique: true },
	description: { type: String },
	is_active: { type: Boolean, default: true },
	is_delete: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

PlatformRole.pre("save", async function (next) {
	if (!this?.id) {
		try {
			const uuid = await generateUUID()
			const sequence = await Sequence.findByIdAndUpdate({ _id: "PlatformRoleId" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
			this.uuid = uuid
			this.id = sequence.seq
			next()
		} catch (error) {
			next(error)
		}
	} else {
		next()
	}
})

const PlatformRoles = mongoose.model("PlatformRoles", PlatformRole);

export { PlatformRoles }

const InstitutesRole = new Schema({
	id: { type: Number, unique: true },
	uuid: { type: String, unique: true },
	Institute_id: { type: String },
	identity: { type: String, require: true },
	description: { type: String },
	is_active: { type: Boolean, default: true },
	is_delete: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

InstitutesRole.pre("save", async function (next) {
	if (!this?.id) {
		try {
			const uuid = await generateUUID()
			const sequence = await Sequence.findByIdAndUpdate({ _id: "InstitutesRolesId" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
			this.uuid = uuid


			this.id = sequence.seq
			next()
		} catch (error) {
			next(error)
		}
	} else {
		next()
	}
})

const InstitutesRoles = mongoose.model("InstitutesRoles", InstitutesRole);


console.log("the tablkes has been created")
// async function seedInstitutesRoles() {
// 	try {

// 		const count = await InstitutesRoles.countDocuments();
// 		if (count === 0) {

// 			await InstitutesRoles.insertMany(roles_seeding);
// 			console.log('Predefined roles seeded successfully.');
// 		} else {

// 			const findvalues = await InstitutesRoles.find({}, { id: 1 })
// 			const extractedid = findvalues.map((value) => value.id)

// 			const missingRoles = roles_seeding.filter(role => !extractedid.includes(Number(role.id)));
// 			if (missingRoles.length > 0) {
// 				await InstitutesRoles.insertMany(missingRoles);
// 				console.log("someone deleted default roles")
// 			}


// 			console.log('Predefined roles already exist. Skipping seeding.');
// 		}
// 	} catch (error) {
// 		console.error('Error seeding InstitutesRoles:', error);
// 	}
// }
// seedInstitutesRoles()
export { InstitutesRoles }



const PlatformPermissionSchema = new Schema({
	id: { type: Number, unique: true },
	uuid: { type: String, unique: true },
	identity: { type: String,  require: true },
	create_permission: { permission: { type: Boolean, default: false }, code: { type: String } },
	read_permission: { permission: { type: Boolean, default: false }, code: { type: String } },
	update_permission: { permission: { type: Boolean, default: false }, code: { type: String } },
	delete_permission: { permission: { type: Boolean, default: false }, code: { type: String } },
	urls: { type: Array },
	platform_role: { type: Number, ref: "PlatformRoles", require: true },
	is_active: { type: Boolean, default: true },
	is_delete: { type: Boolean, default: true }
})

PlatformPermissionSchema.virtual('Role', {
	ref: 'PlatformRoles',
	localField: 'platform_role',
	foreignField: 'id'
});

PlatformPermissionSchema.pre("save", async function (next) {
	try {
		if (!this.id) {
			try {
				const uuid = await generateUUID()
				const sequence = await Sequence.findOneAndUpdate({ _id: "PlatformPermissionIds" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
				this.id = sequence.seq
				this.uuid = uuid
			} catch (error) {
				next(error)
			}
		}
		if (!this.isModified('identity')) {
			const feature = await mongoose.model('PlatformFeatures').findById(this.feature);
			if (!feature) {
				throw new Error('Associated feature not found');
			}
			this.identity = feature.identity;
		}
		next();
	} catch (error) {
		next(error);
	}
});

export const PlatformPermissions = mongoose.model("PlatformPermissionTables", PlatformPermissionSchema)

const InstitutePermissionSchema = new Schema({
	id: { type: Number, unique: true },
	uuid: { type: String, unique: true },
	institute_id: { type: String },
	identity: { type: String, require: true },
	create_permission: { permission: { type: String, }, code: { type: String } },
	read_permission: { permission: { type: String, }, code: { type: String } },
	update_permission: { permission: { type: String, }, code: { type: String } },
	delete_permission: { permission: { type: String, }, code: { type: String } },
	urls: { type: Array },
	// role: { type: mongoose.Types.ObjectId, ref: "InstitutesRoles", require: true },
	role: { type: Number, ref: "InstitutesRoles", require: true },

	is_active: { type: Boolean, default: true },
	is_delete: { type: Boolean, default: false }
})

InstitutePermissionSchema.virtual('Role', {
	ref: 'InstitutesRoles',
	localField: 'role',
	foreignField: 'id'
});

InstitutePermissionSchema.pre("save", async function (next) {
	try {
		if (!this.id) {
			try {
				const uuid = await generateUUID()
				const sequence = await Sequence.findOneAndUpdate({ _id: "InstitutionPermissionIds" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
				this.id = sequence.seq
				this.uuid = uuid
			} catch (error) {
				next(error)
			}
		}
		// if (!this.isModified('identity')) {
		//     const feature = await mongoose.model('InstituteFeatures').findById(this.feature);
		//     if (!feature) {
		//         throw new Error('Associated feature not found');
		//     }
		//     this.identity = feature.identity;
		// }
		next();
	} catch (error) {
		next(error);
	}
});




//need to  insert predefined permission



export const InstitutePermissions = mongoose.model("InstitutePermissionTable", InstitutePermissionSchema)


// async function seedPermission() {
// 	try {
// 		const count = await InstitutePermissions.countDocuments();
// 		if (count === 0) {
// 			await InstitutePermissions.insertMany(admin_permission);
// 			await InstitutePermissions.insertMany(teacher_permission);
// 			await InstitutePermissions.insertMany(student_permission);
// 			console.log('Predefined features counted successfully.' + count);
// 		} else {
// 			console.log("someone features default roles" + count)
// 		}
// 	} catch (error) {
// 		console.error('Error seeding InstitutesPermission:', error);
// 	}
// }
// seedPermission()







// async function runSeeding() {
//     try {
        // await seedingFunctions.seedInstitutesRoles();
        // await seedingFunctions.seedPlatformRoles();
        // await seedingFunctions.seedPlatformfeatures();
        //  await seedingFunctions.seedPlatformPermission();
        // await seedingFunctions.seedPermission();
        // await seedingFunctions.seedInstitutesfeatures();
        // await seedingFunctions.seedSubscriptionFeatures();
        //  await seedingFunctions.savePermissionsToFile();

//     } catch (error) {
//         console.error("Error in seeding functions:", error);
//     }
// }

// // Call the function inside an async context
// runSeeding();