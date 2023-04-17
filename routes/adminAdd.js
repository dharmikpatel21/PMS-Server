const router = require("express").Router();
const Admin = require("../db/models/Admin");
const AppliedJob = require("../db/models/AppliedJob");
const ApprovedJob = require("../db/models/ApprovedJob");
const Job = require("../db/models/Job");
const Student = require("../db/models/Student");
const bcrypt = require("bcryptjs");
const { varifyAdmin } = require("./varifyToken");
const { registerValidation } = require("../validation");

router.get("/", (req, res) => {
	res.json({ msg: "admin add api route" });
});
// admin add form api
// add new student
router.post("/student", varifyAdmin, async (req, res) => {
	// console.log(req.body);
	try {
		// validate data
		const { error } = registerValidation({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
		});
		if (error) {
			return res
				.status(200)
				.send({ msg: error.details[0].message, loginFlag: false });
		}
		// check for student in db
		const exist = await Student.findOne({
			enrollmentNo: req.body.enrollmentNo,
		});
		if (exist)
			return res.status(200).json({
				msg: "Student already exists with this enrollment No.",
			});

		// hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		// create new student object
		const newStudent = new Student({
			enrollmentNo: req.body.enrollmentNo,
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
			department: req.body.department,
			cpi: req.body.cpi,
			division: req.body.division,
		});

		// store the new student
		const result = await newStudent.save();
		if (!result)
			return res
				.status(200)
				.json({ msg: "database error while adding student data..." });

		res.status(200).json({ msg: "Student added successfully...", result });
	} catch (err) {
		res.status(200).json({ msg: "Server error, please try again" });
	}
});

// add new job
router.post("/job", varifyAdmin, async (req, res) => {
	// console.log(req.body);
	try {
		// create new job object
		const newJob = new Job({
			name: req.body.companyName,
			email: req.body.email,
			location: req.body.location,
			jobTitle: req.body.jobTitle,
			jobDescription: req.body.jobDescription,
			hiringStatus: req.body.hiringStatus,
		});
		// Store new record to Database
		const result = await newJob.save();
		if (!result)
			return res
				.status(200)
				.json({ msg: "database error while adding job data..." });

		res.status(200).json({ msg: "Job added successfully...", result });
	} catch (err) {
		res.status(200).json({ msg: "Server error, please try again" });
	}
});
router.post("/approvejob", varifyAdmin, async (req, res) => {
	try {
		const applicationId = req.body.applicationid;
		// find job application
		const jobApplication = await AppliedJob.findById(applicationId);
		if (!jobApplication) {
			return res.status(200).json({ msg: "application not found" });
		}

		// update job application
		await AppliedJob.updateOne(
			{ _id: applicationId },
			{ $set: { approved: true } },
			{ upsert: true },
			function (err) {
				return res.json({ msg: "error in updating job application" });
			}
		);

		// create approved job object
		const newApprovedJob = new ApprovedJob({
			name: jobApplication.name,
			email: jobApplication.email,
			jobId: jobApplication.jobId,
			studentemail: jobApplication.studentemail,
			location: jobApplication.location,
			jobTitle: jobApplication.jobTitle,
			jobDescription: jobApplication.jobDescription,
			hiringStatus: jobApplication.hiringStatus,
		});
		// saving new recoard to database
		const result = await newApprovedJob.save();

		res.status(200).json({ msg: "Job Approved Successfully..." });
	} catch (err) {
		res.status(200).json({ msg: "server error" });
	}
});

module.exports = router;
