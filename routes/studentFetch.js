const router = require("express").Router();
const Student = require("../db/models/Student");
const Job = require("../db/models/Job");
const ApprovedJob = require("../db/models/ApprovedJob");
const AppliedJob = require("../db/models/AppliedJob");
const { varifyStudent } = require("./varifyToken");

router.get("/", (req, res) => {
	res.json({ message: "student fetch api route" });
});
// student fetch api
router.get("/dashboard", varifyStudent, async (req, res) => {
	try {
		const jobCount = await Job.find({}).count();
		const appiedJobCount = await AppliedJob.find({
			studentemail: req.body.student.email,
		}).count();
		const approvedJobCount = await ApprovedJob.find({
			studentemail: req.body.student.email,
		}).count();
		const data = [
			{ _id: 1, label: "Approved Jobs", value: approvedJobCount },
			{ _id: 2, label: "Applied Jobs", value: appiedJobCount },
			{ _id: 3, label: "Total Jobs", value: jobCount },
		];
		res.json(data);
	} catch (err) {
		res.status(400).json({ error: "can't fetch student dashboard data" });
	}
});

router.get("/jobs", varifyStudent, async (req, res) => {
	try {
		const jobs = await Job.find({});
		res.json(jobs);
	} catch (err) {
		res.status(400).json({ error: "can't fetch students jobs data" });
	}
});
router.post("/jobs", varifyStudent, async (req, res) => {
	const query = new RegExp(req.body.query, "i");
	try {
		const jobs = await Job.find({
			$and: [
				{
					$or: [
						{ name: query },
						{ jobTitle: query },
						{ location: query },
					],
				},
			],
		});
		res.json(jobs);
	} catch (err) {
		res.status(400).json({ error: "can't fetch students jobs data" });
	}
});
router.get("/appliedjobs", varifyStudent, async (req, res) => {
	try {
		const appliedJob = await AppliedJob.find({
			studentemail: req.body.student.email,
		});
		res.json(appliedJob);
	} catch (err) {
		res.status(400).json({
			error: "can't fetch student's applied jobs data",
		});
	}
});
router.post("/appliedjobs", varifyStudent, async (req, res) => {
	const query = new RegExp(req.body.query, "i");
	try {
		const appliedJob = await AppliedJob.find({
			$and: [
				{ studentemail: req.body.student.email },
				{
					$or: [
						{ name: query },
						{ jobTitle: query },
						{ location: query },
					],
				},
			],
		});
		res.json(appliedJob);
	} catch (err) {
		res.status(400).json({
			error: "can't fetch student's applied jobs data",
		});
	}
});
router.delete("/appliedjobs/:id", varifyStudent, async (req, res) => {
	console.log(req.params.id);
	try {
		const result = await AppliedJob.deleteOne({ _id: req.params.id });
		if (!result) return res.json({ msg: "No any application found" });
		res.json({ msg: "Application removed" });
	} catch (err) {
		res.json({ msg: "can't delete Application, Please try again" });
	}
});

router.get("/approvedjobs", varifyStudent, async (req, res) => {
	try {
		const approvedJob = await ApprovedJob.find({
			studentemail: req.body.student.email,
		});
		res.json(approvedJob);
	} catch (err) {
		res.status(400).json({
			error: "can't fetch student's approved jobs data",
		});
	}
});

router.post("/approvedjobs", varifyStudent, async (req, res) => {
	const query = new RegExp(req.body.query, "i");
	try {
		const appliedJob = await ApprovedJob.find({
			$and: [
				{ studentemail: req.body.student.email },
				{
					$or: [
						{ name: query },
						{ jobTitle: query },
						{ location: query },
					],
				},
			],
		});
		res.json(appliedJob);
	} catch (err) {
		res.status(400).json({
			error: "can't fetch student's approved jobs data",
		});
	}
});

router.get("/myprofile", varifyStudent, async (req, res) => {
	try {
		const studentData = await Student.findOne({
			email: req.body.student.email,
		});
		res.json(studentData);
	} catch (err) {
		res.status(400).json({
			error: "can't fetch student data",
		});
	}
});

module.exports = router;
