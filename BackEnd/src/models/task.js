 'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = Schema({
    title: String,
    description: String,
    maker: {type: Schema.ObjectId, ref: 'User'},
    score: Number,
    state:{
        withOutStarting: Number,
        inAction: Number,
        finished: Number
    }    
});

module.exports = mongoose.model('Task', TaskSchema);