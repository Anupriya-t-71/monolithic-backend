import express from "express";
import { forgotPassword, getAllUsers, getProfile, loginUser, logoutUser, registerUser, resendOtp, resetPassword, updateProfile, verifyUser } from "../../controllers/Developer/index.js";
import { createLogger, getDeveloperActivityLogs } from "../../controllers/ActivityLogs/index.js";
import authenticateUser from "../../middlewares/Developer/index.js";
import { checkTokenAndPermission, VerifyToken } from "../../middlewares/permission/index.js";
import { getMasterNotification, MasterNotificationCreate } from "../../controllers/Developer/MANotifications/index.js";


const developerRouter = express.Router();

// developer.get("/register", (req, res) => {
//   res.render("developer/register");
// });

// developer.post("/register", registerUser);

developerRouter.get("/verify", (req, res) => {

  res.render("developer/verify");
});


developerRouter.post("/verify", verifyUser);

developerRouter.post("/resend-otp", resendOtp)

developerRouter.get("/login", (req, res) => {
  res.render("developer/login");
});

developerRouter.post("/login", loginUser);

developerRouter.get('/forgot-password', (req, res) => {
  res.render("developer/forgotPass");
})
developerRouter.post('/forgot-password', forgotPassword);

developerRouter.get('/reset-password', (req, res) => {
  res.render("developer/resetPass");
});
developerRouter.post('/reset-password', resetPassword);

developerRouter.post("/logout", logoutUser);

developerRouter.get('/profile', VerifyToken, getProfile);

developerRouter.post('/update-profile', VerifyToken, updateProfile);

developerRouter.get('/', async(req, res) => {
  try {
    res.render('developer/index');
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).send('Error fetching collections');
  }
});

developerRouter.get('/user-activity-logs', getDeveloperActivityLogs);

developerRouter.post('/notification/create',MasterNotificationCreate)
developerRouter.get('/notification/all',getMasterNotification)

export default developerRouter;
