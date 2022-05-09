import { TestBed } from '@angular/core/testing';

import { BankaccountService } from './bankaccount.service';

describe('BankaccountService', () => {
  let service: BankaccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankaccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
