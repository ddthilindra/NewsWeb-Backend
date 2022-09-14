const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

const editorSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    image: { 
        type: String,
        default: null,
        required: false,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    mobile: {
        type: String,
    },
    type: {
        type: String,
    },
});

editorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


const Editor = mongoose.model("editor", editorSchema);

module.exports = Editor; 