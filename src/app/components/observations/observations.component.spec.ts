import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationsComponent } from './observations.component';

describe('ObservationsComponent', () => {
  let component: ObservationsComponent;
  let fixture: ComponentFixture<ObservationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
