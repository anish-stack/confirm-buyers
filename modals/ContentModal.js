const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    Secdescription: {
        type: String,
    },
    Thirddescription: {
        type: String,
    },
    list: {
        type: [String],
    },
});

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;
