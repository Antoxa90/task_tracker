let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let User = new Schema({
    login: {
        type: String, unique : true, required: true, dropDups: true
    },
    password: {
        type: String, required: true
    },
    role: {
        type: String, required: true
    },
    emailConfirmed: {
        type: Boolean, default: true
    },
    name: {
        type: String, required: true
    },
    surname: {
        type: String, required: true
    },
    lastname: {
        type: String, required: true
    }
});

User.methods.validPassword = function(pwd) {
    return (this.password === pwd);
};

User.methods.hasConfirmed = function () {
    return this.emailConfirmed;
};

module.exports = mongoose.model('User', User);