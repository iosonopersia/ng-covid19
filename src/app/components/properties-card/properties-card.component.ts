import { IPlaceNode } from './../../services/SEPA/queryResults.model';
import { SharedStateService } from './../../services/SharedState/shared-state.service';
import { SEPASubscriptionsService } from './../../services/SEPA/SEPASubscriptions/sepasubscriptions.service';
import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IObservation } from 'src/app/services/SEPA/queryResults.model';
import { List } from 'immutable';

@Component({
  selector: 'app-properties-card',
  templateUrl: './properties-card.component.html',
  styleUrls: ['./properties-card.component.css']
})
export class PropertiesCardComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() sourceLabel: string;
  @Input() sourceURL: string;
  timestamp: string;
  private selectedPlace: IPlaceNode;

  private map: Map<string, List<IObservation>>;
  observations: List<IObservation>;
  private subscriptions: Subscription;

  constructor(
    private sepaSubs: SEPASubscriptionsService,
    private sharedState: SharedStateService
  ) {
    this.observations = List<IObservation>(); // Empty list
    this.timestamp = '';
    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    this.subscriptions = this.sharedState.treeSelectedPlace$.subscribe(selectedPlace =>
      this.onSelectedPlace(selectedPlace)
    );
    switch (this.title) {
      case 'COVID-19': {
        this.subscriptions = this.sepaSubs.covid19Observations$.subscribe(
          map => {
            this.map = map;
            this.observations = this.map.get(this.selectedPlace.placeURI);
            if (this.observations) {
              const timestampString: string = this.observations.first<
                IObservation
              >().timestamp.value;
              this.timestamp = new Date(timestampString).toLocaleString();
            }
          }
        );
        break;
      }
      case 'Popolazione': {
        this.subscriptions = this.sepaSubs.istatObservations$.subscribe(map => {
          this.map = map;
          this.observations = this.map.get(this.selectedPlace.placeURI);
          if (this.observations) {
            const timestampString: string = this.observations.first<
              IObservation
            >().timestamp.value;
            this.timestamp = new Date(timestampString).toLocaleDateString();
          }
        });
        break;
      }
    }
  }

  onSelectedPlace(selectedPlace: IPlaceNode) {
    this.selectedPlace = selectedPlace;
    this.observations = this.map
      ? this.map.get(selectedPlace.placeURI)
      : List<IObservation>();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
