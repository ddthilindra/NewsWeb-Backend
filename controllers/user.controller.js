const User = require("../models/user.model");
const cloudinary = require("../lib/cloudinary");

const image = "not found";

const utils = require("../lib/utils");
const jsonwebtoken = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const { userRegistrationValidation, loginValidate } = require("../validation");

exports.addUser = async function (req, res) {
  const body = req.body;
  let result;
  if (req.file) {
    result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profilePicture",
    });
  }

  const { error } = userRegistrationValidation({
    ...body,
  });
  if (error)
    return res.status(200).json({
      code: 200,
      success: false,
      message: error.details[0].message,
    });

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res
      .status(200)
      .json({ code: 200, success: true, message: "Email already available" });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    image: result?.secure_url || image,
    password: req.body.password,
    type: "Admin",
  });
  try {
    var savedUser = await user.save();
    const token = utils.generateAuthToken(savedUser);
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

exports.loginUser = async function (req, res) {
  try {
    const { error } = loginValidate(req.body);
    if (error)
      return res.status(200).json({
        code: 200,
        success: false,
        message: error.details[0].message,
      });

    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid Email" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid Password" });
    const token = utils.generateAuthToken(user);
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

exports.forgotPassword = async function (req, res, next) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ code: 200, success: false, message: "User not found" });
    }

    const token = utils.generateAuthToken(user);

    sendForgotEmail(token.token, user);
    res.status(200).json({
      code: 200,
      success: true,
      data: "Please check your email to reset password.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.resetPassword = async function (req, res) {
  try {
    if (req.query.token) {
      const tokenParts = req.query.token.split(" ");

      if (
        tokenParts[0] === "Bearer" &&
        tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
      ) {
        try {
          const verification = jsonwebtoken.verify(
            tokenParts[1],
            process.env.ACCESS_TOKEN_SECRET
          );
          const user = await User.findOne({ email: verification.sub.email });
          if (!user) {
            return res.status(200).json({
              code: 200,
              success: false,
              status: "Unauthorized",
              msg: "Token is invalid. Please contact Administrator",
            });
          }
          user.password = req.body.password;
          await user.save();
          const token = utils.generateAuthToken(user);
          res.status(200).json({
            code: 200,
            success: true,
            data: user,
            token: token,
            message: "Password reset successfully",
          });
        } catch (err) {
          res.status(200).json({
            code: 200,
            success: false,
            status: "Unauthorized1",
            msg: "Can't reset your password. Please contact Administrator",
          });
        }
      } else {
        res.status(200).json({
          code: 200,
          success: false,
          status: "Unauthorized2",
          msg: "Can't reset your password. Please contact Administrator",
        });
      }
    } else {
      res.status(200).json({
        code: 200,
        success: false,
        status: "TokenError",
        msg: "Can't reset your password. Please contact Administrator",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getUser = function (req, res) {
  let followers = [];
  let following = [];
  try {
    User.findById(req.params.id, function (err, user) {
      followers = user.followers;
      following = user.following;
      if (err) {
        return res
          .status(200)
          .json({ code: 200, success: false, message: "Invalid ID!" });
      }
      if (user) {
        res.status(200).json({
          code: 200,
          success: true,
          data: user,
          followersCount: followers.length,
          followingsCount: following.length,
          message: "Profile is received",
        });
      } else {
        res.status(200).json({
          code: 200,
          success: false,
          data: user,
          message: "Profile is not found",
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getAllUsers = async function (req, res) {
  User.find()
    .then((data) => {
      return res.status(200).json({
        code: 200,
        success: true,
        data: data,
        message: "Users are received",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};

exports.updateUserProfileByID = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    let result;

    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }

    const data = {
      userName: req.body.userName || user.userName,
      image: result?.secure_url || user.image,
      email: req.body.email || user.email,
      language: req.body.language || user.language,
      about: req.body.about || user.about,
      fcm_token: req.body.fcm_token || user.fcm_token,
    };

    console.log("data", data);
    user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({
      code: 200,
      success: true,
      data: user,
      message: "User Updated Successfully!",
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getProfileId = async function (req, res) {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No valid user with this email : ${email}`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        message: `User with this email : ${email}`,
        data: user,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};
