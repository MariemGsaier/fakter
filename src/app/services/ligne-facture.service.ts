import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LigneFacture } from '../models/ligne-facture.model';
const baseUrl= 'http://localhost:8080/api/lignefacture/'
@Injectable({
  providedIn: 'root'
})
export class LigneFactureService {

  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
  getArticle(id: any): any {
    return this.http.get(`${baseUrl}/${id}`);
  }

  getAll(): Observable<LigneFacture[]> {
    return this.http.get<LigneFacture[]>(baseUrl);
  }

 
}
