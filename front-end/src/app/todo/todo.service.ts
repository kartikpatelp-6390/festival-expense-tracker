import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private baseUrl = `${environment.apiBaseUrl}/todos`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getTodos(page = 1, limit = 10, search = '', sort = '', customSearch = {}): Observable<any[]> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    if (search) params = params.set('search', search);
    if (sort) params = params.set('sort', sort);

    Object.entries(customSearch).forEach(([key, value]) => {
      if(value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<any[]>(`${this.baseUrl}`, {
      params, headers: this.getHeaders(),
    });
  }

  getTodoById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    })
  }

  createTodo(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data, {
      headers: this.getHeaders(),
    });
  }

  updateTodo(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  deleteTodo(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
