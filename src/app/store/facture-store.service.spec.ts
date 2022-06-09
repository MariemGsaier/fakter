import { TestBed } from '@angular/core/testing';

import { FactureStoreService } from './facture-store.service';

describe('FactureStoreService', () => {
  let service: FactureStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactureStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
