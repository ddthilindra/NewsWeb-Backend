const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: { 
        type: String,
        default: null,
        required: false,
    },
    description: {
        type: String,
    },
});



const News = mongoose.model("news", newsSchema);

module.exports = News; 