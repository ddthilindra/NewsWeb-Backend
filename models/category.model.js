const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const categorySchema = new Schema({
  category: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
