import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-observations',
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObservationsComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}
}
