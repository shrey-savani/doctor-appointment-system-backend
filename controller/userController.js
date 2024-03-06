const userModel = require("../model/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const doctorModel = require("../model/doctorModel");
const appointmentModel = require("../model/appointmentModel");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await userModel.findOne({ email });
        if (user) return res.status(200).json({ success: false, message: "User Already Exist" })

        const hashedPass = await bcrypt.hash(password, 10);
        user = await userModel.create({
            name, email, password: hashedPass
        });

        res.status(200).json({
            success: true,
            message: "User Registered",

        });
    }
    catch (e) {
        res.status(500).send({ success: false, message: `Error: ${e.message}` })
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await userModel.findOne({ email }).select("+password");
        if (!findUser || findUser === null) {
            return res.status(200).send({ success: false, message: "User Not Exist In The System" });
        }

        const matchPass = await bcrypt.compare(password, findUser.password);

        if (!matchPass) return res.status(200).send({ success: false, message: 'Invalid Email Or Password' });
        const token = jwt.sign({ _id: findUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            success: true,
            message: "User LoggedIn",
            token
        });
    } catch (e) {
        res.status(500).send({ success: false, message: `Error: ${e.message}` })
    }
};

const authController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        user.password = undefined;

        if (!user) {
            res.status(200).send({
                success: false,
                message: "No User Found!"
            });
        } else {
            res.status(200).send({
                success: true,
                data: user
            })
        }
    } catch (e) {
        console.log(`ERROR: ${e.message}`);
        res.status(500).send({
            success: false,
            message: `Auth Error`,
            error: e
        });
    }
}

const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModel({ ...req.body, status: "pending" });
        await newDoctor.save();
        const adminUser = await userModel.findOne({ isAdmin: true });
        const notification = adminUser.notification
        notification.push({
            type: 'doctor-apply-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for doctor account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + ' ' + newDoctor.lastName,
                onClickPath: 'admin/doctors',
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, { notification });
        res.status(201).send({
            success: true,
            message: 'Doctor Account Applied Successfully'
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            success: false,
            error: e,
            message: 'Internal Server Error'
        })
    }
}

const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req?.body?.userId });
        const seennotification = user?.seennotification;
        const notification = user?.notification;
        seennotification.push(...notification);
        user.notification = [];
        user.seennotification = notification;
        const updateUser = await user.save();

        res.status(200).send({
            success: true,
            message: 'All notification marked as read',
            data: updateUser
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Error in notification",
            success: false,
            error: e
        })
    }
}

const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req?.body?.userId });
        user.seennotification = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: 'All notification deleted successfully',
            data: updatedUser
        });

    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Error in notification",
            success: false,
            error: e
        })
    }
}

const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: "approved" });
        res.status(200).send({
            success: true,
            message: 'Successfully fetched all the approved Doctors!',
            data: doctors,
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Error in getting all doctors",
            success: false,
            error: e
        })
    }
}

const userAppointmentController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({
            userId: req.body.userId,
        }).populate({path:"doctorInfo", model:doctorModel});
        
        res.status(200).send({
            success: true,
            message: "Users Appointments Fetch SUccessfully",
            data: appointments,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Server Error ! Can't access appointment.",
            success: false,
            error: e
        })
    }
}

module.exports = {
    register,
    login,
    authController,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDoctorsController,
    userAppointmentController
};