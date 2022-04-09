import { TestBed } from '@angular/core/testing';

import { GestUserService } from './gest-user.service';

describe('GestUserService', () => {
  let service: GestUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
