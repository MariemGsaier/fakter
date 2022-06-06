import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prixarticle } from '../models/prixarticle.model';
const baseUrl = 'http://localhost:8080/api/prix';
const createUrl= 'http://localhost:8080/api/prix/create'

@Injectable({
  providedIn: 'root'
})
export class PrixarticleService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Prixarticle[]> {
    return this.http.get<Prixarticle[]>(baseUrl);
  }
  create(data: any): Observable<any> {
    return this.http.post(createUrl, data);
  }
  // update(id: any, data: any): Observable<any> {
  //   return this.http.put(`${baseUrl}/${id}`, data);
  // }
  // delete(id: any): Observable<any> {
  //   return this.http.delete(`${baseUrl}/${id}`);
  // }
  // deleteAll(): Observable<any> {
  //   return this.http.delete(baseUrl);
  // }
}
