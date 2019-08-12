'use strict'

var express = require('express');
var UserController = require('../controllers/userController');
var mdAuth = require('../middlewares/authenticated');
var multiparty = require('connect-multiparty');
var mdSubir = multiparty({uploadDir: './src/uploads/users'});

//RUTAS
var api = express.Router();

//USERS
api.post('/registrar', UserController.registrar);
api.post('/login', UserController.login);
api.get('/listarUsuarios', mdAuth.ensureAuth, UserController.listarUsuarios);
api.post('/crearUsuario', mdAuth.ensureAuth, UserController.crearUsuario);
api.put('/editarUsuario/:id', mdAuth.ensureAuth, UserController.editarUsuario);
api.delete('/eliminarUsuario/:id', mdAuth.ensureAuth, UserController.eliminarUsuario);

module.exports = api;