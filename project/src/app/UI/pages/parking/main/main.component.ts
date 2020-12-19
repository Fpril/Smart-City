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
  markers: google.maps.Marker[] = [];
  placeService: google.maps.places.PlacesService;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
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
    
    const request = {
      location: Lviv,
      radius: 20000,
      type: 'parking'
    }

    this.placeService = new google.maps.places.PlacesService(this.map);
    this.placeService.nearbySearch(request, (results, status) => {
      results.forEach(result => {
        this.placeMarker(result.geometry.location, result.name);
      })
    });
  }

  private placeMarker (location, name) {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: name ? name : ''
    });
    this.markers.push(marker);
  }

  // private initParkings (): void {
  //   this.http.getParkings().pipe(takeUntil(this.destroy)).subscribe(data => {
  //     const reader = new FileReader();
      
  //     reader.onload = async e => {
  //       const data = reader.result;
  //       const excelData = XLSX.read(data, { type: 'binary'});
  //       const jsonData: any = excelData.SheetNames.reduce((initial, name) => {
  //         const sheet = excelData.Sheets[name];
  //         initial[name] = XLSX.utils.sheet_to_json(sheet);
  //         return initial;
  //       }, {});
  //       this.parkings = jsonData.Sheet2.filter(parking => parking.parking_places_amount >= 5 && parking.parking_type === 'загального користування');
  //       this.placeService = new google.maps.places.PlacesService(this.map);
  //       for (let parking of this.parkings) {
  //         const query = `${parking.type} ${parking.parking_area_address} ${parking.parking_area_address_building ? parking.parking_area_address_building : ''}`;
  //         const request = {
  //           query: query
  //         }
  //         console.log(request)
  //         await this.placeService.textSearch(request, (results, status) => {
  //           console.log(results)
  //           if (status === google.maps.places.PlacesServiceStatus.OK) {
  //             this.placeMarker(results[0].geometry.location);
  //           }
  //         });
  //       }
  //     }

  //     reader.readAsBinaryString(data);
  //   }, err => {
  //     console.log(err);
  //   })
  // }

}
