import { Component, OnInit,ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model'
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [UserService]
})
export class HomeComponent implements OnInit {
  @ViewChild('formAddUser')formValuesAddUser;
  
  public status;
  public url;
  public identity;
  public token;

  public user:User;
  public userModel : User


  constructor(
    private _router: Router,
    private _userService: UserService
  ) { 
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = new User ("","","","","","user","","",0,"","",0,"")
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    this._userService.getUsers().subscribe(
      response=>{
        if(response.users){
          console.log(response.users);
          this.user = response.users;
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
          this.userModel = response.user;
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


  crearUsuario(){
    this._userService.crearUsuario(this.user, this.token).subscribe(
      response=>{
        if(response){
          console.log(response.user)
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
    this._userService.updateUser(this.userModel,this.token, id ).subscribe(
      response=>{
        if(!response.userModel){
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
    this._userService.deleteUser(this.userModel, this.token, id).subscribe(
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
    this.userModel._id = _id;
  }

  setName(name: String){
    this.userModel.name = name
  }

  setLastName(lastname: String){
    this.userModel.lastname = lastname
  }

  setEmail(email: String){
    this.userModel.email = email
  }

  setRol(rol: String){
    this.userModel.rol = rol
  }

  setJob(job: String){
    this.userModel.job = job
  }

  setNumber(number: Number){
    this.userModel.number = number
  }

  setCompany(company: String){
    this.userModel.company = company
  }

  setArea(area: String){
    this.userModel.area = area
  }

  setLevel(level: Number){
    this.userModel.level = level
  }

  limpiarForm(){
    this.formValuesAddUser.resetForm();
  }




}


