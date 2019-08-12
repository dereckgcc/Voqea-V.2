'use strict'

var express = require('express');
var TaskController = require('../controllers/taskController');
var md_auth = require('../middlewares/authenticated');
var multiparty = require('connect-multiparty');
var mdSubir = multiparty({uploadDir: './src/uploads/users'});

//Routes
var api = express.Router();

//Tasks
api.get('/getTasks', TaskController.getTasks);
api.get('/getTask/:id', md_auth.ensureAuth, TaskController.getTask);
api.post('/addTask/:id',md_auth.ensureAuth, TaskController.addTask);
api.put('/editTask/:id', md_auth.ensureAuth, TaskController.editTask);
api.delete('/deleteTask/:id', md_auth.ensureAuth, TaskController.deleteTask);
api.put('/changeState/:id',md_auth.ensureAuth, TaskController.changeState);

module.exports = api;