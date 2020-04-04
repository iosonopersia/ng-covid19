import { TestBed } from '@angular/core/testing';

import { SEPASubscriptionsService } from './sepasubscriptions.service';

describe('SEPASubscriptionsService', () => {
  let service: SEPASubscriptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SEPASubscriptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
