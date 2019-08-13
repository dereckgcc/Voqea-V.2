'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var admin = 'admin';
var usuarios = 'user';
var supervisor = 'supervisor';
var path = require('path');
var fs = require('fs');

function crearUsuario(req, res){
    var user = new User();
    var params = req.body;

    if(req.user.rol==admin || req.user.rol==supervisor){

        if(params.name && params.lastname && params.email && params.password && params.company && params.job && params.area){
            user.name = params.name;
            user.lastname = params.lastname;
            user.email = params.email;
            user.password = params.password;
            user.company = req.user.company;
            user.job = params.job;
            user.area = params.area;
            user.rol = 'user';
            user.level = 0;
            user.image = null;
            user.number = 0;
            user.rewards = params.rewards;
            User.find({$or: [
                {email: user.email.toLowerCase()},
                {email: user.email.toUpperCase()},
            ]}).exec((err, users)=>{
                if(err) return res.status(500).send({message: 'Error en la peticion de usaurio'});

                if(users && users.length >= 1){
                    return res.status(500).send({message: 'El usuario ya existe en el sistema'});
                }else{
                    bcrypt.hash(params.password, null, null, (err, hash)=>{
                        user.password = hash;

                        user.save((err, userSaved)=>{
                            if(err) return res.status(500).send({message: 'Error al guardar al usuario'});

                            if(userSaved){
                                res.status(200).send({user: userSaved});
                            }else{
                                res.status(404).send({message: 'No se ha podido registrar al usuario'});
                            }
                        });
                    });
                }
            });
        }else{
            res.status(200).send({message: 'Rellene todos los campos necesarios'});
        }
    }else{
        res.status(200).send({message: 'No eres admin o supervisor para realizar esta acción'});
    }
}

function registrar(req, res){
    var user = new User();
    var params = req.body;

        if(params.name && params.lastname && params.email && params.password  && params.job && params.area && params.rol){
            user.name = params.name;
            user.lastname = params.lastname;
            user.email = params.email;
            user.password = params.password;
            user.company = params.company;
            user.job = params.job;
            user.area = params.area;
            user.rol = params.rol;
            user.level = 0;
            user.image = null;
            user.number = params.number;
            user.rewards = params.rewards;
            User.find({$or: [
                {email: user.email.toLowerCase()},
                {email: user.email.toUpperCase()},
            ]}).exec((err, users)=>{
                if(err) return res.status(500).send({message: 'Error en la peticion de usaurio'});

                if(users && users.length >= 1){
                    return res.status(500).send({message: 'El usuario ya existe en el sistema'});
                }else{
                    bcrypt.hash(params.password, null, null, (err, hash)=>{
                        user.password = hash;

                        user.save((err, userSaved)=>{
                            if(err) return res.status(500).send({message: 'Error al guardar al usuario'});

                            if(userSaved){
                                res.status(200).send({user: userSaved});
                            }else{
                                res.status(404).send({message: 'No se ha podido registrar al usuario'});
                            }
                        });
                    });
                }
            });
        }else{
            res.status(200).send({message: 'Rellene todos los campos necesarios'});
        }
}


function login(req, res){
    var params = req.body;
    var correo = params.email;
    var clave = params.password;
    
    User.findOne({email: correo}, (err, user)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(user){
            bcrypt.compare(clave, user.password, (err, check)=>{
                if(check){
                    if(params.getToken){
                        if(user.rol == admin){
                            return res.status(200).send({token: jwt.createToken(user)});
                        }else if(user.rol == usuarios){
                            return res.status(200).send({token: jwt.createToken(user)});
                        }else if(user.rol == supervisor){
                            return res.status(200).send({token: jwt.createToken(user)});
                        }else{
                            return res.status(200).send({message: 'Usted no es parte del sistema'});
                        }
                    }else{
                        user.password = undefined;
                        return res.status(200).send({user: user});
                    }
                }else{
                    return res.status(404).send({message: 'Usuario No Identificado'})
                }
            });
        }else{
            return res.status(404).send({message: 'El Usuario no ha Iniciado Sesión'})
        }
    });
}

function getUser(req, res){

    var userId = req.params.id;
    var params = req.body;
    
    
    User.findById(userId, params, {new: true}, (err, userEnc)=>{
        if(err) return res.status(500).send({message: 'Error en la Petición'});
    
        if(!userEnc) return res.status(404).send({message: 'No se ha podido Listar los Datos del Partido'});
    
        return res.status(200).send({user: userEnc});
    });
}


function getUsers(req, res){
    User.find().exec((err, usersEnc)=>{
        if(err) return res.status(500).send({message:'Error en la Peticion'})
        if(!usersEnc) return res.status(404).send({message:'No se encontraron Usuarios'})
        return res.status(200).send({users: usersEnc})
    }) 
}


function editarUsuario(req, res){
    var userId = req.params.id;
    var params = req.body;
    delete params.password;

    if(req.user.rol==admin || req.user.rol==supervisor){

        User.findByIdAndUpdate(userId, params, {new:true}, (err, userUpdated)=>{
            if(err) return res.status(500).send({message: 'Error en la petición'});

            if(!userUpdated) return res.status(404).send({message: 'No se han podido actualizar los datos del usuario'});

            return res.status(200).send({user: userUpdated});
        });

    }else{
        res.status(200).send({message: 'No eres admin o supervisor para realizar esta acción'});
    }
}


function eliminarUsuario(req, res){
    var userId = req.params.id;
    var rolId = req.params.rol;

    if(req.user.rol==admin || req.user.rol==supervisor){

        if(userId == req.user.sub){
            return res.status(200).send({message: 'No puede eliminar su propio perfil'});
        }else if(rolId == admin){
            return res.status(200).send({message: 'Petición de eliminar Admin inválida'});
        }else{
            User.findByIdAndDelete(userId,(err, userDeleted)=>{
                if(err) return res.status(500).send({message: 'Error en la petición'});

                if(!userDeleted) return res.status(404).send({message: 'No se han podido eliminar los datos del usuario'});

                if(err) return next(err);
                res.status(200).send({message: 'Eliminado correctamente'});
            })
        }

    }else{
        res.status(200).send({message: 'No eres admin o supervisor para realizar esta acción'});
    }
}

function subirImagenUser(req, res) {
    var userId = req.params.id;
    
    if (req.files) {
        var file_path = req.files.image.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[3];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(ext_split);

        var file_ext = ext_split[1];
        console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, usuarioActualizado) => {
                if (err) return res.status(500).send({ message: ' no se a podido actualizar el usuario' })

                if (!usuarioActualizado) return res.status(404).send({ message: 'error en los datos del usuario, no se pudo actualizar' })

                return res.status(200).send({ user: usuarioActualizado });
            })
        } else {
            return removeFilesOfUploads(res, file_path, 'extension no valida')
        }

    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message })
    })
}

function obtenerImagenUser(req, res) {
    var image_file = req.params.nombreImagen;
    var path_file = './src/uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'no existe la imagen' })
        }
    });
}



module.exports = {
    registrar,
    login,
    getUser,
    getUsers,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    subirImagenUser,
    obtenerImagenUser
}