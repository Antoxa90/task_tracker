let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Project = new Schema({
    title: {
        type: String, required: true
    },
    description: {
        type: String, required: true
    },
    developers: {
        type: Array , default: []
    },
    manager: {
        type: String, required: true
    }
});

module.exports = mongoose.model('Project', Project);