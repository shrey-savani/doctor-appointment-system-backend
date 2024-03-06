const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const userRoute = require("./routes/userRoute.js");
const adminRoute = require("./routes/adminRoute.js");
const doctorRoute = require("./routes/doctorRoute.js");
const path = require("path");
const cors = require("cors");

dotenv.config({
    path: "./config/.env"
});

connectDb();

const app = express();
app.use(cors({
    origin: 'https://doctor-appointment-system-frontend.vercel.app',
    methods: ["POST", "GET", "PUT", "DELETE"]
}));
app.use(express.json());
// app.use(express.static(path.join(__dirname, "../client/build/index.html")))
app.get("/", (req, res) => {
    res.status(200).send({
        message: "server is running"
    })
});
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/doctor", doctorRoute);


const port = process.env.PORT || 5500;
const mode = process.env.DEV_MODE;

app.listen(port, () => {
    console.log(`Server is running in ${mode} and connected on port: ${port}`);
});