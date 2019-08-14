import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient  } from '@angular/common/http';
import { GLOBAL } from './global.service';
import { Observable } from 'rxjs';
import { Task} from '../models/task.model'

@Injectable()
export class TaskService {
  public url: String;

  constructor(public _http:HttpClient) { 
    this.url = GLOBAL.url;
  }

  getTasks():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(this.url + 'tasks', {headers:headers})
  }

   getTask(id):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(this.url + 'task/' + id, {headers:headers})

  }

  addTask(task:Task, token, id ):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization',token);
    let params = JSON.stringify(task);

    return this._http.post(this.url + 'add-task/'+ id ,params, {headers:headers})
  }

  deleteTask(task:Task, token,id){
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.delete(this.url + 'delete-task/' + id,{headers:headers});
  }

  updateTask(task:Task, token,id):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let params = JSON.stringify(task);

    return this._http.put(this.url + 'edit-task/' + id ,params, {headers:headers})
  }






}
