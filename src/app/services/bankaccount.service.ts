import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bankaccount } from '../models/bankaccount.model';
const baseUrl = 'http://localhost:8080/api/bankaccounts';
const createUrl= 'http://localhost:8080/api/bankaccounts/create'

@Injectable({
  providedIn: 'root'
})
export class BankaccountService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Bankaccount[]> {
    return this.http.get<Bankaccount[]>(baseUrl);
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
