const News = require("../models/news.model");
const mongoose = require("mongoose");
const cloudinary = require("../lib/cloudinary");
const messages = require("../messages/messages");

const image = "not found";

const utils = require("../lib/utils");


exports.addNews = async function (req, res) {
  const body = req.body;
  let result;
  if (req.file) {
    result = await cloudinary.uploader.upload(req.file.path, {
      folder: "newsPicture",
    });
  }
  
  const news = new News({
    title: req.body.title,    
    image: result?.secure_url || image,
    category: req.body.category,
    description: req.body.description
  });
  try {
    await news.save();    

    res.status(200).json({
      code: 200,
      success: true,
      token: token,
      message: "News created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};