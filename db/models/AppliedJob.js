const mongoose = require("mongoose");

const appliedJobSchema = mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	jobId: { type: String, require: true },
	studentemail: { type: String, required: true },
	location: { type: String, required: true },
	jobTitle: { type: String, required: true },
	jobDescription: { type: String },
	hiringStatus: { type: Boolean, required: true },
	approved: { type: Boolean, default: false },
	registeredAt: { type: Date, default: Date.now() },
});

const AppliedJob = mongoose.model("appliedjobs", appliedJobSchema);

module.exports = AppliedJob;
