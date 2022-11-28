import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  entity: string = 'users';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }

  get(id?: number | string): Observable<User | User[]> {
    let url = `${this.config.apiUrl}${this.entity}`;
    if (id) {
      url += `/${id}`;
    }
    return this.http.get<User | User[]>(url);
  }

  query(queryString: string): Observable<User | User[]> {
    let url = `${this.config.apiUrl}${this.entity}?${queryString}`;
    return this.http.get<User | User[]>(url);
  }

  update(user: User): Observable<User> {
    let url = `${this.config.apiUrl}${this.entity}/${user.id}`;
    return this.http.put<User>(url, user);
  }
}
