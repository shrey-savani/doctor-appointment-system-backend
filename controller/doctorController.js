const doctorModel = require("../model/doctorModel.js");
const appointmentModel = require("../model/appointmentModel.js");
const userModel = require("../model/userModel.js");

const getSingleDoctorInfo = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        res.status(200).send({
            success: true,
            message: 'Doctor data fetch Successfully',
            data: doctor
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            success: true,
            message: "Internal Server Error",
            error: e.message
        })
    }
}

const updateDocProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body);

        res.status(201).send({
            success: true,
            message: 'Doctor data updated',
            data: doctor
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            success: true,
            message: "Internal Server Error",
            error: e.message
        })
    }
}

const getSingleDoctor = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        res.status(200).send({
            success: true,
            message: 'The Doctor Data is recieved',
            data: doctor
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: e.message
        })
    }
}

const doctorAppointmentController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        const appointments = await appointmentModel.find({ doctorId: doctor?._id }).populate({ path: "userInfo", model: userModel, select: "name email" });

        res.status(200).send({
            success: true,
            message: 'Data Received',
            data: appointments
        });
    } catch (e) {
        console.log("Error in Appointment Controller", e.message);
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: e
        })
    }
}

const updateStatusController = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await appointmentModel.findByIdAndUpdate(appointmentId, { status });
        const user = await userModel.findOne({ _id: appointment.userId });
        const notification = user.notification;
        notification.push({
            type: "status-updated",
            message: `your appointment has been ${status}`,
            onClickPath: "/doctor-appointment"
        });

        await user.save();
        res.status(200).send({
            success: true,
            message: 'Status updated successfully',
            data: appointment
        });
    } catch (e) {
        console.log("Error in Appointment Controller", e.message);
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: e
        })
    }
}
module.exports = {
    getSingleDoctorInfo,
    updateDocProfileController,
    getSingleDoctor,
    doctorAppointmentController,
    updateStatusController
}