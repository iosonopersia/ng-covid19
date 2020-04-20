import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesTreeComponent } from './places-tree.component';

describe('PlacesTreeComponent', () => {
  let component: PlacesTreeComponent;
  let fixture: ComponentFixture<PlacesTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacesTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
