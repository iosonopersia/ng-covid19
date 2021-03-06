import { IPlaceNode } from './../../services/SEPA/queryResults.model';
import { SharedStateService } from './../../services/SharedState/shared-state.service';
import { SEPASubscriptionsService } from './../../services/SEPA/SEPASubscriptions/sepasubscriptions.service';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { IObservation } from 'src/app/services/SEPA/queryResults.model';
import { List } from 'immutable';

@Component({
  selector: 'app-properties-card',
  templateUrl: './properties-card.component.html',
  styleUrls: ['./properties-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesCardComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() sourceLabel: string;
  @Input() sourceURL: string;
  @Input() observable: Observable<Map<string, List<IObservation>>>;

  timestamp: string;
  private selectedPlace: IPlaceNode;

  private map: Map<string, List<IObservation>>;
  observations: List<IObservation>;
  private subscriptions: Subscription;
  isLoading: boolean;
  receivedData: number;

  constructor(
    private sepaSubs: SEPASubscriptionsService,
    private sharedState: SharedStateService,
    private cdRef: ChangeDetectorRef
  ) {
    this.observations = List<IObservation>(); // Empty list
    this.timestamp = '';
    this.isLoading = true;
    this.receivedData = 0;
    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.sharedState.treeSelectedPlace$.subscribe((selectedPlace) => {
        this.selectedPlace = selectedPlace;
        this.checkPropertiesCard();
        this.cdRef.markForCheck();
      })
    );
   
    this.subscriptions.add(
      this.observable.subscribe((map) => {
        this.map = map;
        this.receivedData++;
        this.checkPropertiesCard();
        this.cdRef.markForCheck();
      })
    );
     
  }

  private checkPropertiesCard() {
    if (!this.selectedPlace || !this.map) {
      return;
    }

    this.observations = this.map.get(this.selectedPlace.placeURI);
    if (this.observations) {
      const timestampString: string = this.observations.first<IObservation>()
        .timestamp.value;
      this.timestamp = new Date(timestampString).toLocaleString();
    }
    if (this.observations || this.receivedData > 1) {
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
