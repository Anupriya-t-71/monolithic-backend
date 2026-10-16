import { Router } from "express";
import * as FeatureRolesAndPermissions from "../../../controllers/Administration/Roles_And_Permissions/index.js"
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";
import { deleteGroups, getInstitutePermissionsList ,getPermissionByRole,updateGroupStatus,updateRolesPermissions} from "../../../controllers/Administration/Roles_And_Permissions/instituteRoles&Permissions.js";

const adminRouter = Router()

adminRouter.post("/platform/features",checkTokenAndPermission("feature","create_permission"),FeatureRolesAndPermissions.createPlatformFeature)
adminRouter.get("/platform/features",checkTokenAndPermission("feature","read_permission"),FeatureRolesAndPermissions.getAllPlatformFeatures)
adminRouter.put("/platform/features/:featureId",checkTokenAndPermission("feature","update_permission"),FeatureRolesAndPermissions.updatePlatformFeatureById)
adminRouter.delete("/platform/features/:featureId",checkTokenAndPermission("feature","delete_permission"),FeatureRolesAndPermissions.deletePlatformFeatureById)

adminRouter.post("/platform/roles",checkTokenAndPermission("roles","create_permission"),FeatureRolesAndPermissions.createPlatformRole)
adminRouter.get("/platform/roles",checkTokenAndPermission("roles","read_permission"),FeatureRolesAndPermissions.getAllPlatformRoles)
adminRouter.get("/platform/roles/:roleId",checkTokenAndPermission("roles","read_permission"),FeatureRolesAndPermissions.getPlatformRolesWithUUID)
adminRouter.put("/platform/roles/:roleId",checkTokenAndPermission("roles","update_permission"),FeatureRolesAndPermissions.updatePlatformRoleWithUUID)
adminRouter.delete("/platform/roles/:roleId",checkTokenAndPermission("roles","delete_permission"),FeatureRolesAndPermissions.deletePlatformRoleWithUUID)

adminRouter.post("/platform/permissions",checkTokenAndPermission("permissions","create_permission"),FeatureRolesAndPermissions.createPlatformPermissions)
adminRouter.get("/platform/roles/:roleId/permissions",checkTokenAndPermission("permissions","read_permission"),FeatureRolesAndPermissions.getPlatformRolePermissionWithUUID)
adminRouter.put("/platform/roles/:roleId/permissions",checkTokenAndPermission("permissions","update_permission"),FeatureRolesAndPermissions.updatePlatformPermissionsWithId)
adminRouter.delete("/platform/roles/:roleId/permissions",checkTokenAndPermission("permissions","delete_permission"),FeatureRolesAndPermissions.deletePermissionWithRoleId)
adminRouter.get("/platform/permissions", checkTokenAndPermission("permissions","read_permission"), FeatureRolesAndPermissions.getPlatformPermissions)
adminRouter.put("/platform/permissions/:permissionId",checkTokenAndPermission("permissions","update_permission"),FeatureRolesAndPermissions. updatePlatformPermissions)

adminRouter.post("/institutes/feature",checkTokenAndPermission("feature","create_permission"),FeatureRolesAndPermissions.createInstituteFeature)
adminRouter.get("/institutes/features",checkTokenAndPermission("feature","read_permission"),FeatureRolesAndPermissions.getAllInstituteFeatures)
adminRouter.put("/institutes/features/:featureId",checkTokenAndPermission("feature","update_permission"),FeatureRolesAndPermissions.updateInstituteFeatureById)
adminRouter.delete("/institutes/features/:featureId",checkTokenAndPermission("feature","delete_permission"),FeatureRolesAndPermissions.deleteInstituteFeatureById)


adminRouter.post("/institutes/role",checkTokenAndPermission("Groups","create_permission"),FeatureRolesAndPermissions.createInstituteRole)
adminRouter.get("/institutes/groups/all/:instituteId",checkTokenAndPermission("Groups","read_permission"),FeatureRolesAndPermissions.getInstituteGroupsWithInstituteId)
adminRouter.get("/institutes/groups/permissions/",checkTokenAndPermission("Groups","read_permission"),getPermissionByRole)
adminRouter.put("/institutes/groups/permissions/",checkTokenAndPermission("Groups","read_permission"),updateRolesPermissions)
adminRouter.put("/institutes/groups/update-status/",checkTokenAndPermission("Groups","update_permission"),updateGroupStatus)
adminRouter.delete("/institutes/group/delete/:groupId",checkTokenAndPermission("Groups","delete_permission"),deleteGroups)

adminRouter.get("/institutes/roles",checkTokenAndPermission("feature","read_permission"),FeatureRolesAndPermissions.getInstituteRoles)
adminRouter.get("/institutes/roles/:roleId/",checkTokenAndPermission("roles","read_permission"),FeatureRolesAndPermissions.getInstituteRoleWithUUID)
adminRouter.put("/institutes/roles/:roleId/",checkTokenAndPermission("roles","update_permission"),FeatureRolesAndPermissions.updateInstituteRolesWithUUID)
adminRouter.delete("/institutes/roles/:roleId/",checkTokenAndPermission("roles","delete_permission"),FeatureRolesAndPermissions.deleteInstituteRolesWithUUID)

adminRouter.post("/institutes/permissions",checkTokenAndPermission("Group","read_permission"),FeatureRolesAndPermissions.createInstitutePermissions)
adminRouter.get("/institutes/permissions/all",checkTokenAndPermission("Group Details","read_permission"),getInstitutePermissionsList)
adminRouter.get("/institutes/roles/:roleId/permissions",checkTokenAndPermission("permissions","read_permission"),FeatureRolesAndPermissions.getInstitutePermissionWithId)
adminRouter.put("/institutes/roles/:roleId/permissions",checkTokenAndPermission("permissions","update_permission"),FeatureRolesAndPermissions.updateInstitutePermissionWithId)
adminRouter.delete("/institutes/roles/:roleId/permissions",checkTokenAndPermission("permissions","delete_permission"),FeatureRolesAndPermissions.deleteInstitutePermissionWithId)
adminRouter.get("/institutes/permissions", checkTokenAndPermission("permissions","read_permission"), FeatureRolesAndPermissions.getInstituePermissions)
adminRouter.put("/institutes/permissions/:permissionId", checkTokenAndPermission("permissions","update_permission"), FeatureRolesAndPermissions.updateInstituePermissions)

adminRouter.get('/:instituteId/users', FeatureRolesAndPermissions.getCoordinators)

export default adminRouter