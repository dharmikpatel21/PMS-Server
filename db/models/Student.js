const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
	enrollmentNo: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, require: true },
	department: { type: String, required: true },
	cpi: { type: Number, required: true },
	division: { type: String, required: true },
	registeredAt: { type: Date, default: Date.now() },
});

const Student = mongoose.model("students", studentSchema);

module.exports = Student;
