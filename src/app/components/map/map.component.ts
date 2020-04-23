import { SharedStateService } from './../../services/SharedState/shared-state.service';
import { IPlaceNode } from './../../services/SEPA/queryResults.model';
import { SEPASubscriptionsService } from './../../services/SEPA/SEPASubscriptions/sepasubscriptions.service';
import {
  Component,
  AfterViewInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import * as L from 'leaflet';
import { IMapPlace } from 'src/app/services/SEPA/queryResults.model';
import { Subscription } from 'rxjs';

export interface IMarker {
  id: number;
  bigCircle: L.Circle;
  smallCircle: L.Circle;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map: L.Map;
  private markers: IMarker[];
  private italyMarker: L.Marker;
  private subscriptions: Subscription;

  constructor(
    private sepaSubs: SEPASubscriptionsService,
    private sharedState: SharedStateService
  ) {
    this.map = undefined;
    this.markers = [];
    this.italyMarker = undefined;
    this.subscriptions = new Subscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.subscriptions.add(
      this.sepaSubs.places$.subscribe(places => {
        this.clearMarkers();
        this.drawMarkers(places.toArray());
      })
    );
  }

  private clearMarkers() {
    if (this.markers) {
      this.markers.forEach(marker => {
        marker.bigCircle.off('click');
        marker.smallCircle.off('click');
        marker.bigCircle.removeFrom(this.map);
        marker.smallCircle.removeFrom(this.map);
      });
      this.markers = [];
    }
    if (this.italyMarker) {
      this.italyMarker.off('click');
      this.italyMarker.removeFrom(this.map);
      this.italyMarker = null;
    }
  }

  private initMap(): void {
    this.map = L.map('map').setView([42.825, 10.646], 5);

    const cartodbPositron = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        minZoom: 2,
        maxZoom: 8
      }
    );
    this.map.addLayer(cartodbPositron);
  }

  private drawMarkers(places: IMapPlace[]): void {
    if (places) {
      places.forEach(place => {
        this.addMarker(place);
      });
    }
  }

  private addMarker(place: IMapPlace) {
    if (place.place.value === 'http://covid19/context/country/ITA') {
      const italyIcon = L.icon({
        iconUrl: 'assets/italyFlag.png',
        iconSize: [24, 24]
      });
      this.italyMarker = L.marker([place.lat.value, place.lon.value], {
        title: name,
        icon: italyIcon
      })
        .on('click', () => this.emitClickEvent(place))
        .addTo(this.map);

      return;
    }

    // Draw a circle which dimensions represent its associated value
    const radius = Math.max(
      1000 * Math.pow(Math.log(place.cases.value), 2),
      20000
    );
    const bigCircle = L.circle(
      {
        lat: place.lat.value,
        lng: place.lon.value
      },
      {
        radius,
        stroke: false,
        fillOpacity: 0.2
      }
    );
    bigCircle.on('click', () => this.emitClickEvent(place));
    this.map.addLayer(bigCircle);

    // Draw a little dot inside of the big circle
    const smallCircle = L.circle(
      {
        lat: place.lat.value,
        lng: place.lon.value
      },
      {
        radius: 100,
        stroke: true,
        fillOpacity: 1
      }
    );
    smallCircle.on('click', () => this.emitClickEvent(place));
    this.map.addLayer(smallCircle);

    this.markers.push({
      id: place.place.value,
      bigCircle,
      smallCircle
    });
  }

  private emitClickEvent(place: IMapPlace) {
    const selectedPlace: IPlaceNode = {
      placeURI: place.place.value,
      placeLabel: place.name.value
    };
    this.sharedState.onMapSelectedPlace(selectedPlace);
  }
}
