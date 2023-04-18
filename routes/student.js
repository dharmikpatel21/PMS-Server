const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Job = require("../db/models/Job");
const AppliedJob = require("../db/models/AppliedJob");
const { registerValidation, loginValidation } = require("../validation");
const { varifyStudent } = require("./varifyToken");
const Student = require("../db/models/Student");

router.get("/", (req, res) => {
	res.json({ msg: "student API route" });
});

router.post("/login", async (req, res) => {
	// validate data
	const { error } = loginValidation(req.body);
	if (error)
		return res
			.status(200)
			.send({ error: error.details[0].message, loginFlag: false });
	// check user in db
	const student = await Student.findOne({ email: req.body.email });
	if (!student)
		return res
			.status(200)
			.send({ error: "invalid email", loginFlag: false });
	// check password
	const validPassword = await bcrypt.compare(
		req.body.password,
		student.password
	);
	if (!validPassword)
		return res
			.status(200)
			.send({ error: "invalid password", loginFlag: false });
	// generate jwt token
	const jwt_key = process.env.JWT_SECRET_KEY;
	const token = jwt.sign({ _id: student.id, email: student.email }, jwt_key, {
		expiresIn: "24h",
	});
	res.header("auth-token", token).send({
		msg: "User Loged in Successfully",
		loginFlag: true,
		authToken: token,
		userInfo: student.name,
	});
});

router.post("/apply", varifyStudent, async (req, res) => {
	const jobId = req.body.jobId;
	try {
		const appliedjob = await AppliedJob.findOne({ jobId: jobId });
		if (appliedjob) {
			return res.status(200).json({ msg: "Already applied for job" });
		}
		const job = await Job.findOne({ _id: jobId });
		const {
			_id,
			name,
			email,
			location,
			jobTitle,
			jobDescription,
			hiringStatus,
		} = job;
		if (!job) {
			return res.status(200).json({ msg: "No such a job found" });
		}
		const newAppliedJob = new AppliedJob({
			studentemail: req.body.student.email,
			jobId: _id,
			name,
			email,
			location,
			jobTitle,
			jobDescription,
			hiringStatus,
		});
		const result = await newAppliedJob.save();
		res.json({ result, msg: "applied for job" });
	} catch (err) {
		res.status(200).json({
			msg: "error! can't apply for job, try again leter",
		});
	}
});

router.post("/profile/:id", varifyStudent, async (req, res) => {
	try {
		const { email, password } = req.body.data;
		if (!email && !password) return res.json({ msg: "Already Updated" });
		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedpassword = await bcrypt.hash(password, salt);
			req.body.data.password = hashedpassword;
			console.log(hashedpassword, req.body.data);
		}
		await Student.updateOne(
			{ _id: req.params.id },
			{
				$set: req.body.data,
			},
			{ upsert: true },
			function (err) {
				return res.status(200).json({
					msg: "error while updating student Profile, please try again",
				});
			}
		);

		res.status(200).json({ msg: "Profile Updated successfully..." });
	} catch (err) {
		res.status(200).json({ msg: "Server error, please try again" });
	}
});

module.exports = router;
