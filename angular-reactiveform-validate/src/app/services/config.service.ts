import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../model/employee';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  employeeUrl: string = 'http://localhost:3000/employees';

  constructor(
    private http: HttpClient,
  ) { }

  query(queryString: string): Observable<Employee> {
    let url = `${this.employeeUrl}?${queryString}`;
    return this.http.get<Employee>(url);
  }
}
