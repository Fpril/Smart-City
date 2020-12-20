import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private localUrl: string = 'assets/';
  private apiUrl: string = 'https://polar-headland-79210.herokuapp.com/';

  constructor(private http: HttpClient) { }

  public getMenu (): Observable<any> {
    return this.http.get(`${this.localUrl}config/menu.json`)
  }

  public getContent (): Observable<any> {
    return this.http.get(`${this.localUrl}config/info.json`)
  }

  public getCars (): Observable<any> {
    return this.http.get(`${this.apiUrl}car/read`)
  }

  public createOrder (order): Observable<any> {
    return this.http.post(`${this.apiUrl}order/create`, {order: order})
  }

  public herokuWakeUp (): Observable<any> {
    return this.http.get(`${this.apiUrl}`)
  }

  public getRoutes (): Observable<any> {
    return this.http.get(`${this.localUrl}data/routes.xlsx`, { responseType: 'blob' })
  }
}
