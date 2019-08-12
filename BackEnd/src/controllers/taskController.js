'use strict'

var Task = require('../models/task');
var admin = 'admin';
var supervisor = 'supervisor'


function addTask(req, res){
    var task = new Task();
    var params = req.body;
    var userId = req.params.id

    if(req.user.role == admin || req.user.role == supervisor){
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
        }else{
            return res.status(200).send('Solo los Administradores y Supervisores pueden Agregar Tasks ');  
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
    Task.find().populate('admin').exec((err, tasks) => {
            if (err) return res.status(500).send({ message: 'Error in Task' })
            if (!tasks) return res.status(500).send({ message: 'Error to list Task' })

            return res.status(200).send({ tasks });
        }) //con el populate le decimos a que columna queremos que vaya y busque
}




function editTask(req, res){
    var taskId = req.params.id;
    var params = req.body;

    delete params.password;

    if(req.user.role == admin || req.user.role == supervisor){
        Task.findByIdAndUpdate(taskId, params, {new:true}, (err, taskUpdated)=>{
            if(err) return res.status(500).send({message: 'Request error'}) 
            if(!taskUpdated) return res.status(404).send({message: 'The task could not be updated'})
            return res.status(200).send({ task: taskUpdated })
    
        });
    } else {
        return res.status(200).send('Advertencia, necesita permisos de Administrador o Supervisor'); 
    }

}

function deleteTask(req, res){
    var taskId = req.params.id;

    if(req.user.role == admin || req.user.role == supervisor){
            Task.findByIdAndDelete(taskId,(err, taskDeleted)=>{
                if(err) return res.status(500).send({message: 'Request error'});     
                if(!taskDeleted) return res.status(404).send({message: 'Incorrect ID'});                
                if (err) return next(err);
                res.send('Task deleted');
            });
        } else {
            return res.status(200).send('Advertencia, necesita permisos de Administrador o Supervisor');
        }   
}

function changeState(req, res){
    var params = req.body;
    var taskId = req.params.id;
    var opcion = params.opcion;

    Task.findById(taskId, (err,taskUpdated)=>{
        if(err) return res.status(500).send({message:'Request error,err'})
        if(taskUpdated){
            console.log(taskUpdated.state.withOutStarting);
            console.log(opcion);

            switch (opcion) {
                case '1':
                        taskUpdated.state.withOutStarting = 1;
                        taskUpdated.state.inAction = 0;
                        taskUpdated.state.finished = 0;
                        break;
                case '2':
                        taskUpdated.state.withOutStarting = 0;
                        taskUpdated.state.inAction = 1;
                        taskUpdated.state.finished = 0;
                        break;
                case '3':
                        taskUpdated.state.withOutStarting = 0;
                        taskUpdated.state.inAction = 0;
                        taskUpdated.state.finished = 1;                  
                    break;
            
                default:
                        taskUpdated.state.withOutStarting = 1;
                        taskUpdated.state.inAction = 0;
                        taskUpdated.state.finished = 0;
                    break;
            }
            taskUpdated.save();
            return res.status(200).send({Task:taskUpdated});
        }
    })
}

module.exports = {
    getTasks,
    getTask,
    addTask,
    editTask,
    deleteTask,
    changeState
}