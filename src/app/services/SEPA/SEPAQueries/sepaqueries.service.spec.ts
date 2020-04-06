import { TestBed } from '@angular/core/testing';

import { SEPAQueriesService } from './sepaqueries.service';

describe('SEPAQueriesService', () => {
  let service: SEPAQueriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SEPAQueriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
