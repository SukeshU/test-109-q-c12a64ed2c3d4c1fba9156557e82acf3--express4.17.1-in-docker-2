var express = require("express");
var router = express.Router();

const Register = require("../model/register");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* Register a driver */
router.post("/api/v1/driver/register", async (req, res, next) => {
  const register = new Register(req.body);
  try {
    await register.save();
    res.status(201).send({ register });
  } catch (e) {
    res.status(400).send({ status: "failure", reason: "Sorry, something went wrong!" });
  }
});

module.exports = router;
