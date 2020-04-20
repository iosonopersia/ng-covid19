import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationBadgeComponent } from './observation-badge.component';

describe('ObservationBadgeComponent', () => {
  let component: ObservationBadgeComponent;
  let fixture: ComponentFixture<ObservationBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
