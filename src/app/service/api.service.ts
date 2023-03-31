import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

postUserRegister(data : any){
  return this.http.post<any>("http://localhost:3000/posts",data);
}

getUserRegister(){
  return this.http.get<any>("http://localhost:3000/posts");
}

getUserById(id:number){
  return this.http.get<any>(`http://localhost:3000/posts/${id}`);
}
putData(data:any,id:number){
  return this.http.put<any>(`http://localhost:3000/posts/${id}`, data)
}

deleteData(id:number){
  return this.http.delete<any>("http://localhost:3000/posts/"+id)
}



}
