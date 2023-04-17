require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5001;

// import db
require("./db/config");

// import routes
// import api routes
const adminRoute = require("./routes/admin");
const adminFetchRoute = require("./routes/adminFetch");
const adminAddRoute = require("./routes/adminAdd");
const adminUpdateRoute = require("./routes/adminUpdate");
const studentRoute = require("./routes/student");
const studentFetchRoute = require("./routes/studentFetch");

// middleware
app.use(cors());
app.use(express.json());

// route middleware
// api routes
app.use("/api/admin", adminRoute);
app.use("/api/admin/fetch", adminFetchRoute);
app.use("/api/admin/add", adminAddRoute);
app.use("/api/admin/update", adminUpdateRoute);
app.use("/api/student", studentRoute);
app.use("/api/student/fetch", studentFetchRoute);

// start server
app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});
