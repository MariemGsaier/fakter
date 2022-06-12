import { TestBed } from '@angular/core/testing';

import { PaidfactureStoreService } from './paidfacture-store.service';

describe('PaidfactureStoreService', () => {
  let service: PaidfactureStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaidfactureStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
