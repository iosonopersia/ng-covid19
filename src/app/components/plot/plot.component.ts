import { SharedStateService } from './../../services/SharedState/shared-state.service';
import { IPlaceNode, IProperty } from './../../services/SEPA/queryResults.model';
import { SEPAQueriesService } from './../../services/SEPA/SEPAQueries/sepaqueries.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PlotComponent implements OnInit, OnDestroy {
  data: any;
  layout: any;
  config: any;

  private subscriptions: Subscription;
  private place: IPlaceNode;
  private property: IProperty;

  constructor(
    private sepaQueries: SEPAQueriesService,
    private sharedState: SharedStateService
  ) {
    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    this.sepaQueries.queryHistory(
      'http://covid19/context/country/ITA',
      'http://covid19#TotalCases'
    );

    this.updatePlot([], [] , 'Loading...');

    this.subscriptions = this.sharedState.treeSelectedPlace$.subscribe(
      place => {
        this.place = place;
        this.checkPlot();
      }
    );

    this.subscriptions = this.sharedState.selectedProperty$.subscribe(
      property => {
        this.property = property;
        this.checkPlot();
      }
    );

    this.subscriptions = this.sepaQueries.history$.subscribe(history => {
      const x: Date[] = [];
      const y: number[] = [];
      for (const historyPoint of history) {
        x.push(new Date(historyPoint.timestamp.value));
        y.push(parseInt(historyPoint.value.value, 10));
      }

      const title = this.place.placeLabel + ' - ' + this.property.propertyLabel;
      this.updatePlot(x, y, title);
    });
  }

  private updatePlot(x: Date[], y: number[], title: string) {
    this.data = [
      {
        x,
        y,
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'blue' }
      }
    ];
    this.layout = {
      autosize: true,
      title,
      margin: {
        l: 50,
        r: 10,
        b: 30,
        t: 30
      }
    };
    this.config = {
      responsive: true
    };
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private checkPlot() {
    if (!this.place || !this.property) {
      return;
    }

    this.sepaQueries.queryHistory(this.place.placeURI, this.property.propertyURI);
  }
}
