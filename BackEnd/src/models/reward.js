'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RewardSchema = Schema({
    name: Number,
    image: String,
    level: {type: Schema.ObjectId, ref: 'Level'}
});

module.exports = mongoose.model('Reward', RewardSchema);