const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../db/models/Admin");
const { registerValidation, loginValidation } = require("../validation");

router.get("/", (req, res) => {
    res.json({ msg: "admin API route" });
});

router.post("/login", async (req, res) => {
    // validate data
    const { error } = loginValidation(req.body);
    if (error)
        return res
            .status(200)
            .send({ error: error.details[0].message, loginFlag: false });
    // check admin in db
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin)
        return res
            .status(200)
            .send({ error: "invalid email", loginFlag: false });
    // check password
    const validPassword = await bcrypt.compare(
        req.body.password,
        admin.password
    );
    if (!validPassword)
        return res
            .status(200)
            .send({ error: "invalid password", loginFlag: false });
    // generate jwt token
    const jwt_key = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ _id: admin.id, email: admin.email }, jwt_key, {
        expiresIn: "24h",
    });
    res.header("auth-token", token).send({
        msg: "Admin Loged in Successfully",
        loginFlag: true,
        authToken: token,
        userInfo: admin.name,
    });
});

module.exports = router;
