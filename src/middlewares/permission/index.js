import * as AuthModel from "../../models/Administration/Authorization/index.js";
import * as PermissionModel from "../../models/Administration/Roles_And_Permissions/index.js";
import { InstituteUser } from "../../models/Institutes/Administration/Authorization/index.js";
import { decodeToken } from "../../utils/helpers.js";

export const VerifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        
    

        if (!token) {
            return res.status(500).json({ status: "failed", message: "Authentication credentials not provided" });
        }
        
        if (!(token.split(" ").includes("Token"))) {
            return res.status(500).json({ status: "failed", message: "token not validated format" });
        }
        
        if (!token) {
            return res.status(401).json({ status: "failed", message: "no authentication token provided", data: null });
        }

        const decoded = decodeToken(String(token?.split(" ").slice(-1)));

        if (decoded.status === "failed" && decoded.message === "jwt expired") {
            return res.status(401).json({ status: "failed", message: "Your session has expired. Please log in again", status: "session_expired" });
        }else if(decoded.status === "failed" ){
            res.status(401).json({ status: "failed", message: decoded.message})
        }
        if (decoded.user_type === "platform") {
            const user = await AuthModel.UserModel.findOne({ uuid: decoded.uuid });
            
            if (!user) {
                return res.status(404).json({
                    status: "failed",
                    message: "User not found.",
                    details: "The requested user does not exist in the system."
                });
            }
            req.user = user;
            req.user.user_type = decoded.user_type
            req.user.uuid = decoded.uuid; 

            next();
        } else if (decoded.user_type === "institute") {
            const user = await InstituteUser.findOne({ uuid: decoded.uuid })
            .populate({
              path: "userDetail",
              strictPopulate: false,
            });
          
          const admin = await AuthModel.InstituteAdmin.findOne({ uuid: decoded.uuid })
            .populate({
              path: "userDetail",
              strictPopulate: false,
            });
          
            if (!user && !admin) {
                return res.status(404).json({ status: "failed", message: "user not found", data: null });
            }
            req.user = user ? user : admin;
            req.user.user_type = decoded.user_type;
            req.user.uuid = decoded.uuid; 

            next();
        }
       

    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message, data: null });
    }
};

export const ExtractTokenID = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(500).json({ status: "failed", message: "Authentication credentials not provided" });
        }
        
        if (!(token.split(" ").includes("Token"))) {
            return res.status(500).json({ status: "failed", message: "token not validated format" });
        }
        
        if (!token) {
            return res.status(401).json({ status: "failed", message: "no authentication token provided", data: null });
        }

        const decoded = decodeToken(String(token?.split(" ").slice(-1)));
        
        if (decoded.status === "failed" && decoded.message === "jwt expired") {
            return res.status(401).json({ status: "failed", message: "Your session has expired. Please log in again", status: "session_expired" });
        }else if(decoded.status === "failed" ){
            res.status(401).json({ status: "failed", message: decoded.message})
        } 
        req.data = decoded;
        console.log("Decoded", decoded)
        next();
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message, data: null });
    }
};

export const PermissionChecker = (requirePermission) => {
    return (async(req, res, next) => {
        if (req.user) {
            const user = req.user;
            const user_id=req.user;
            if (user.user_type === "platform") {
                const isAllowed = await PermissionModel.PlatformPermissions.findOne({ identity: requirePermission.feature, platform_role: user.role });
                 if (!isAllowed) {
                    return res.status(403).json({ status: "success", message: "Access to the requested resource is forbidden.", "details": "The requested user does not exist in the system." });
                } else if (!isAllowed[requirePermission.action].permission && isAllowed[requirePermission.action].code) {
                    return res.status(403).json({ status: "success", message: "Access to the requested resource is forbidden.", details: "The requested user does not exist in the system." });
                }
            } else if (user.user_type === "institute") {
                const role = await PermissionModel.InstitutesRoles.findOne({ _id: user.role });

                const checkPermission = await PermissionModel.InstitutePermissions.findOne({ identity: requirePermission.feature, role: role.id });
                
                if (!checkPermission) {
                    return res.status(403).json({ status: "success", message: "Access to the requested resource is forbidden.", details: "The requested user does not exist in the system." });
                } else if (!checkPermission[requirePermission.action].permission) {
                    return res.status(403).json({ status: "success", message: "You do not have permission to perform this action.", details: "The requested user does not exist in the system." });
                }
            }else if(!user.user_type){
                return res.status(500).json({status:"failed",message:"token not validated"})
            }
        }
        next();
    });
};


export const checkTokenAndPermission = (feature, action) => async (req, res, next) => {
    try {
        await VerifyToken(req, res, async () => {
            await PermissionChecker({ feature, action })(req, res, next);
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: "failed", message: "Internal server error" });
    }
};