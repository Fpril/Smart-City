import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {

  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  parkings: Array<any>;
  @ViewChild("gmap", {static: true}) gmapElement: ElementRef;
  @ViewChild("container", {static: false}) container: ElementRef;
  @ViewChild("popup", {static: false}) popup: ElementRef;
  @ViewChildren('allRows') allRows: QueryList<any>;
  map: google.maps.Map;
  showTrafic: boolean = false;
  markers: google.maps.Marker[] = [];
  routes: Array<any>;
  placeService: google.maps.places.PlacesService;
  trafficLayer: google.maps.TrafficLayer = new google.maps.TrafficLayer();
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
  Lviv: google.maps.LatLng = new google.maps.LatLng(49.839684, 24.029716);
  mapProp = {
    center: this.Lviv,
    zoom: 13,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ] as google.maps.MapTypeStyle[],
  }

  constructor(private http: HttpService) { }

  private initMap (): void {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.map = new google.maps.Map(this.gmapElement.nativeElement, this.mapProp);
    this.directionsRenderer.setMap(this.map);
  }

  private initRoutes (): void {
    this.http.getRoutes().pipe(takeUntil(this.destroy)).subscribe(res => {
      const reader = new FileReader();

      reader.onload = event => {
        const data = reader.result;
        const excelData = XLSX.read(data, {type: 'binary'});
        const jsonData: any = excelData.SheetNames.reduce((initial, name) => {
          const sheet = excelData.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        this.routes = jsonData.combined;
      }

      reader.readAsBinaryString(res);
    }, err => {
      console.log(err);
    });
  }

  createRoute (route): void {
    console.log(route)
    const origin = new google.maps.LatLng(route.lat_end_stop_1, route.lon_end_stop_1);
    const destination = new google.maps.LatLng(route.lat_end_stop_2, route.lon_end_stop_2);

    const request: google.maps.DirectionsRequest = {
      origin: origin,
      destination: destination,
      unitSystem: google.maps.UnitSystem.METRIC,
      travelMode: google.maps.TravelMode.TRANSIT,
      provideRouteAlternatives: true
    }

    this.directionsService.route(request, (result, status) => {
      if (status == 'OK') {
        console.log(result)
        this.directionsRenderer.setDirections(result);
        this.toggle();
      }
    });
  }

  toggle (): void {
    this.container.nativeElement.classList.toggle('blur');
    this.popup.nativeElement.classList.toggle('active');
  }

  private initButtons (): void {
    const buttons = document.querySelectorAll('.routeButton');
    buttons.forEach((btn: any) => {
      btn.addEventListener('click', (e: any) => {
        let x = e.clientX - e.target.offsetLeft - 340;
        let y = e.clientY - e.target.offsetTop - 75;

        let ripples = document.createElement('span');
        ripples.style.position = 'absolute';
        ripples.style.background = '#fff';
        ripples.style.transform = 'translate(-50%, -50%)';
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        ripples.style.pointerEvents = 'none';
        ripples.style.borderRadius = '50%';
        ripples.style.animation = 'animate 1s linear infinite';
        btn.appendChild(ripples);

        setTimeout(() => {
          ripples.remove()
        }, 1000);
      });
    });
  }

  ngOnInit(): void {
    this.initMap();
    this.initRoutes();
  }

  ngAfterViewInit(): void {
    this.allRows.changes.pipe(takeUntil(this.destroy)).subscribe(t => {
      this.initButtons();
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  toggleMode (): void {
    this.showTrafic = !this.showTrafic;
    if (this.showTrafic) {
      this.trafficLayer.setMap(this.map);
    } else {
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.map = new google.maps.Map(this.gmapElement.nativeElement, this.mapProp);
      this.directionsRenderer.setMap(this.map);
    }
  }

}
