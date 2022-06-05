import { TestBed } from '@angular/core/testing';

import { PrixarticleService } from './prixarticle.service';

describe('PrixarticleService', () => {
  let service: PrixarticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrixarticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
