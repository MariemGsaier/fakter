import { TestBed } from '@angular/core/testing';

import { DeviseStoreService } from './devise-store.service';

describe('DeviseStoreService', () => {
  let service: DeviseStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviseStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
