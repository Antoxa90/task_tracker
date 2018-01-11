let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Comment = new Schema({
    text: {
        type: String, required: true
    },
    author: {
        type: String, required: true
    },
    task: {
        type: String, required: true
    },
    update_at: {
        type: Date, default: Date.now()
    }
});

module.exports = mongoose.model('Comment', Comment);