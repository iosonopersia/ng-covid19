import { SEPASubscriptionsService } from '../../services/SEPA/SEPASubscriptions/sepasubscriptions.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit {
  constructor(private sepaSubs: SEPASubscriptionsService) {}

  ngOnInit(): void {
    this.sepaSubs.startSubscriptions();
  }
}
