import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UploadService } from 'src/app/services/upload.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  providers: [UserService,UploadService]
})
export class PerfilComponent implements OnInit {
  public identity;
  public token;
  public url;
  public status: string;
  public user: User;

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService
  ) {
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

   }

  ngOnInit() {
  }
  editUser(id){
    this._userService.updateUser(this.user, this.token,id).subscribe(
      response=>{
        if(!response.user){
          this.status = 'Error'
        }else{
          this.status = 'Succes'
          
          sessionStorage.setItem('identity',JSON.stringify(this.user))
          this.identity = this.user;

          //SUBIR IMAGEN DEL USUARIO
          this._uploadService.makeFileRequest(this.url + 'subir-imagen-usuario/'+ this.user._id, [], this.filesToUpload, this.token, 'image')
          .then((result:any)=>{
            console.log(result);
            this.user.image = result.user.image;
            sessionStorage.setItem('identity',JSON.stringify(this.user))
            
          })
        }
      },
      error=>{
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = 'Error'
        }
      }
    )
  }

  public filesToUpload: Array<File>
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}


