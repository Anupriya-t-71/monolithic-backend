import institutePermissionCodes from "../../../data/permission_codes.js"
import { InstituteFeatures, InstitutePermissions, InstitutesRoles } from "../../../models/Administration/Roles_And_Permissions/index.js"
import { Sequence } from "../../../models/common/common.js"
import { generateUUID } from "../../../utils/helpers.js"
import { getInstituteDetailswithUUID } from "../../Institutes/common/index.js"
import { truevalue, falsevalue } from "../../../data/boolean_encrypt.js"

export const getInstitutePermissionsList = async (req, res) => {
  try {
    const features = await InstituteFeatures.find().then((data) => data.sort((a, b) => a - b))
    const data = features?.sort((a, b) => a.id - b.id)
    res.status(200).json({ status: "success", message: "permissions retrived succesfully", data: data })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message })
  }
}

export const getPermissionByRole = async (req, res) => {
  try {
    const { role } = req.query
    console.log("came into permission role")
    const permissions = await InstitutePermissions.find({ role: role })
    console.log(permissions)
    res.status(200).json({ status: "sucess", message: "Permission retrived successfully", data: permissions })
  } catch (error) {
    res.status(200).json({ status: 'failed', message: error?.message })
  }
}

const transformPermissions = (userPermissions, defaultPermissionCodes) => {
  const userPermissionsMap = userPermissions.reduce((map, perm) => {
    map[perm.identity] = perm;
    return map;
  }, {});

  return defaultPermissionCodes.map((defaultPerm) => {
    const userPerm = userPermissionsMap[defaultPerm.identity];

    if (!userPerm) {
      return null;
    }

    const getCodeOrNull = (action) => userPerm[action] ? defaultPerm[action] : null;

    const getUrls = (permission, action) => {
      if (userPerm[action]) {
        return defaultPerm?.urls?.filter(url => url.name === permission).map(url => url.code);
      }
      return [];
    };

    const createUrls = getUrls('create', 'create') || [];
    const readUrls = getUrls('read', 'read') || [];
    const updateUrls = getUrls('update', 'update') || [];
    const deleteUrls = getUrls('delete', 'delete') || [];

    const allUrls = [...createUrls, ...readUrls, ...updateUrls, ...deleteUrls];
    const values = [userPerm.create, userPerm.read, userPerm.update, userPerm.delete]
    const encryptedValue = []

    for (let i = 0; i < values.length; i++) {
      const value = values[i];

      if (value === true) {
        const randomIndex = Math.floor(Math.random() * truevalue.length);
        const randomValue = truevalue[randomIndex];
        encryptedValue.push(randomValue);

      } else {
        const randomIndex = Math.floor(Math.random() * falsevalue.length);
        const randomValue = falsevalue[randomIndex];
        encryptedValue.push(randomValue);
      }
    }

    return {
      identity: defaultPerm.identity,
      create_permission: {
        permission: encryptedValue[0],
        code: getCodeOrNull('create')
      },
      read_permission: {
        permission: encryptedValue[1],
        code: getCodeOrNull('read')
      },
      update_permission: {
        permission: encryptedValue[2],
        code: getCodeOrNull('update')
      },
      delete_permission: {
        permission: encryptedValue[3],
        code: getCodeOrNull('delete')
      },
      urls: allUrls
    };
  }).filter(permission => permission !== null);
};




export const updateRolesPermissions = async (req, res) => {
  try {
    const { id, permissions, identity, institute_id } = req.body

    const institute = await getInstituteDetailswithUUID(institute_id)
    const FilterPermissions = transformPermissions(permissions, institutePermissionCodes)
    const group = await InstitutesRoles.updateOne({ Institute_id: institute?._id, id: id }, { identity: identity })

    const data = transformPermissions(permissions, institutePermissionCodes)

    const updatePromises = data.map(async (i) => {
      const existingPermission = await InstitutePermissions.findOne({ identity: i.identity, role: id });

      if (existingPermission) {
        return await InstitutePermissions.findByIdAndUpdate(existingPermission._id, {
          create_permission: i.create_permission,
          update_permission: i.update_permission,
          read_permission: i.read_permission,
          delete_permission: i.delete_permission,
          urls: i.urls
        }, { new: true });
      } else {
        return await InstitutePermissions.create({
          create_permission: i.create_permission,
          update_permission: i.update_permission,
          read_permission: i.read_permission,
          delete_permission: i.delete_permission,
          urls: i.urls,
          role: id,
          identity: i.identity
        })
      }
    });


    const updatedPermissions = await Promise.all(updatePromises);

    res.status(200).json({ status: "sucess", message: "permission updated successfully", data: updatedPermissions })
  } catch (error) {
    res.status(500).json({ status: "false", message: error?.message })
  }
}


export const updateGroupStatus = async (req, res) => {
  try {
    const { id, is_active } = req.body
    const data = await InstitutesRoles.findOneAndUpdate({ id: id }, { is_active: is_active }, { new: true })
    res.status(200).json({ status: "success", message: "group status updated successfully", data: data })
  } catch (error) {
    res.status(500).json({ status: "success", message: error?.message })
  }
}

export const deleteGroups = async (req, res) => {
  try {
    const { groupId } = req.params
    const deletedGroup = await InstitutesRoles.findOneAndUpdate({ uuid: groupId }, { is_delete: true })
    res.status(200).json({ status: "success", message: "group deleted successfully", data: deletedGroup })
  } catch (error) {
    res.status(500).json({ status: "false", message: error?.message })
  }
}
