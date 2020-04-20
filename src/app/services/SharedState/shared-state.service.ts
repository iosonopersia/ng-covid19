import { BehaviorSubject, Observable } from 'rxjs';
import { IPlaceNode, IProperty } from './../SEPA/queryResults.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedStateService {
  mapSelectedPlace$: Observable<IPlaceNode>;
  private MAP_SELECTED_PLACE: BehaviorSubject<IPlaceNode>;

  treeSelectedPlace$: Observable<IPlaceNode>;
  private TREE_SELECTED_PLACE: BehaviorSubject<IPlaceNode>;

  selectedProperty$: Observable<IProperty>;
  private SELECTED_PROPERTY: BehaviorSubject<IProperty>;

  constructor() {
    const italy: IPlaceNode = {
      placeURI: 'http://covid19/context/country/ITA',
      placeLabel: 'Italy'
    };

    const casiTotali: IProperty = {
      propertyURI: 'http://covid19#TotalCases',
      propertyLabel: 'Casi totali'
    };

    this.MAP_SELECTED_PLACE = new BehaviorSubject<IPlaceNode>(italy);
    this.mapSelectedPlace$ = this.MAP_SELECTED_PLACE.asObservable();

    this.TREE_SELECTED_PLACE = new BehaviorSubject<IPlaceNode>(italy);
    this.treeSelectedPlace$ = this.TREE_SELECTED_PLACE.asObservable();

    this.SELECTED_PROPERTY = new BehaviorSubject<IProperty>(casiTotali);
    this.selectedProperty$ = this.SELECTED_PROPERTY.asObservable();
  }

  onMapSelectedPlace(place: IPlaceNode) {
    this.MAP_SELECTED_PLACE.next(place);
  }

  onTreeSelectedPlace(place: IPlaceNode) {
    this.TREE_SELECTED_PLACE.next(place);
  }

  onSelectedProperty(property: IProperty) {
    this.SELECTED_PROPERTY.next(property);
  }
}
