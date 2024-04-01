import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoServiceService {

  url = "https://todo-application-069s.onrender.com"

  constructor( private http : HttpClient) { }


// post

postFormData(data : any) {
  return this.http.post(`${this.url}/posts/add`,  data)
}



getData()  {
  return this.http.get(`${this.url}/posts`)
}


}
