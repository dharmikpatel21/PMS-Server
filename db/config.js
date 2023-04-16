const mongoose = require("mongoose");

// mongoose.set("strictQuery", true);
// mongoose
// 	.connect(process.env.DB_URL)
// 	.then(() => {
// 		console.log("Server connected to database");
// 	})
// 	.catch((err) => {
// 		console.log("error during database connection " + err);
// 	});

mongoose
	.connect(process.env.ATLAS_DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("db connected");
	})
	.catch((err) => {
		console.log("error during database connection");
	});
