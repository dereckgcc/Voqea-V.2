'use strict'

var Task = require('../models/task');
var Reward = require('../models/reward');
var admin = 'admin';
var supervisor = 'supervisor'


function addTask(req, res){
    var task = new Task();
    var params = req.body;
    var userId = req.params.id

    
        if (params.title && params.description) {
            task.title = params.title;
            task.description = params.description;
            task.maker = userId;
            task.score = params.score;
            task.state = {
                withOutStarting: 0,
                inAction: 0, 
                finished: 0
            };
        
            Task.find({ $or: [
                {title: task.title.toLowerCase()},
                {title: task.title.toUpperCase()},
                {description: task.description.toLowerCase()},
                {description: task.description.toUpperCase()}
    
            ]}).exec((err, tasks) =>{
                if(err) return res.status(500).send({message: 'Error en la peticion'});
    
                if(tasks && tasks.length >= 1){
                    return res.status(500).send({message: 'Task ya existe en el sistema'});
                }else{
                    task.save((err, taskGuardado)=>{
                        if(err) return res.status(500).send({message: 'Error al Guardar Task'});
    
                        if(taskGuardado){
                                res.status(200).send({task: taskGuardado});
                        }else{
                                res.status(404).send({message: 'No se ha Podido Registrar the Task'});
                        }
                    })
                }
            })
        }else {
            res.status(200).send({message: 'Rellene todos los datos necesarios'});
            }
       
}

function getTask(req, res){

    var taskId = req.params.id;
    var params = req.body;
    
        Task.findById(taskId, params, {new: true}, (err, taskEnc)=>{
            if(err) return res.status(500).send({message: 'Error en la Petición'});
    
            if(!taskEnc) return res.status(404).send({message: 'No se ha podido Listar los Datos del Task'});
    
            return res.status(200).send({task: taskEnc});
    });
}

function getTasks(req, res) {
    Task.find().populate('task').exec((err, tasks) => {
            if (err) return res.status(500).send({ message: 'Error in Task' })
            if (!tasks) return res.status(500).send({ message: 'Error to list Task' })

            return res.status(200).send({ tasks });
        }) 
}




function editTask(req, res){
    var taskId = req.params.id;
    var params = req.body;

    delete params.password;

    
        Task.findByIdAndUpdate(taskId, params, {new:true}, (err, taskUpdated)=>{
            if(err) return res.status(500).send({message: 'Request error'}) 
            if(!taskUpdated) return res.status(404).send({message: 'The task could not be updated'})
            return res.status(200).send({ task: taskUpdated })
    
        });
}

function deleteTask(req, res){
    var taskId = req.params.id;

    
    Task.findByIdAndDelete(taskId,(err, taskDeleted)=>{
        if(err) return res.status(500).send({message: 'Error en la petición'});

        if(!taskDeleted) return res.status(404).send({message: 'No se han podido eliminar los datos del usuario'});

        if(err) return next(err);
        res.status(200).send({message: 'Eliminado correctamente'});
    })
}

function addReward(req, res){
    var reward = new Reward();
    var params = req.body;
    var taskId = req.params.id

    
        if (params.name) {
            reward.name = params.name;
            reward.user = taskId;
       
        
            Reward.find({ $or: [
                {name: reward.name.toLowerCase()},
                {name: reward.name.toUpperCase()}
        
            ]}).exec((err, rewards) =>{
                if(err) return res.status(500).send({message: 'Error en la peticion'});
    
                    reward.save((err, rewardGuardado)=>{
                        if(err) return res.status(500).send({message: 'Error al Guardar Task'});
    
                        if(rewardGuardado){
                                res.status(200).send({reward: rewardGuardado});
                        }else{
                                res.status(404).send({message: 'No se ha Podido Registrar the Task'});
                        }
                    })
                
            })
        }else {
            res.status(200).send({message: 'Rellene todos los datos necesarios'});
            }
       
}

function getRewards(req, res) {
    Reward.find().populate('reward').exec((err, rewards) => {
            if (err) return res.status(500).send({ message: 'Error in Task' })
            if (!rewards) return res.status(500).send({ message: 'Error to list Task' })

            return res.status(200).send({ rewards });
        }) 
}


module.exports = {
    getTasks,
    getTask,
    addTask,
    editTask,
    deleteTask,
    addReward,
    getRewards
 
}