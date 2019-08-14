import { Component, OnInit,ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Task } from 'src/app/models/task.model';
import { Reward } from 'src/app/models/reward.model'
import { TaskService } from 'src/app/services/task.service';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [UserService, TaskService]
})
export class HomeComponent implements OnInit {
  @ViewChild('formAddUser')formValuesAddUser;
  @ViewChild('formAddTask')formValuesAddTask;
  @ViewChild('formAddReward')formValuesAddReward;
  
  public status: String;
  public url;
  public identity;
  public token;

  public users:User;
  public usuariosModel : User

  public tasks : Task;
  public taskModel: Task;

  public rewards: Reward;
  public rewardModel: Reward;


  constructor(
    private _router: Router,
    private _userService: UserService,
    private _taskService: TaskService
  ) { 
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.usuariosModel = new User ("","","","","","user","","",0,"","",0,"");
    this.taskModel= new Task("","","","",0,{withoutStarting:0, inAction:0,finished:0});
    this.rewardModel = new Reward("","reward1","")
  }

  ngOnInit() {
    this.getUsers();
    this.getTasks();
    this.getRewards();
  }

  getUsers(){
    this._userService.getUsers(this.token).subscribe(
      response=>{
        if(response.users){
          console.log(response.users);
          this.users = response.users;
        }
      },
      error=>{
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage !=null){
          this.status = 'error'
        }
      }
    )
  }

  getUser(id){
    this._userService.getUser(id).subscribe(
      response =>{
        if(response.user){
          console.log(response.user)
          this.usuariosModel = response.user;
        }
      },
      error =>{
        var erroMessage = <any>error;
        console.log(erroMessage);
        if (erroMessage != null) {
          this.status = 'error';
        }
      }
    )
  }


  registro(){
    this._userService.registro2(this.usuariosModel, this.token).subscribe(
      response=>{
        if(response){
          console.log(response.users)
          this.formValuesAddUser.resetForm();
          this.getUsers();
          this.status =  'ok'
        }
      },
      error=>{
        console.log(<any>error);
        this.status = "error"
      }
    )
  }

  editUser(id){
    this._userService.updateUser(this.usuariosModel,this.token, id ).subscribe(
      response=>{
        if(!response.usuariosModel){
          console.log(response);
          this.getUsers();
          this.status = 'ok';
        }
      },
      error=>{
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = 'error'
        }
      }
    )
  }

  deleteUser(id){
    this._userService.deleteUser(this.usuariosModel, this.token, id).subscribe(
      response => {
        if (response) {   
          this.getUsers();     
          this.status = 'ok';
          console.log(response);
        }
      },
      error => {
        var erroMessage = <any>error;
        console.log(erroMessage);
        if (erroMessage != null) {
          this.status = 'error';
        }
      }
    )
  }


  setId(_id: String){
    this.usuariosModel._id = _id;
  }

  setName(name: String){
    this.usuariosModel.name = name
  }

  setLastName(lastname: String){
    this.usuariosModel.lastname = lastname
  }

  setEmail(email: String){
    this.usuariosModel.email = email
  }

  setRol(rol: String){
    this.usuariosModel.rol = rol
  }

  setJob(job: String){
    this.usuariosModel.job = job
  }

  setNumber(number: Number){
    this.usuariosModel.number = number
  }

  setCompany(company: String){
    this.usuariosModel.company = company
  }

  setArea(area: String){
    this.usuariosModel.area = area
  }

  setLevel(level: Number){
    this.usuariosModel.level = level
  }

  limpiarForm(){
    this.formValuesAddUser.resetForm();
  }


  /*///////////////////////////-----------------TASK---------------------------////////////////////////////*/ 


  getTasks(){
    this._taskService.getTasks().subscribe(
      response=>{
        if(response.tasks){
          console.log(response.tasks);
          this.tasks = response.tasks;
        }
      },
      error=>{
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage !=null){
          this.status = 'error'
        }
      }
    )
  }

  getTask(id){
    this._taskService.getTask(id).subscribe(
      response =>{
        if(response.task){
          console.log(response.task)
          this.taskModel = response.task;
        }
      },
      error =>{
        var erroMessage = <any>error;
        console.log(erroMessage);
        if (erroMessage != null) {
          this.status = 'error';
        }
      }
    )
  }

  addTask(id){
    this._taskService.addTask(this.taskModel,this.token,id).subscribe(
      response=>{
        if(response.task){
          console.log(response.task);
          this.formValuesAddTask.resetForm();
          this.getTasks();
          this.status = 'ok'
        }
      },
      error=>{
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage !=null){
          this.status = 'error'
        }
      }
    )
  }

  editTask(id){
    this._taskService.updateTask(this.taskModel,this.token, id ).subscribe(
      response=>{
        if(!response.taskModel){
          console.log(response);
          this.getTasks();
          this.status = 'ok';
        }
      },
      error=>{
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = 'error'
        }
      }
    )
  }

  deleteTask(id){
    this._taskService.deleteTask(this.taskModel, this.token,id).subscribe(
      response => {
        if (response) {   
          this.getTasks();     
          this.status = 'ok';
          console.log(response);
        }
      },
      error => {
        var erroMessage = <any>error;
        console.log(erroMessage);
        if (erroMessage != null) {
          this.status = 'error';
        }
      }
    )
  }


  limpiarFormT(){
    this.formValuesAddUser.resetForm();
  }
  
  setIdT(_id: String){
    this.taskModel._id = _id;
  }

  setTitle(title: String){
    this.taskModel.title = title;
  }

  setDescription(description: String){
    this.taskModel.description = description
  }

  setMaker(maker: String){
    this.taskModel.maker = maker
  }

  setScore(score: Number){
    this.taskModel.score = score
  }

///////////////////////////
  getRewards(){
    this._taskService.getRewards().subscribe(
      response=>{
        if(response.rewards){
          console.log(response.rewards);
          this.rewards = response.rewards;
        }
      },
      error=>{
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage !=null){
          this.status = 'error'
        }
      }
    )
  }

  addReward(id){
    this._taskService.addReward(this.rewardModel,this.token,id).subscribe(
      response=>{
        if(response.reward){
          console.log(response.reward);
          this.formValuesAddReward.resetForm();
          this.getRewards();
          this.status = 'ok'
        }
      },
      error=>{
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage !=null){
          this.status = 'error'
        }
      }
    )
  }



}


