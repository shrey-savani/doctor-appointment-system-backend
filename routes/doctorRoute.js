const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js")
const { 
    getSingleDoctorInfo, 
    getSingleDoctor, 
    updateDocProfileController, 
    doctorAppointmentController,
    updateStatusController } = require("../controller/doctorController.js");
const { get } = require("mongoose");
const router = express.Router();

router.post("/getSingleDoctorInfo", authMiddleware, getSingleDoctorInfo);
router.post("/updateDoctorInfo", authMiddleware, updateDocProfileController);
router.post("/getDoctorById", authMiddleware, getSingleDoctor)
router.get("/doctor-appointment", authMiddleware, doctorAppointmentController);
router.post("/update-status", authMiddleware, updateStatusController);


module.exports = router;