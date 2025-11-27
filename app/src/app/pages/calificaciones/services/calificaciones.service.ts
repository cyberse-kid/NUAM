// calificaciones.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalificacionesService {

  private url = 'http://127.0.0.1:8000/api/calificaciones/';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  // ✅ NUEVO MÉTODO OPTIMIZADO PARA DASHBOARD
  obtenerEstadisticasDashboard(): Observable<any> {
    return this.http.get<any>(`${this.url}dashboard_stats/`);
  }

  buscar(filtro: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}?search=${filtro}`);
  }

  obtener(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}${id}/`);
  }

  crear(data: any): Observable<any> {
    return this.http.post<any>(this.url, data);
  }

  actualizar(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.url}${id}/`, data);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}${id}/`);
  }
}