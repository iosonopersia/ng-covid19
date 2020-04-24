import { SharedStateService } from './../../services/SharedState/shared-state.service';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { properties } from './properties';

@Component({
  selector: 'app-observation-badge',
  templateUrl: './observation-badge.component.html',
  styleUrls: ['./observation-badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservationBadgeComponent implements OnInit {
  @Input() property: string;
  @Input() propertyLabel: string;
  @Input() value: string;

  class: string;

  constructor(
    private sharedState: SharedStateService,
    private cdRef: ChangeDetectorRef
  ) {
    this.class = '';
  }

  ngOnInit(): void {
    this.class = 'btn ' + properties[this.property] + ' observation-badge';
    this.cdRef.markForCheck();
  }

  onClick() {
    this.sharedState.onSelectedProperty({
      propertyURI: this.property,
      propertyLabel: this.propertyLabel,
    });
  }
}
