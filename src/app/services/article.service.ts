import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';
import { LignePrix } from '../models/ligne-prix.model';
const baseUrl = 'http://localhost:8080/api/articles';
const createUrl= 'http://localhost:8080/api/articles/create'

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(baseUrl);
  }
  getAllPrix(): Observable<LignePrix[]> {
    return this.http.get<LignePrix[]>(baseUrl + '/prix');
  }
  create(data: any): Observable<any> {
    return this.http.post(createUrl, data);
  }
  update(nom_article: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${nom_article}`, data);
  }
  delete(nom_article: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${nom_article}`);
  }
}
