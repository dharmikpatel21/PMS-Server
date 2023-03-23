const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("Server connected to database");
    })
    .catch((err) => {
        console.log("error during database connection");
    });
