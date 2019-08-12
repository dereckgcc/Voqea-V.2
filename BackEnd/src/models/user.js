'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    lastname: String,
    email: String,
    password: String,
    role: String,
    image: String,
    job: String,
    number: Number,
    company: String,
    area: String,
    level: Number,
    rewards: []
});

module.exports = mongoose.model('User', UserSchema);