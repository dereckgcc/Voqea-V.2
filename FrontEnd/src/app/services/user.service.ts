import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/user.model";
import { GLOBAL} from "./global.service";

@Injectable()
export class UserService {
  public url: String;
  public identity;
  public token;

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
   }

   getIdentity(){
    var identity2 = JSON.parse(sessionStorage.getItem('identity'))
    if(identity2 != 'undefined'){
      this.identity = identity2;
    }else{
      this.identity = null;
    }
    return this.identity;
  }

  getToken(){
    var token2 = sessionStorage.getItem('token')
    if(token2 != 'undefined'){
      this.token = token2;
    }else{
      this.token = null;
    }
    return this.token;
  }

  login(user, getToken=null): Observable<any>{
      if(getToken != null){
          user.getToken = getToken;
      }
      let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url + 'login', params, {headers:headers});
  }

  registro(user: User):Observable<any>{
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url + 'registrar', params, {headers: headers});
  }

  updateUser(user: User): Observable<any>{
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

    return this._http.put(this.url + 'editarUsuario/' + user._id, params, {headers: headers})

  }
  
  deleteUser(user: User):Observable<any>{
  
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

    return this._http.delete(this.url + 'eliminarUsuario/' + user._id, {headers:headers})
  }

  
}
