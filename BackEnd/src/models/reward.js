'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RewardSchema = Schema({
    name: String,
    user: {type: Schema.ObjectId, ref: 'Task'}
});

module.exports = mongoose.model('Reward', RewardSchema);