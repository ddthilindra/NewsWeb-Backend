const Category = require("../models/category.model");

exports.addCategory = async function (req, res) {
  try {
    var cat = await Category.findOne({category:req.body.category});
    if (cat) {
      res.status(200).json({
        code: 200,
        success: true,
        message: "Category already available",
      });
    } else {
      const category = new Category({
        category: req.body.category,
        description: req.body.description,
      });
      await category.save();

      res.status(200).json({
        code: 200,
        success: true,
        message: `${category.category} Category created successfully`,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getAllCategory = async function (req, res) {
  Category.find()
    .then((data) => {
      return res.status(200).json({
        code: 200,
        success: true,
        data: data,
        message: "Category are received",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Category.",
      });
    });
};

exports.deleteCategoryById = async function (req, res) {
  try {
    const id = req.params.id;
    var category = await Category.findByIdAndDelete(id);
    if (category) {
      res.status(200).json({
        code: 200,
        success: true,
        data: category,
        message: "Category deleted successfully",
      });
    } else {
      res.status(500).json({
        code: 500,
        success: true,
        message: "Already deleted this category or invalid category id",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};
