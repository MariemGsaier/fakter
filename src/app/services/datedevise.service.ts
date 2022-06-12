import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Datedevise } from '../models/datedevise.model';
const baseUrl = 'http://localhost:8080/api/datedevises';
const createUrl= 'http://localhost:8080/api/datedevises/create'

@Injectable({
  providedIn: 'root'
})
export class DatedeviseService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Datedevise[]> {
    return this.http.get<Datedevise[]>(baseUrl);
  }
  create(data: any): Observable<any> {
    return this.http.post(createUrl, data);
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
