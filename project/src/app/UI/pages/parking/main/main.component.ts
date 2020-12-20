import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';

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
  currentLocation: google.maps.LatLng;
  placeService: google.maps.places.PlacesService;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
  Lviv: google.maps.LatLng = new google.maps.LatLng(49.839684, 24.029716);
  showTrafic: boolean = false;
  trafficLayer: google.maps.TrafficLayer = new google.maps.TrafficLayer();
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
  };

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.initMap();
    this.getCurrentLocation();
  }

  private initMap (): void {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.map = new google.maps.Map(this.gmapElement.nativeElement, this.mapProp);
    const request = {
      query: 'Парковка у Львові'
    };
    this.directionsRenderer.setMap(this.map);
    this.placeService = new google.maps.places.PlacesService(this.map);
    this.placeService.textSearch(request, (results, status) => {
      results.forEach(result => {
        this.placeMarker(result.geometry.location, result.name);
      });
    });
  }

  private placeMarker (location, name) {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: name ? name : ''
    });
    marker.addListener('click', e => {
      const origin = this.currentLocation;
      const destination = marker.getPosition() as google.maps.LatLng;

      const request: google.maps.DirectionsRequest = {
        origin: origin,
        destination: destination,
        unitSystem: google.maps.UnitSystem.METRIC,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true
      }

      this.directionsService.route(request, (result, status) => {
        if (status == 'OK') {
          this.directionsRenderer.setDirections(result);
        }
      });
    });
    this.markers.push(marker);
  }

  private getCurrentLocation (): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        this.currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.map.setCenter(this.currentLocation);
        const marker = new google.maps.Marker({
          position: this.currentLocation,
          map: this.map,
          title: 'Моя геолокація',
          animation: google.maps.Animation.BOUNCE
        });
      });
    }
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
