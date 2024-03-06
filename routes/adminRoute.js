const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getAllDoctorsList, getAllUsersList, changeAccountStatusController } = require("../controller/adminController");

const router = express.Router();

router.get("/doctors-list", authMiddleware, getAllDoctorsList);
router.get("/users-list", authMiddleware, getAllUsersList);
router.post("/change-account-status", authMiddleware, changeAccountStatusController);


module.exports = router;