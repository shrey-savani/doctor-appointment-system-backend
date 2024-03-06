const appointmentModel = require("../model/appointmentModel.js");
const userModel = require("../model/userModel.js");
const moment = require("moment");

const bookAppointmnetController = async (req, res) => {
    try {


        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        req.body.time = moment(req.body.time, "HH:mm").toISOString();
        req.body.status = "pending";
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();
        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
        user.notification.push({
            type: 'new-appointmnet-system',
            message: `A New Appointmnet Request from ${req.body.userInfo.name}`,
            onclickPath: '/user/appointments',
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: "Appointment book successfully "
        });
    } catch (e) {
        console.log("Error in Booking Appointment: ", e);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: e
        })
    }
}

const bookingAvailabilityController = async (req, res) => {
    try {
        const date = moment(req.body.date, "DD-MM-YY").toISOString();
        const frooomTime = moment(req.body.time, "HH:mm").subtract(1, "hours").format();
        const toooTime = moment(req.body.time, "HH:mm").add(1, "hours").format();

        const doctorId = req.body.doctorId;
        const appointments = await appointmentModel.find({
            doctorId, date,
            time: { $gte: frooomTime, $lte: toooTime }
        });

        if (appointments.length > 0) {
            return res.status(200).send({
                message: "Apointment not available at this time",
                success: false
            })
        } else {
            return res.status(200).send({
                message: "Appointment slot available",
                success: true
            })
        }
    } catch (e) {
        console.log("Error in Booking availability: ", e);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: e
        })
    }
}

module.exports = {
    bookAppointmnetController,
    bookingAvailabilityController
}