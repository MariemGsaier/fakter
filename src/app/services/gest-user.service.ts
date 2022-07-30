import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
const baseUrl = 'http://localhost:8080/api/users';
const passUrl = 'http://localhost:8080/api/users/pass';
const API_URL = 'http://localhost:8080/api/auth/';

@Injectable({
  providedIn: 'root'
})
export class GestUserService {
  constructor(private http: HttpClient) { }
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(baseUrl);
  }
  create(data: any): Observable<any> {
    return this.http.post(API_URL + 'create', data);
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }
  disableUser(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl + '/disable-user'}/${id}`, data);
  }
  enableUser(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl + '/enable-user'}/${id}`, data);
  }
  updatePassword(id: any, data: any): Observable <any> {
    return this.http.put(`${passUrl}/${id}`, data);
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }


}