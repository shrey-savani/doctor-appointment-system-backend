const express = require("express");
const {
    login,
    register,
    authController,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDoctorsController,
    userAppointmentController
} = require("../controller/userController.js");
const { bookAppointmnetController, bookingAvailabilityController } = require("../controller/appointmnetController.js")
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/getUserData", authMiddleware, authController);
router.post("/apply-doctor", authMiddleware, applyDoctorController);
router.post("/get-all-notification", authMiddleware, getAllNotificationController);
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController);
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);
router.post('/book-appointmnet', authMiddleware, bookAppointmnetController);
router.post('/booking-availabilty', authMiddleware, bookingAvailabilityController);
router.get("/user-appointments", authMiddleware, userAppointmentController)

module.exports = router;