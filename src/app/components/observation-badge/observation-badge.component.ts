import { SharedStateService } from './../../services/SharedState/shared-state.service';
import { Component, OnInit, Input } from '@angular/core';
import { properties } from './properties';

@Component({
  selector: 'app-observation-badge',
  templateUrl: './observation-badge.component.html',
  styleUrls: ['./observation-badge.component.css']
})
export class ObservationBadgeComponent implements OnInit {
  @Input() property: string;
  @Input() propertyLabel: string;
  @Input() value: string;

  class: string;

  constructor(private sharedState: SharedStateService) {
    this.class = '';
  }

  ngOnInit(): void {
    this.class = 'btn ' + properties[this.property] + ' observation-badge';
  }

  onClick() {
    this.sharedState.onSelectedProperty({
      propertyURI: this.property,
      propertyLabel: this.propertyLabel
    });
  }
}
