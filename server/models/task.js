let mongoose = require('mongoose');
let Float = require('mongoose-float').loadType(mongoose);

let Schema = mongoose.Schema;

let Task = new Schema({
    title: {
        type: String, required: true
    },
    project: {
        type: String, required: true
    },
    developer: {
        type: String, default: null
    },
    description: {
        type: String, required: true
    },
    timeCosts: {
        type: Float, default: 0.0
    },
    status: {
        type: String, default: 'waiting'
    }
});

module.exports = mongoose.model('Task', Task);