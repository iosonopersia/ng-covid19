import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-superset',
  templateUrl: './superset.component.html',
  styleUrls: ['./superset.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupersetComponent {
  dashboardName: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.activatedRoute.data.subscribe((data) => {
      const dataObj = data as {
        dashboardName: string;
      };
      this.dashboardName = dataObj.dashboardName;
      this.changeDetectorRef.markForCheck();
    });
  }
}
