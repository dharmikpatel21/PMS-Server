const jwt = require("jsonwebtoken");
const Admin = require("../db/models/Admin");
const StudentCredentials = require("../db/models/StudentCredentials");

const varifyToken = function (req, res) {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json({ error: "Access Denied" });
    try {
        const jwt_key = process.env.JWT_SECRET_KEY;
        const varifiedUser = jwt.verify(token, jwt_key);
        return varifiedUser;
    } catch (err) {
        return res.status(400).json({ err });
    }
};

const varifyStudent = async function (req, res, next) {
    const varifiedStudent = varifyToken(req, res);
    try {
        const result = await StudentCredentials.findById(varifiedStudent._id);
        if (!result)
            return res.status(400).json({ message: "invalid Student" });
        req.body.student = varifiedStudent;
        next();
    } catch (err) {
        return res.status(400).json({ err });
    }
};

const varifyAdmin = async function (req, res, next) {
    const varifiedAdmin = varifyToken(req, res);
    try {
        const result = await Admin.findById(varifiedAdmin._id);
        if (!result) return res.status(400).json({ message: "invalid User" });
        req.body.admin = varifiedAdmin;
        next();
    } catch (err) {
        return res.status(400).json({ err });
    }
};

module.exports = { varifyStudent, varifyAdmin, varifyToken };
