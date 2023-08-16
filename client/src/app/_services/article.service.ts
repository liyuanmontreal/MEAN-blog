import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';

const API_URL = 'http://localhost:8080/api/articles';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Article[]> {   
    // get all articles    
    return this.http.get<Article[]>(API_URL );
  }

  getArticleById(id: any) {
    
    return this.http.get(`${API_URL}/${id}`);
  }

  createArticle(data: any): Observable<any> {
    return this.http.post(API_URL, data);
  }


  update(id: any, data: any): Observable<any> {
    console.log("edit by id");
    console.log(id);
    console.log(data);
    return this.http.put(`${API_URL}/${id}`, data);
   
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

}