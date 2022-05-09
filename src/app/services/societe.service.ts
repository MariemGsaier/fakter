import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Societe } from '../models/societe.model';
const baseUrl = 'http://localhost:8080/api/societes';
const createUrl= 'http://localhost:8080/api/societes/create'

@Injectable({
  providedIn: 'root'
})
export class SocieteService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Societe[]> {
    return this.http.get<Societe[]>(baseUrl);
  }
  get(id: any): any {
    return this.http.get(`${baseUrl}/${1}`);
  }
  create(data: any): Observable<any> {
    return this.http.post(createUrl, data);
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }
}
