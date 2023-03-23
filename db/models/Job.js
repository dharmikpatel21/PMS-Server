const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String },
    hiringStatus: { type: Boolean, required: true },
    registeredAt: { type: Date, default: Date.now() },
});

const Job = mongoose.model("jobs", jobSchema);

module.exports = Job;
