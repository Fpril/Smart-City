import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  parkings: Array<any>;
  @ViewChild("gmap", {static: true}) gmapElement: ElementRef;
  map: google.maps.Map;
  markers: Array<google.maps.Marker> = [];

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.initParkings();
    this.initMap();
  }

  private initMap (): void {
    const Lviv = new google.maps.LatLng(49.839684, 24.029716);
    const mapProp = {
      center: Lviv,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    google.maps.event.addListener(this.map, 'click', event => this.placeMarker(event.latLng));
  }

  private placeMarker (location) {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map
    });
    this.markers.push(marker);
    console.log(this.markers)
  }

  private initParkings (): void {
    this.http.getParkings().pipe(takeUntil(this.destroy)).subscribe(data => {
      const reader = new FileReader();
      
      reader.onload = e => {
        const data = reader.result;
        const excelData = XLSX.read(data, { type: 'binary'});
        const jsonData: any = excelData.SheetNames.reduce((initial, name) => {
          const sheet = excelData.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        this.parkings = jsonData.Sheet2.filter(parking => parking.parking_places_amount >= 20);
      }

      reader.readAsBinaryString(data);
    }, err => {
      console.log(err);
    })
  }

}
