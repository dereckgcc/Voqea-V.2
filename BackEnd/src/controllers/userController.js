'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var admin = 'admin';
var usuarios = 'user';
var supervisor = 'supervisor';
var path = require('path');
var fs = require('fs');

function registrar(req, res){
    var user = new User();
    var params = req.body;
        if(params.name && params.lastname && params.email && params.password && params.company && params.job && params.area){
            user.name = params.name;
            user.lastname = params.lastname;
            user.email = params.email;
            user.password = params.password;
            user.company = params.company;
            user.job = params.job;
            user.area = params.area;
            user.role = 'user';
            user.level = 0;
            user.image = null;
            user.number = 0;
            user.rewards = [];
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
                        if(user.role == admin){
                            return res.status(200).send({token: jwt.createToken(user)});
                        }else if(user.role == usuarios){
                            return res.status(200).send({token: jwt.createToken(user)});
                        }else if(user.role == supervisor){
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


function listarUsuarios(req, res){
    if(req.user.role==admin || req.user.role==supervisor){
        User.find().exec((err, usersFindeds)=>{
            if(err) return res.status(500).send({message:'Error en la Peticion'})
            if(!usersFindeds) return res.status(404).send({message:'No se encontraron Usuarios'})
            return res.status(200).send({users: usersFindeds})
        })
    }    
}


function crearUsuario(req, res){
    var user = new User();
    var params = req.body;
    if(req.user.role==admin || req.user.role==supervisor){
        if(params.name && params.lastname && params.email && params.password  && params.job && params.area && params.role){
            user.name = params.name;
            user.lastname = params.lastname;
            user.email = params.email;
            user.password = params.password;
            user.company = req.user.company;
            user.job = params.job;
            user.area = params.area;
            user.role = params.role;
            user.level = 0;
            user.image = null;
            user.number = params.number;
            user.rewards = [];
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


function editarUsuario(req, res){
    var userId = req.params.id;
    var params = req.body;
    delete params.password;

    if(req.user.role==admin || req.user.role==supervisor){

        User.findByIdAndUpdate(userId, params, {new:true}, (err, userUpdated)=>{
            if(err) return res.status(500).send({message: 'Error en la petición'});

            if(!userUpdated) return res.status(404).send({message: 'No se han podido actualizar los datos del usuario'});

            return res.status(200).send({user: userUpdated});
        });

    }else{
        res.status(200).send({message: 'No eres admin o supervisor para realizar esta acción'});
    }
}

function update(req, res){
    var params = req.body
    var userId = req.params.id

    User.updateOne(userId, params, {new:true},(err, userUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else if(userUpdated){
            res.status(200).send({userUpdated});
        }
    });

}

function eliminarUsuario(req, res){
    var userId = req.params.id;
    var rolId = req.params.role;

    if(req.user.role==admin || req.user.role==supervisor){

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



module.exports = {
    registrar,
    login,
    update,
    listarUsuarios,
    crearUsuario,
    editarUsuario,
    eliminarUsuario
}