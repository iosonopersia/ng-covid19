import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  tabs = [
    { name: 'Query', url: '/dashboard/query' },
    { name: 'Subscribe', url: '/dashboard/subscribe' },
    { name: 'Help', url: '/dashboard/help' }
  ];
  activeTabUrl: string;
  private subscriptions: Subscription;

  constructor(public router: Router) {
    this.activeTabUrl = this.router.url;
    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.activeTabUrl = event.urlAfterRedirects;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
