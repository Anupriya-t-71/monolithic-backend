import jwt from "jsonwebtoken";
import { Student } from "../../../models/Administration/Authorization/index.js";
import Session from '../../../models/Institutes/Session/index.js';
import UserActivity from '../../../models/Institutes/Session/user.js';

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: 'Please provide both email and password' });
        }

        const user = await Student.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'Email not registered' });
        }

        if (user.is_deleted) {
            return res.status(403).send({ message: 'User has been deleted please contact admin' });
        }

        if (user.password !== password) {
            return res.status(400).send({ message: 'Invalid password' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        await Session.create({ userId: user._id, loginTime: new Date() });

        // Create user activity for the day
        const currentDate = new Date();
        await UserActivity.create({ 
            userId: user._id, 
            date: currentDate.setHours(0, 0, 0, 0), // Set time to midnight
            loginTime: new Date(currentDate) // Use new Date object to prevent reference
        });

        res.status(200).send({
            success: true,
            message: 'Student Login successful',
            user: {
                name: user.name,
                email: user.email,
                roll_id: user.roll_id,
            },
            token
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in Login',
            error: error.message
        });
    }
};

export const logoutController = async (req, res) => {
    try {
        const { userId } = req.body;

        await Session.findOneAndUpdate(
            { userId, logoutTime: { $exists: false } },
            { logoutTime: new Date() }
        );

    
        const currentDate = new Date(); 
        await UserActivity.findOneAndUpdate(
            { userId, date: currentDate.setHours(0, 0, 0, 0), logoutTime: { $exists: false } },
            { logoutTime: new Date(currentDate) }
        );

        res.status(200).send({ success: true, message: 'Logout successful' });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in Logout',
            error: error.message
        });
    }
};
