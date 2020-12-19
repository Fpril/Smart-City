import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private gpsUrl: string = "http://track.ua-gis.com/gtfs/lviv/vehicle_position";

  constructor(private http: HttpClient) { }

  public getCurrentLocation (): Observable<any> {
    return this.http.get(this.gpsUrl)
  }
}
