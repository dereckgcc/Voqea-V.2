'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LevelSchema = Schema({
    number: Number,
    experience: {type: Schema.ObjectId, ref: 'Task'},
    score: Number,
    rewards:{
        reward1: {type: Schema.ObjectId, ref: 'Reward'},
        reward2: {type: Schema.ObjectId, ref: 'Reward'},
        reward3: {type: Schema.ObjectId, ref: 'Reward'}
    }    ,
    selectedReward: {type: Schema.ObjectId, ref: 'Reward'},
    reached: Boolean
});

module.exports = mongoose.model('Level', LevelSchema);