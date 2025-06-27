import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getHouses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/house`, {
      headers: this.getHeaders(),
    });
  }

  getHouseById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/house/${id}`, {
      headers: this.getHeaders(),
    })
  }

  createHouse(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/house`, data, {
      headers: this.getHeaders(),
    });
  }

  updateHouse(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/house/${id}`, data, {
      headers: this.getHeaders(),
    });
  }
}
