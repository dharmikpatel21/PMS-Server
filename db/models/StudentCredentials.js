const mongoose = require("mongoose");

const studentCredentialsSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now() },
});

const StudentCredentials = mongoose.model(
    "studentcredentials",
    studentCredentialsSchema
);

module.exports = StudentCredentials;
