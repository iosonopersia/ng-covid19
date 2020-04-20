import { SEPASubscriptionsService } from '../../services/SEPA/SEPASubscriptions/sepasubscriptions.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  constructor(private sepaSubs: SEPASubscriptionsService) {}

  ngOnInit(): void {
    this.sepaSubs.startSubscriptions();
  }
}