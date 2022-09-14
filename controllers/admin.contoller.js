const Admin = require("../models/admin.model");
const cloudinary = require("../lib/cloudinary");

const image = "not found";

const utils = require("../lib/utils");
const jsonwebtoken = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const { userRegistrationValidation, loginValidate } = require("../validation");

exports.addAdmin = async function (req, res) {
  const body = req.body;

  const { error } = userRegistrationValidation({
    ...body,
  });
  if (error)
    return res.status(200).json({
      code: 200,
      success: false,
      message: error.details[0].message,
    });

  const emailExist = await Admin.findOne({ email: req.body.email });
  if (emailExist)
    return res
      .status(200)
      .json({ code: 200, success: true, message: "Email already available" });

  const admin = new Admin({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    mobile: req.body.mobile
  });
  try {
    var savedAdmin = await admin.save();
    const token = utils.generateAuthToken(savedAdmin);
    res.status(200).json({
      code: 200,
      success: true,
      token: token,
      message: "Registered in successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.loginAdmin = async function (req, res) {
    try {
      const { error } = loginValidate(req.body);
      if (error)
        return res.status(200).json({
          code: 200,
          success: false,
          message: error.details[0].message,
        });
  
      const admin = await Admin.findOne({ email: req.body.email }).select(
        "+password"
      );
      if (!admin)
        return res
          .status(200)
          .json({ code: 200, success: false, message: "Invalid Email" });
  
      const validPassword = await bcrypt.compare(
        req.body.password,
        admin.password
      );
  
      if (!validPassword)
        return res
          .status(200)
          .json({ code: 200, success: false, message: "Invalid Password" });
      const token = utils.generateAuthToken(admin);
      res.status(200).json({
        code: 200,
        success: true,
        token: token,
        message: "logged in successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ code: 500, success: false, message: "Internal Server Error" });
    }
  };
