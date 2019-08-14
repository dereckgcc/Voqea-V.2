'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RewardSchema = Schema({
    name: String,
    image: String
});

module.exports = mongoose.model('Reward', RewardSchema);