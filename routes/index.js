var express = require("express");
var router = express.Router();

const Register = require("../model/register");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* Register a driver */
router.post("/api/v1/driver/register/", async (req, res, next) => {
  const { name, email, phone_number, license_number, car_number } = req.body;

  let isEmail = await Register.find({ email: req.body.email });

  let isPhone = await Register.find({ phone_number: req.body.phone_number });

  let isLicenseNumber = await Register.find({
    license_number: req.body.license_number,
  });

  let isCarNumber = await Register.find({ car_number: req.body.car_number });
  try {
    if (
      !name ||
      !email ||
      !phone_number ||
      !license_number ||
      !car_number ||
      isEmail.length > 0 ||
      isPhone.length > 0 ||
      isLicenseNumber.length > 0 ||
      isCarNumber.length > 0 ||
      phone_number.toString().length > 10 ||
      phone_number.toString().length < 10
    ) {
      res.status(400).send({ status: "failure", reason: "Invalid data" });
    } else {
      const register = new Register(req.body);
      await register.save();
      res.status(201).send(register);
    }
  } catch (e) {
    res
      .status(400)
      .send({ status: "failure", reason: "Sorry, something went wrong!" });
  }
});

module.exports = router;
