const router = require("express").Router();
const Job = require("../db/models/Job");
const Student = require("../db/models/Student");
const bcrypt = require("bcryptjs");
const { varifyAdmin } = require("./varifyToken");
const { registerValidation } = require("../validation");

router.get("/", (req, res) => {
	res.json({ msg: "admin update api route" });
});
// admin update form api
// add new student
router.post("/student/:id", varifyAdmin, async (req, res) => {
	// console.log(req.body);
	try {
		// validate data
		// const { error } = registerValidation({
		// 	name: req.body.name,
		// 	email: req.body.email,
		// });
		// if (error) {
		// 	return res
		// 		.status(200)
		// 		.send({ msg: error.details[0].message, loginFlag: false });
		// }
		// store the new student
		await Student.updateOne(
			{ _id: req.params.id },
			{
				$set: {
					// enrollmentNo: req.body.enrollmentNo,
					// email: req.body.email,
					name: req.body.name,
					department: req.body.department,
					cpi: req.body.cpi,
					division: req.body.division,
				},
			},
			{ upsert: true },
			function (err) {
				return res.status(200).json({
					msg: "error while updating student data, please try again",
				});
			}
		);

		res.status(200).json({ msg: "Student Updated successfully..." });
	} catch (err) {
		res.status(200).json({ msg: "Server error, please try again" });
	}
});

// add new job
router.post("/job/:id", varifyAdmin, async (req, res) => {
	try {
		// update new record to Database
		await Job.updateOne(
			{ _id: req.params.id },
			{
				$set: {
					name: req.body.companyName,
					email: req.body.email,
					location: req.body.location,
					jobTitle: req.body.jobTitle,
					jobDescription: req.body.jobDescription,
					hiringStatus: req.body.hiringStatus,
				},
			},
			{ upsert: true },
			function (err) {
				return res.status(200).json({ msg: "error in updating job" });
			}
		);

		res.status(200).json({ msg: "Job Updated successfully..." });
	} catch (err) {
		console.log(err);
		res.status(200).json({ msg: "Server error, please try again" });
	}
});

module.exports = router;
