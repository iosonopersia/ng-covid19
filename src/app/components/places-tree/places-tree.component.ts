import { SharedStateService } from './../../services/SharedState/shared-state.service';
import { SEPAQueriesService } from './../../services/SEPA/SEPAQueries/sepaqueries.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import {
  IPlaceNode,
  IPlaceTree
} from 'src/app/services/SEPA/queryResults.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-places-tree',
  templateUrl: './places-tree.component.html',
  styleUrls: ['./places-tree.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PlacesTreeComponent implements OnInit, OnDestroy {
  private placesTree: IPlaceTree;
  shownTree: IPlaceTree;
  selectedURI: string;
  private subscriptions: Subscription;

  constructor(
    private sepaQueries: SEPAQueriesService,
    private sharedState: SharedStateService
  ) {
    this.subscriptions = new Subscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    const italy: IPlaceNode = {
      placeURI: 'http://covid19/context/country/ITA',
      placeLabel: 'Italy'
    };
    this.sepaQueries.queryPlaceTree(italy);
    this.sepaQueries.placeTree$.subscribe(tree => {
      this.placesTree = tree;
      this.shownTree = this.placesTree;
      this.selectedURI = tree.node.placeURI;
      // Subscribe to mapSelectedPlace$ only when we
      // already obtained the place tree:
      this.subscriptions = this.sharedState.mapSelectedPlace$.subscribe(
        selectedPlace => this.onNewRootPlace(selectedPlace)
      );
    });
    this.subscriptions = this.sharedState.treeSelectedPlace$.subscribe(
      selectedPlace => {
        this.selectedURI = selectedPlace.placeURI;
      }
    );
  }

  private onNewRootPlace(newRoot: IPlaceNode) {
    if (this.placesTree.node.placeURI === newRoot.placeURI) {
      this.shownTree = this.placesTree;
    } else {
      // The new root place is not the root node of this.placesTree.
      // We must search among its first level children.
      this.shownTree = this.placesTree.children.find(child => {
        return child.node.placeURI === newRoot.placeURI;
      });
      if (!this.shownTree) {
        throw new Error(
          'Selected place from map is not a region nor a country'
        );
      }
    }
    this.selectedURI = this.shownTree.node.placeURI; // Remember to change selection to the new root place
    // this.sharedState.onTreeSelectedPlace(this.shownTree.node);
  }

  onSelectedURI(selectedPlace: IPlaceNode) {
    this.sharedState.onTreeSelectedPlace(selectedPlace);
  }
}
