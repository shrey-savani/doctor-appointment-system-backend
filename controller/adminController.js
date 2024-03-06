const userModel = require("../model/userModel.js");
const doctorModel = require("../model/doctorModel.js");

const getAllDoctorsList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        res.status(200).send({
            success: true,
            message: "Doctors data received successfully",
            data: doctors
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            success: true,
            message: "error while fetching doctor list",
            error: e.message
        })
    }
}
const getAllUsersList = async (req, res) => {
    try {
        const users = await userModel.find({})
        res.status(200).send({
            success: true,
            message: "Users data received successfully",
            data: users
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            success: true,
            message: "error while fetching user list",
            error: e.message
        })
    }
}

const changeAccountStatusController = async (req, res) => {
    try{
        const {doctorId, status} = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, {status});
        const user = await userModel.findOne({_id: doctor.userId});
        const notification = user.notification
        notification.push({
            type:"change-account-status",
            message:`Your doctor account has been ${status}`,
            onclickPath: '/notification'
        });

        user.isDoctor = status === "approved" ? true : false;
        await user.save();

        res.status(200).send({
            success:true,
            message:'User Account Status Changed Successfully',
            data: doctor
            
        })
    }catch(e){
        console.log(e);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: e
        })
    }
}
module.exports = {
    getAllDoctorsList,
    getAllUsersList,
    changeAccountStatusController
}