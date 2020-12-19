import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private configUrl: string = 'assets/config/';
  private apiUrl: string = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  public getMenu (): Observable<any> {
    return this.http.get(`${this.configUrl}menu.json`)
  }

  public getContent (): Observable<any> {
    return this.http.get(`${this.configUrl}info.json`)
  }

  public getCars (): Observable<any> {
    return this.http.get(`${this.apiUrl}car/read`)
  }
}
