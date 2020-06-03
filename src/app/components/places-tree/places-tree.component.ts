import { SharedStateService } from './../../services/SharedState/shared-state.service';
import { SEPAQueriesService } from './../../services/SEPA/SEPAQueries/sepaqueries.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlacesTreeComponent implements OnInit, OnDestroy {
  private placesTree: IPlaceTree;
  shownTree: IPlaceTree;
  selectedPlace: IPlaceNode;
  private rootPlace: IPlaceNode;
  private subscriptions: Subscription;
  isLoading: boolean;

  constructor(
    private sepaQueries: SEPAQueriesService,
    private sharedState: SharedStateService,
    private cdRef: ChangeDetectorRef
  ) {
    this.subscriptions = new Subscription();
    this.isLoading = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    const italy: IPlaceNode = {
      placeURI: 'http://covid19/context/country/ITA',
      placeLabel: 'Italia'
    };
    this.sepaQueries.queryPlaceTree(italy);

    this.subscriptions.add(
      this.sepaQueries.placeTree$.subscribe((tree) => {
        this.placesTree = tree;
        this.checkPlaceTree();
        this.cdRef.markForCheck();
      })
    );
    this.subscriptions.add(
      this.sharedState.mapSelectedPlace$.subscribe((selectedPlace) => {
        this.rootPlace = selectedPlace;
        this.checkPlaceTree();
        this.cdRef.markForCheck();
      })
    );
    this.subscriptions.add(
      this.sharedState.treeSelectedPlace$.subscribe((selectedPlace) => {
        this.selectedPlace = selectedPlace;
        this.cdRef.markForCheck();
      })
    );
  }

  private checkPlaceTree() {
    if (!this.placesTree || !this.rootPlace) {
      return;
    }

    if (this.placesTree.node.placeURI === this.rootPlace.placeURI) {
      this.shownTree = this.placesTree;
    } else {
      // The new root place is not the root node of this.placesTree.
      // We must search among its first level children.
      this.shownTree = this.placesTree.children.find((child) => {
        return child.node.placeURI === this.rootPlace.placeURI;
      });
      if (!this.shownTree) {
        throw new Error(
          'Selected place from map is not a region nor a country'
        );
      }
    }
    if (this.selectedPlace?.placeURI !== this.shownTree.node.placeURI) {
      // Remember to change selection to the new root place:
      this.sharedState.onTreeSelectedPlace(this.shownTree.node);
    }

    this.isLoading = false;
  }

  onSelectedPlace(selectedPlace: IPlaceNode) {
    this.sharedState.onTreeSelectedPlace(selectedPlace);
  }
}
