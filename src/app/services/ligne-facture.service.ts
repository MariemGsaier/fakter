import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// const baseUrl = 'http://localhost:8080/api/lignefacture';
const createUrl= 'http://localhost:8080/api/lignefacture/'
@Injectable({
  providedIn: 'root'
})
export class LigneFactureService {

  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(createUrl, data);
  }
 
}
