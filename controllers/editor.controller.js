const Editor = require("../models/editor.model");
const cloudinary = require("../lib/cloudinary");

const image = "not found";

const utils = require("../lib/utils");
const jsonwebtoken = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const { userRegistrationValidation, loginValidate } = require("../validation");

exports.addEditor = async function (req, res) {
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

  const emailExist = await Editor.findOne({ email: req.body.email });
  if (emailExist)
    return res
      .status(200)
      .json({ code: 200, success: true, message: "Email already available" });

  const editor = new Editor({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    image: result?.secure_url || image,
    password: req.body.password,
    mobile: req.body.mobile,
    type: "Editor",
  });
  try {
    var savedEditor = await editor.save();
    const token = utils.generateAuthToken(savedEditor);
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

exports.loginEditor = async function (req, res) {
  try {
    const { error } = loginValidate(req.body);
    if (error)
      return res.status(200).json({
        code: 200,
        success: false,
        message: error.details[0].message,
      });

    const editor = await Editor.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!editor)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid Email" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      editor.password
    );

    if (!validPassword)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid Password" });
    const token = utils.generateAuthToken(editor);
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
    const editor = await Editor.findOne({ email });
    if (!editor) {
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Editor not found" });
    }

    const token = utils.generateAuthToken(editor);

    sendForgotEmail(token.token, editor);
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
          const editor = await Editor.findOne({ email: verification.sub.email });
          if (!editor) {
            return res.status(200).json({
              code: 200,
              success: false,
              status: "Unauthorized",
              msg: "Token is invalid. Please contact Administrator",
            });
          }
          editor.password = req.body.password;
          await editor.save();
          const token = utils.generateAuthToken(editor);
          res.status(200).json({
            code: 200,
            success: true,
            data: editor,
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

exports.getEditor = function (req, res) {
  let followers = [];
  let following = [];
  try {
    Editor.findById(req.params.id, function (err, editor) {
      followers = editor.followers;
      following = editor.following;
      if (err) {
        return res
          .status(200)
          .json({ code: 200, success: false, message: "Invalid ID!" });
      }
      if (editor) {
        res.status(200).json({
          code: 200,
          success: true,
          data: editor,
          followersCount: followers.length,
          followingsCount: following.length,
          message: "Profile is received",
        });
      } else {
        res.status(200).json({
          code: 200,
          success: false,
          data: editor,
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

exports.getAllEditors = async function (req, res) {
  Editor.find()
    .then((data) => {
      return res.status(200).json({
        code: 200,
        success: true,
        data: data,
        message: "Editors are received",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Editor.",
      });
    });
};

exports.updateEditorByID = async function (req, res) {
  try {
    let editor = await Editor.findById(req.params.id);
    let result;

    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }

    const data = {
      userName: req.body.userName || editor.userName,
      image: result?.secure_url || editor.image,
      email: req.body.email || editor.email,
      language: req.body.language || editor.language,
      about: req.body.about || editor.about,
      fcm_token: req.body.fcm_token || editor.fcm_token,
    };

    console.log("data", data);
    editor = await Editor.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({
      code: 200,
      success: true,
      data: editor,
      message: "Editor Updated Successfully!",
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getEditorById = async function (req, res) {
  try {
    const email = req.body.email;
    const editor = await Editor.findOne({ email });
    if (!editor) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No valid editor with this email : ${email}`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Editor with this email : ${email}`,
        data: editor,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};
