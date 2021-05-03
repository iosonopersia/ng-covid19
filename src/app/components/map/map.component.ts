import { SharedStateService } from './../../services/SharedState/shared-state.service';
import { IPlaceNode } from './../../services/SEPA/queryResults.model';
import { SEPASubscriptionsService } from './../../services/SEPA/SEPASubscriptions/sepasubscriptions.service';
import {
  Component,
  AfterViewInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map: L.Map;
  private markers: IMarker[];
  private italyMarker: L.Marker;
  private subscriptions: Subscription;
  private maxTotalDailyCases: number;

  constructor(
    private sepaSubs: SEPASubscriptionsService,
    private sharedState: SharedStateService // private cdRef: ChangeDetectorRef
  ) {
    this.map = undefined;
    this.markers = [];
    this.italyMarker = undefined;
    this.subscriptions = new Subscription();
  }

  ngOnDestroy(): void {
    this.clearMarkers();
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.subscriptions.add(
      this.sepaSubs.places$.subscribe((places) => {
        this.clearMarkers();
        this.drawMarkers(places.toArray());
        // this.cdRef.markForCheck(); // No template bindings to update...
      })
    );
  }

  private clearMarkers() {
    if (this.markers) {
      for (const marker of this.markers) {
        marker.bigCircle.off('click');
        marker.smallCircle.off('click');
        marker.bigCircle.removeFrom(this.map);
        marker.smallCircle.removeFrom(this.map);
      }
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
        maxZoom: 8,
      }
    );
    this.map.addLayer(cartodbPositron);
  }

  private drawMarkers(places: IMapPlace[]): void {
    if (places) {
      this.maxTotalDailyCases = 0;
      for (const place of places) {
        if (place.place.value !== 'http://covid19/context/country/ITA') {
          const thisValue = parseInt(place.dailyPositiveCases.value);
          if (this.maxTotalDailyCases < thisValue) {
            this.maxTotalDailyCases = thisValue;
          }
        }
      }
      for (const place of places) {
        this.addMarker(place);
      }
    }
  }

  private addMarker(place: IMapPlace) {
    if (place.place.value === 'http://covid19/context/country/ITA') {
      const italyIcon = L.icon({
        iconUrl: 'assets/images/italyFlag.png',
        iconSize: [24, 24],
      });
      this.italyMarker = L.marker([place.lat.value, place.lon.value], {
        title: 'italyMarker',
        icon: italyIcon,
      })
        .on('click', () => this.emitClickEvent(place))
        .addTo(this.map);

      return;
    }

    // Draw a circle which dimensions represent its associated value
    const radius = Math.max(
      600 * Math.pow(Math.log(place.totalCases.value), 2),
      15000
    );
    const percentage =
      (1.0 * parseInt(place.dailyPositiveCases.value)) /
      this.maxTotalDailyCases;
    const markerColor: string = this.percentageToHsl(percentage, 120, 0);
    const bigCircle = L.circle(
      {
        lat: place.lat.value,
        lng: place.lon.value,
      },
      {
        radius,
        stroke: false,
        fillOpacity: 0.3,
        color: markerColor,
      }
    ).bindTooltip('Casi odierni: ' + place.dailyPositiveCases.value, {
      permanent: false,
      direction: 'right',
    });
    bigCircle.on('click', () => this.emitClickEvent(place));
    this.map.addLayer(bigCircle);

    // Draw a little dot inside of the big circle
    const smallCircle = L.circle(
      {
        lat: place.lat.value,
        lng: place.lon.value,
      },
      {
        radius: 100,
        stroke: true,
        fillOpacity: 1,
        color: 'darkgrey',
      }
    );
    smallCircle.on('click', () => this.emitClickEvent(place));
    this.map.addLayer(smallCircle);

    this.markers.push({
      id: place.place.value,
      bigCircle,
      smallCircle,
    });
  }

  private emitClickEvent(place: IMapPlace) {
    const selectedPlace: IPlaceNode = {
      placeURI: place.place.value,
      placeLabel: place.name.value,
    };
    this.sharedState.onMapSelectedPlace(selectedPlace);
  }

  private percentageToHsl(
    percentage: number,
    hue0: number,
    hue1: number
  ): string {
    var hue = percentage * (hue1 - hue0) + hue0;
    return 'hsl(' + hue + ', 100%, 50%)';
  }
}
