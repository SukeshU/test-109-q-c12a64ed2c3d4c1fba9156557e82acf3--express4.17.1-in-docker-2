var express = require("express");
var router = express.Router();
var haversine = require("haversine-distance");

const Register = require("../model/register");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Express"
  });
});

/* Register a driver */

router.post("/api/v1/driver/register/", async (req, res, next) => {

  const {
    name,
    email,
    phone_number,
    license_number,
    car_number
  } = req.body;

  let isEmail = await Register.find({
    email: req.body.email
  });
  let isPhone = await Register.find({
    phone_number: req.body.phone_number
  });
  let isLicenseNumber = await Register.find({
    license_number: req.body.license_number,
  });
  let isCarNumber = await Register.find({
    car_number: req.body.car_number
  });
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
      res.status(400).send({
        status: "failure",
        reason: "Invalid data"
      });
    } else {
      const register = new Register(req.body);
      await register.save();

      let response = {
        "id": register._id,
        "name": register.name,
        "email": register.email,
        "phone_number": register.phone_number,
        "license_number": register.license_number,
        "car_number": register.car_number
      }

      res.status(201).send(response);
    }
  } catch (e) {
    res
      .status(400)
      .send({
        status: "failure",
        reason: "Sorry, something went wrong!"
      });
  }
});

/* Share Driver Location */

router.post('/api/v1/driver/:id/sendLocation/', async (req, res) => {

  if (!req.params.id || !req.body.latitude || !req.body.longitude) {
    return res.status(400).send({
      status: 'failure',
      reason: 'Invalid updates.!'
    })
  }
  try {
    const driverLocation = await Register.findOne({
      _id: req.params.id
    })

    driverLocation.latitude = req.body.latitude;
    driverLocation.longitude = req.body.longitude;
    driverLocation.save()
    res.status(202).send({
      status: "success"
    });
  } catch (e) {
    res
      .status(400)
      .send({
        status: "failure",
        reason: "Sorry, something went wrong!"
      });
  }
})

/* Get Nearby Cabs */

router.post("/api/v1/passenger/available_cabs/", async (req, res) => {

  if (!req.body.latitude || !req.body.longitude) {
    return res.status(400).send({
      status: 'failure',
      reason: 'Invalid updates.!'
    })
  }
  try {
    let result = [];
    let driverList;
    const driver = await Register.find({})

    driver.map((value) => {

      var point1 = {
        lat: req.body.latitude,
        lng: req.body.longitude
      }

      var point2 = {
        lat: value.latitude,
        lng: value.longitude
      }
      var haversine_m = haversine(point1, point2); //Results in meters (default)
      var haversine_km = haversine_m / 1000; //Results in kilometers
      if (parseInt(haversine_km) <= 4) {
        driverList = {
          name: value.name,
          car_number: value.car_number,
          phone_number: value.phone_number
        }
        result.push(driverList)
      }
    })
    if (result.length > 0) {
      res.status(200).send({
        available_cabs: result
      });
    } else {
      res
        .status(200)
        .send({
          "message": "No cabs available!"
        });
    }
  } catch (e) {
    res
      .status(400)
      .send({
        status: "failure",
        reason: "Sorry, something went wrong!"
      });
  }



});

module.exports = router;