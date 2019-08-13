'use strict'

var express = require('express');
var UserController = require('../controllers/userController');
var mdAuth = require('../middlewares/authenticated');
var multiparty = require('connect-multiparty');
var md_subir = multiparty({uploadDir: './src/uploads/users'});

//RUTAS
var api = express.Router();

//USERS
api.post('/registrar', UserController.registrar);
api.post('/login', UserController.login);
api.get('/usuario/:id', UserController.getUser);
api.get('/usuarios', UserController.getUsers);
api.post('/crear-usuario', mdAuth.ensureAuth, UserController.crearUsuario);
api.put('/editar-usuario/:id', mdAuth.ensureAuth, UserController.editarUsuario);
api.delete('/eliminar-usuario/:id', mdAuth.ensureAuth, UserController.eliminarUsuario);
api.post('/subir-imagen-usuario/:id', md_subir, UserController.subirImagenUser);
api.get('/obtener-imagen-usuario/:nombreImagen', UserController.obtenerImagenUser);

module.exports = api;