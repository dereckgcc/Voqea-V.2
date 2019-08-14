'use strict'

var express = require('express');
var TaskController = require('../controllers/taskController');
var md_auth = require('../middlewares/authenticated');


//Routes
var api = express.Router();

//Tasks
api.get('/tasks', TaskController.getTasks);
api.get('/task/:id',TaskController.getTask);
api.post('/add-task/:id',md_auth.ensureAuth, TaskController.addTask);
api.put('/edit-task/:id', md_auth.ensureAuth, TaskController.editTask);
api.delete('/delete-task/:id', md_auth.ensureAuth, TaskController.deleteTask);
api.post('/add-reward/:id', md_auth.ensureAuth, TaskController.addReward);
api.get('/rewards', TaskController.getRewards);

module.exports = api;