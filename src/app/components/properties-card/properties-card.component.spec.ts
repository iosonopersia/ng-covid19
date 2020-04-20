import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesCardComponent } from './properties-card.component';

describe('PropertiesCardComponent', () => {
  let component: PropertiesCardComponent;
  let fixture: ComponentFixture<PropertiesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertiesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
