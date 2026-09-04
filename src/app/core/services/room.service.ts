import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
/* Centralized imports from core — models and environment live alongside this service */
import { environment } from '../../../environments/environment';
import { Page } from '../models/page.model';
import { Room } from '../models/room.model';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService implements CrudService<Room> {
  /* Uses centralized environment URL — now /api/rooms */
  private apiUrl = `${environment.apiUrl}/rooms`;

  constructor(private http: HttpClient) {}

  /* Standard CRUD methods — conform to CrudService<Room> interface */
  getAll(): Observable<Room[]> {
    return this.http.get<Page<Room>>(this.apiUrl).pipe(map(page => page.content));
  }

  create(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }

  update(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, room);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
