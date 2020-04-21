import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  links = [
    { title: 'Query', path: 'query' },
    { title: 'Subscribe', path: 'subscribe' },
    { title: 'Help', path: 'help' }
  ];

  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {
  }

}
