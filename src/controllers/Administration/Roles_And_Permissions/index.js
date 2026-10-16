import { generateUUID, getId } from '../../../utils/helpers.js';
import { PlatformFeatures, InstituteFeatures, PlatformRoles, InstitutesRoles, PlatformPermissions, InstitutePermissions } from '../../../models/Administration/Roles_And_Permissions/index.js';
import { Sequence } from '../../../models/common/common.js';
import { getInstituteDetailswithUUID } from '../../Institutes/common/index.js';
import institutePermissionCodes from '../../../data/permission_codes.js';
import Validations from '../../../validations/index.js';
import { InstituteUser } from '../../../models/Institutes/Administration/Authorization/index.js';
import { InstituteAdmin } from '../../../models/Administration/Authorization/index.js';
import { truevalue, falsevalue } from '../../../data/boolean_encrypt.js';

export const createPlatformFeature = async (req, res) => {
  const data = req.body;
  try {
    if (Array.isArray(data)) {

      const docsWithIdsAndUUIDs = await Promise.all(data.map(async doc => {
        if (!doc.id) {
          const uuid = await generateUUID();
          const sequence = await Sequence.findByIdAndUpdate(
            { _id: "PlatformFeatureId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
          );
          doc.id = sequence.seq;
          doc.uuid = uuid;
        }
        return doc;
      }));

      const platformFeatures = await PlatformFeatures.insertMany(docsWithIdsAndUUIDs);
      res.status(201).json({ status: "success", message: "features created successfully", data: platformFeatures });
    } else {

      const platformFeature = await PlatformFeatures.create(data);
      res.status(201).json({ status: "success", message: "feature created successfully", data: platformFeature });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", message: null, error: error.message });
  }
};


export const getAllPlatformFeatures = async (req, res) => {
  try {
    const platformFeatures = await PlatformFeatures.find();
    res.status(200).json({ status: "success", message: "features retrieved successfully", data: platformFeatures });
  } catch (error) {
    res.status(500).json({ status: "failed", message: null, error: error.message });
  }
};


export const updatePlatformFeatureById = async (req, res) => {
  try {
    const { featureId } = req.params;
    const updatedPlatformFeature = await PlatformFeatures.findOneAndUpdate({ uuid: featureId }, req.body, { new: true });
    res.status(200).json(updatedPlatformFeature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deletePlatformFeatureById = async (req, res) => {
  try {
    const { featureId } = req.params;
    await PlatformFeatures.findOneAndUpdate({ uuid: featureId }, { is_delete: true });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const createInstituteFeature = async (req, res) => {
  const data = req.body;
  try {
    if (Array.isArray(data)) {

      const docsWithIdsAndUUIDs = await Promise.all(data.map(async doc => {
        if (!doc.id) {
          const uuid = await generateUUID();
          const sequence = await Sequence.findByIdAndUpdate(
            { _id: "InstituteFeatureId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
          );
          doc.id = sequence.seq;
          doc.uuid = uuid;
        }
        return doc;
      }));

      const platformFeatures = await InstituteFeatures.insertMany(docsWithIdsAndUUIDs);
      res.status(201).json({ status: "success", message: "features created successfully", data: platformFeatures });
    } else {

      const platformFeature = await InstituteFeatures.create(data);
      res.status(201).json({ status: "success", message: "feature created successfully", data: platformFeature });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", message: null, error: error.message });
  }
};

export const getAllInstituteFeatures = async (req, res) => {
  try {
    const instituteFeatures = await InstituteFeatures.find();
    res.status(200).json({ status: "success", message: "features retrived successfully", data: instituteFeatures });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateInstituteFeatureById = async (req, res) => {
  try {
    const { featureId } = req.params;
    const updatedInstituteFeature = await InstituteFeatures.findOneAndUpdate({ uuid: featureId }, req.body, { new: true });
    res.status(200).json(updatedInstituteFeature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteInstituteFeatureById = async (req, res) => {
  try {
    const { featureId } = req.params;
    await InstituteFeatures.findOneAndUpdate({ uuid: featureId }, { is_delete: true })
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPlatformRole = async (req, res) => {
  try {
    const data = req.body
    if (Array.isArray(data)) {
      const docsWithIdsAndUUIDs = await Promise.all(data?.map(async doc => {
        if (!doc?.id) {
          const uuid = await generateUUID()
          const sequence = await Sequence.findOneAndUpdate({ _id: "PlatformRoleId" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
          doc.id = sequence.seq
          doc.uuid = uuid
        }
        return doc
      }))

      const platform_roles = await PlatformRoles.insertMany(docsWithIdsAndUUIDs)
      res.status(200).json({ status: "success", message: "roles created successfully", data: platform_roles })
    } else {
      const platformRole = await PlatformRoles.create(req.body)
      res.status(201).json({ status: "success", message: "role created sucessfully", data: platformRole })
    }
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const getAllPlatformRoles = async (req, res) => {
  try {
    const roles = await PlatformRoles.find()
    res.status(200).json({ status: "success", message: "Roles retrived successfully", data: roles })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const getPlatformRolesWithUUID = async (req, res) => {
  try {
    const { roleId } = req.params
    const role = await PlatformRoles.findOne({ uuid: roleId })
    res.status(200).json({ status: "success", message: "Role retrived successfully", data: role })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const updatePlatformRoleWithUUID = async (req, res) => {
  try {
    const { roleId } = req.params
    const { identity } = req.body
    const updatedRole = await PlatformRoles.findOneAndUpdate({ uuid: roleId }, { identity: identity })
    res.status(200).json({ status: "success", message: "role updated successfully", data: updatedRole })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const deletePlatformRoleWithUUID = async (req, res) => {
  try {
    const { roleId } = req.params
    const updatedRole = await PlatformRoles.findOneAndUpdate({ uuid: roleId }, { is_deleted: true })
    res.status(200).json({ status: "success", message: "role deleted successfully" })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

const mergePermissions = (permissions, permissionDefaults, userrole) => {
  console.log(permissions, userrole)
  return permissions.map(permission => {
    const defaultPerm = permissionDefaults.find(def => def.identity.toLowerCase() === permission.identity.toLowerCase());
    console.log(defaultPerm, "defautl", permission.identity, permission)
    if (!defaultPerm) {
      return null;
    }

    const createPerm = permission.permission.some(p => p.create);
    const readPerm = permission.permission.some(p => p.read);
    const updatePerm = permission.permission.some(p => p.update);
    const deletePerm = permission.permission.some(p => p.delete);

    const matchedUrls = defaultPerm.urls
      .filter(url => (url.name === 'create' && createPerm) ||
        (url.name === 'read' && readPerm) ||
        (url.name === 'update' && updatePerm) ||
        (url.name === 'delete' && deletePerm))
      .map(url => url.code);

    const values = [createPerm, readPerm, updatePerm, deletePerm]
    const encryptedValue = []

    for (let i = 0; i < values.length; i++) {
      console.log("came into for loop ")
      const value = values[i];

      if (value === true) {
        console.log("true has been converted for permisson new")
        const randomIndex = Math.floor(Math.random() * truevalue.length);
        const randomValue = truevalue[randomIndex];
        encryptedValue.push(randomValue);
      } else {
        console.log("false has been converted for permission new")
        const randomIndex = Math.floor(Math.random() * falsevalue.length);
        const randomValue = falsevalue[randomIndex];

        encryptedValue.push(randomValue);

      }
    }

    const newPermission = {
      identity: permission.identity.charAt(0).toUpperCase() + permission.identity.slice(1),
      create_permission: {
        permission: encryptedValue[0],
        code: defaultPerm.create
      },
      read_permission: {
        permission: encryptedValue[1],
        code: defaultPerm.read
      },
      update_permission: {
        permission: encryptedValue[2],
        code: defaultPerm.update
      },
      delete_permission: {
        permission: encryptedValue[2],
        code: defaultPerm.delete
      },
      urls: matchedUrls,
      role: userrole
    };

    return newPermission;
  }).filter(Boolean);
}


const AddPermissionToRole = (permission, role) => {
  try {
    const data = mergePermissions(permission, institutePermissionCodes, role)
    return data
  } catch (error) {
    throw error
  }
}

export const createInstituteRole = async (req, res) => {
  const count = await Sequence.findOne({ _id: "InstitutesRolesId" })
  try {
    const data = req.body
    console.log(data, "data")
    if (Array.isArray(data)) {
      const docsWithIdsAndUUIDs = await Promise.all(data?.map(async doc => {
        if (!doc?.id) {
          const uuid = await generateUUID()
          const sequence = await Sequence.findOneAndUpdate({ _id: "InstitutesRolesId" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
          doc.id = sequence.seq
          doc.uuid = uuid
        }
        return doc
      }))

      const platform_roles = await InstitutesRoles.insertMany(docsWithIdsAndUUIDs)

      res.status(200).json({ status: "success", message: "roles created successfully", data: platform_roles })
    } else {
      const value = Validations.createGroup(req.body)
      const { institute_id, identity, permissions } = value
      const institute = await getInstituteDetailswithUUID(institute_id)
      const platform_role = await InstitutesRoles.create({ Institute_id: institute?._id, identity: identity })
      const permissionsList = await AddPermissionToRole(data.permissions, platform_role.id)
      console.log(permissionsList, "permissionsList", value, "value")
      const addIdAndUUIDs = await Promise.all(permissionsList.map(async doc => {
        const Uuid = await generateUUID()
        const sequence = await Sequence.findOneAndUpdate({ _id: "InstitutionPermissionIds" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
        doc.id = sequence.seq
        doc.uuid = Uuid
        if (doc.identity) {
          try {
            const feature = InstituteFeatures.find({ identity: doc.identity })
            if (!feature) {
              res.status(404).json({ message: "This feature not avaliable" })
            }
          } catch (error) {
            throw new error
          }
        }
        return doc
      }))
      console.log(addIdAndUUIDs, "addIdAndUUIDs")
      const addPermission = await InstitutePermissions.insertMany(addIdAndUUIDs)

      res.status(201).json({ status: "success", message: "role created sucessfully", data: platform_role })
    }
  } catch (error) {
    if (Array.isArray(req.body)) {
      const update = await Sequence.findOneAndUpdate({ _id: "InstitutesRolesId" }, { seq: count.seq + Number(error.result.insertedCount) })
    }
    console.log(error)
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const getInstituteGroupsWithInstituteId = async (req, res) => {
  try {
    const { instituteId } = req.params
    const institute = await getInstituteDetailswithUUID(instituteId)

    let { page = 1, perPage = 10 } = req.query
    parseInt(page)
    parseInt(perPage)
    const count = await InstitutesRoles.countDocuments({ Institute_id: institute._id, is_delete: false })
    const groups = await InstitutesRoles.find({ Institute_id: institute._id, is_delete: false })
      .skip((page - 1) * perPage)
      .limit(perPage)

    const users = await Promise.all(groups?.map(async (i) => {
      const user = await InstituteAdmin.find({ role: i._id })
      return {
        ...i.toObject(),
        users: user
      }
    }))

    const totalPages = Math.ceil(count / perPage)
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      status: "success", message: "Groups Retrived successfully",
      data: users,
      count: count,
      currentPage: page,
      last_page: totalPages,
      hasNextPage,
      hasPreviousPage,
    })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message })
  }
}

export const getInstituteRoles = async (req, res) => {
  try {
    const roles = await InstitutesRoles.find()
    res.status(200).json({ status: "success", message: "roles retrieved successfully", data: roles })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const getInstituteRoleWithUUID = async (req, res) => {
  try {
    const { roleId } = req.params
    const role = await InstitutesRoles.findOne({ uuid: roleId })
    res.status(200).json({ status: "success", message: "role retrieved successfully", data: role })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const updateInstituteRolesWithUUID = async (req, res) => {
  try {
    const { roleId } = req.params
    const { identity } = req.body
    const role = await InstitutesRoles.findOneAndUpdate({ uuid: roleId }, { identity: identity })
    res.status(200).json({ status: "success", message: "role updated successfully", data: role })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const deleteInstituteRolesWithUUID = async (req, res) => {
  try {
    const { roleId } = req.params
    const role = await InstitutesRoles.findOneAndUpdate({ uuid: roleId }, { is_delete: true })
    res.status(200).json({ status: "success", message: "role deleted successfully" })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const createPlatformPermissions = async (req, res) => {
  const data = req.body

  const count = await Sequence.findOne({ _id: "PlatformPermissionIds" })
  try {
    if (Array.isArray(data)) {
      const addIdAndUUIDs = await Promise.all(data.map(async doc => {
        const Uuid = await generateUUID()
        const sequence = await Sequence.findOneAndUpdate({ _id: "PlatformPermissionIds" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
        doc.id = sequence.seq
        doc.uuid = Uuid
        if (doc.identity) {
          try {
            const feature = PlatformFeatures.find({ identity: doc.identity })

            if (!feature) {
              res.status(404).json({ message: "This feature not avaliable" })
            }
          } catch (error) {
            throw new error
          }
        }
        return doc
      }))

      const permissions = await PlatformPermissions.insertMany(addIdAndUUIDs)
      res.status(200).json({ status: "sucess", message: "Permissions created successfully", data: permissions })
    } else {
      const permission = await PlatformPermissions.create(data)
      res.status(200).json({ status: "success", message: "Permission created successfully", data: permission })

    }
  } catch (error) {
    if (Array.isArray(data)) {
      const updateCount = await Sequence.findOneAndUpdate({ _id: "PlatformPermissionIds" }, { seq: count.seq })
    }
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const getPlatformRolePermissionWithUUID = async (req, res) => {
  const { roleId } = req.params
  try {
    const role = await PlatformRoles.findOne({ uuid: roleId })
    const permission = await PlatformPermissions.find({ platform_role: role.id })
    res.status(200).json({ status: "success", message: "permission retrived successfully", data: permission })
  } catch (error) {
    res.status(500).json({ status: "success", message: error.message })
  }
}

export const updatePlatformPermissionsWithId = async (req, res) => {
  try {
    const { roleId } = req.params
    const { permissions } = req.body
    const role = await PlatformRoles.findOne({ uuid: roleId })
    const permission = await PlatformPermissions.findOneAndUpdate({ platform_role: role.id }, permissions)
    res.status(200).json({ status: "success", message: "permission updated successfully", data: permission })
  } catch (error) {
    res.status(500).json({ status: 'failed', message: error.message })
  }
}

export const deletePermissionWithRoleId = async (req, res) => {
  try {
    const { roleId } = req.params
    const role = await PlatformRoles.findOne({ uuid: roleId })
    const permission = await PlatformPermissions.findOneAndUpdate({ platform_role: role.id }, { is_delete: true })
    res.status(200).json({ status: 'success', message: "permission removed successfully", data: null })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message })
  }
}

export const createInstitutePermissions = async (req, res) => {
  const data = req.body.data ? req.body.data : req.body
  console.log("the institute permission has been created and triggered now so we can")
  const count = await Sequence.findOne({ _id: "InstitutionPermissionIds" })
  try {
    if (Array.isArray(data)) {
      const addIdAndUUIDs = await Promise.all(data.map(async doc => {
        const Uuid = await generateUUID()
        const sequence = await Sequence.findOneAndUpdate({ _id: "InstitutionPermissionIds" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
        doc.id = sequence.seq
        doc.uuid = Uuid
        if (doc.identity) {
          try {
            const feature = InstituteFeatures.find({ identity: doc.identity })
            if (!feature) {
              res.status(404).json({ message: "This feature not avaliable" })
            }
          } catch (error) {
            throw new error
          }
        }
        return doc
      }))

      const permissions = await InstitutePermissions.insertMany(addIdAndUUIDs)
      console.log("The UUIDS are " + addIdAndUUIDs)
      res.status(200).json({ status: "sucess", message: "Permissions created successfully", data: permissions })
    } else {
      const permission = await InstitutePermissions.create(data)
      res.status(200).json({ status: "success", message: "Permission created successfully", data: permission })

    }
  } catch (error) {
    if (Array.isArray(data)) {
      const updateCount = await Sequence.findOneAndUpdate({ _id: "InstitutionPermissionIds" }, { seq: count !== null ? count?.seq : 1 })
    }
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const getInstitutePermissionWithId = async (req, res) => {
  try {
    const { roleId } = req.params
    const role = await InstitutesRoles.findOne({ uuid: roleId })
    const permissions = await InstitutePermissions.find({ role: role.id })
    res.status(200).json({ status: "success", message: "permission retrived successfully", data: permissions })
  } catch (error) {
    res.status(500).json({ status: 'failed', message: error.message })
  }
}

export const updateInstitutePermissionWithId = async (req, res) => {
  try {
    const { roleId } = req.params
    const data = req.body
    const role = await InstitutesRoles.findOne({ uuid: roleId })
    const permissions = await InstitutePermissions.findOneAndUpdate({ role: role.id }, data)
    res.status(200).json({ status: 'success', message: "permission retrieved successfully", data: permissions })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const deleteInstitutePermissionWithId = async (req, res) => {
  try {
    const { roleId } = req.params
    const role = await InstitutesRoles.findOne({ uuid: roleId })
    const permissions = await InstitutePermissions.findOneAndUpdate({ role: role.id }, { is_delete: true })
    res.status(200).json({ status: "success", message: "permission deleted successfully", data: null })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const getPlatformPermissions = async (req, res) => {
  try {
    const permissions = await PlatformPermissions.find();
    res.status(200).json({ status: "success", message: "Permissions retrieved successfully", data: permissions });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const getInstituePermissions = async (req, res) => {
  try {
    const permissions = await InstitutePermissions.find({is_delete: "false"});
    res.status(200).json({ status: "success", message: "Permissions retrieved successfully", data: permissions });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}

export const updateInstituePermissions = async (req, res) => {
  try {
    const { permissionId } = req.params;
    const { permissions } = req.body;
    const permission = await InstitutePermissions.findOneAndUpdate({ uuid: permissionId }, permissions)
    res.status(200).json({ status: "success", message: "permission updated successfully", data: permission })
  } catch (error) {
    res.status(500).json({ status: 'failed', message: error.message })
  }
}

export const updatePlatformPermissions = async (req, res) => {
  try {
    const { permissionId } = req.params;
    const { permissions } = req.body;
    const permission = await PlatformPermissions.findOneAndUpdate({ uuid: permissionId }, permissions)
    res.status(200).json({ status: "success", message: "permission updated successfully", data: permission })
  } catch (error) {
    res.status(500).json({ status: 'failed', message: error.message })
  }
}

// Get Users Excluding staffs and students

export const getCoordinators = async (req, res) => {
  try {
    const {instituteId} = req.params;
    const excludedRoles = await InstitutesRoles.find({identity: {$in : ["Teaching Staff","Non Teaching Staff","Student"]}}).select("_id");
    console.log(excludedRoles)
    const excludedRolesIds = excludedRoles.map(role => role._id.toString());
    console.log(excludedRolesIds)
    const users = await InstituteUser.find({institute_id: instituteId, role: {$nin: excludedRolesIds}, is_delete: false})
    console.log(users)
    return res.status(200).json({status: "success", message: "Users retrieved successfully", data: users});
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
};
