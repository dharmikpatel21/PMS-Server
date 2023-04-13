const router = require("express").Router();
const Admin = require("../db/models/Admin");
const AppliedJob = require("../db/models/AppliedJob");
const ApprovedJob = require("../db/models/ApprovedJob");
const Job = require("../db/models/Job");
const Student = require("../db/models/Student");
const { varifyAdmin } = require("./varifyToken");

router.get("/", (req, res) => {
	res.send("admin add api route");
});
// admin add form api
router.post("/student", varifyAdmin, async (req, res) => {
	// console.log(req.body);
	try {
		// check for student in db
		const exist = await Student.findOne({
			enrollmentNo: req.body.enrollmentNo,
		});
		if (exist)
			return res.status(200).json({
				msg: "Student already exists with this enrollment...",
			});

		// store the new student
		const newStudent = new Student({
			enrollmentNo: req.body.enrollmentNo,
			name: req.body.name,
			email: req.body.email,
			department: req.body.department,
			cpi: req.body.cpi,
			division: req.body.division,
		});

		const result = await newStudent.save();
		if (!result)
			return res
				.status(500)
				.json({ msg: "database error while adding student data..." });

		res.status(200).json({ msg: "Student added successfully...", result });
	} catch (err) {
		res.status(400).json({ msg: "Server error, please try again" });
	}
});

module.exports = router;
