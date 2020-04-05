import { SEPASubscriptionsService } from '../../services/SEPA/SEPASubscriptions/sepasubscriptions.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  placesNumber: number;

  constructor(private serv: SEPASubscriptionsService) {
    this.placesNumber = 0;
  }

  ngOnInit(): void {
    this.serv.places$.subscribe(value => {
      this.placesNumber = value.size;
    });
    this.serv.subscribe();
  }

  onSelectedPlace(placeID: string): void {
    alert('Selected: ' + placeID);
  }
}
