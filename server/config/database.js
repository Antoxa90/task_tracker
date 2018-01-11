let mongoose = require('mongoose');
let log = require('./logs')(module);

mongoose.connect("mongodb://localhost/task_tracker");

let db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});

db.once('open', function callback () {
    log.info("Connected to DB!");
});