const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { dbName: "DocApp" })
            .then(() => { console.log("Database Connected") })
            .catch(e => console.log(e));
    } catch (e) {
        console.log(`Error while connecting MongoDB: ${e}`);
    }
}

module.exports = connectDb;