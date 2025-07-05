import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getFunds(customSearch = {}): Observable<any[]> {
    let params = new HttpParams();

    Object.entries(customSearch).forEach(([key, value]) => {
      if(value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<any[]>(`${this.baseUrl}/funds`, {
      params, headers: this.getHeaders(),
    });
  }

  getExpense(customSearch = {}): Observable<any[]> {
    let params = new HttpParams();

    Object.entries(customSearch).forEach(([key, value]) => {
      if(value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<any[]>(`${this.baseUrl}/expenses`, {
      params, headers: this.getHeaders(),
    });
  }

  getVolunteer(customSearch = {}): Observable<any[]> {
    let params = new HttpParams();

    Object.entries(customSearch).forEach(([key, value]) => {
      if(value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<any[]>(`${this.baseUrl}/volunteers`, {
      params, headers: this.getHeaders(),
    });
  }
}
