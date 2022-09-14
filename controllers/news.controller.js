const News = require("../models/news.model");
const mongoose = require("mongoose");
const cloudinary = require("../lib/cloudinary");
const messages = require("../messages/messages");

const image = "not found";

exports.addNews = async function (req, res) {
  console.log(req.body) 
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
    description: req.body.description,
  });
  try {
    console.log(news);
    await news.save();

    res.status(200).json({
      code: 200,
      success: true,
      message: "News created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getNewsById = async function (req, res) {
  try {
    const id = req.params.id;
    const news = await News.findById(id);
    console.log(news);
    if (!news) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No News found!`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        data: news,
        message: `News is received`,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};
exports.getNewsByCategory = async function (req, res) {
  try {
    const category = req.params.category;
    console.log(category)
    const news = await News.find({category:category});
    console.log(news);
    if (!news) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No News found!`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        data: news,
        message: `News is received`,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getAllNews = async function (req, res) {
  News.find()
    .then((data) => {
      return res.status(200).json({
        code: 200,
        success: true,
        data: data,
        message: "News are received",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving News.",
      });
    });
};

exports.updateNewsById = async function (req, res) {
  try {
    let news = await News.findById(req.params.id);
    let result;

    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "newsPicture",
      });
    }

    const data = {
      title: req.body.title || news.title,
      image: result?.secure_url || news.image,
      category: req.body.category || news.category,
      description: req.body.description || news.description,
    };

    console.log("data", data);
    news = await News.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({
      code: 200,
      success: true,
      data: news,
      message: "News Updated Successfully!",
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.deleteNewsById = async function (req, res) {
  try {
    const id = req.params.id;
    var news = await News.findByIdAndDelete(id);
    if (news) {
      res.status(200).json({
        code: 200,
        success: true,
        Sticker: news,
        message: "News deleted successfully",
      });
    } else {
      res.status(500).json({
        code: 500,
        success: true,
        message: "Already deleted this news or invalid news id",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};
