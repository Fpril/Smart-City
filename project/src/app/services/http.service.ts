import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private configUrl: string = 'assets/config/';

  constructor(private http: HttpClient) { }

  public getMenu (): Observable<any> {
    return this.http.get(`${this.configUrl}menu.json`)
  }

  public getContent (): Observable<any> {
    return this.http.get(`${this.configUrl}info.json`)
  }

  // public getCurrentLocation (): Observable<any> {
  //   return this.http.get(this.gpsUrl)
  // }
}
