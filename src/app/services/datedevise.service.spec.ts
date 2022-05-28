import { TestBed } from '@angular/core/testing';

import { DatedeviseService } from './datedevise.service';

describe('DatedeviseService', () => {
  let service: DatedeviseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatedeviseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
