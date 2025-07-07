import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getVolunteers(page = 1, limit = 10, search = '', sort = ''): Observable<any[]> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    if (search) params = params.set('search', search);
    if (sort) params = params.set('sort', sort);

    return this.http.get<any[]>(`${this.baseUrl}/volunteers`, {
      params, headers: this.getHeaders(),
    });
  }

  getVolunteerById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/volunteers/${id}`, {
      headers: this.getHeaders(),
    })
  }

  createVolunteer(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/volunteers`, data, {
      headers: this.getHeaders(),
    });
  }

  updateVolunteer(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/volunteers/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  deleteVolunteer(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/volunteers/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
