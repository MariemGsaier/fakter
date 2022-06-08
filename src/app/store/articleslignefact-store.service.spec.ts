import { TestBed } from '@angular/core/testing';

import { ArticleslignefactStoreService } from './articleslignefact-store.service';

describe('ArticleslignefactStoreService', () => {
  let service: ArticleslignefactStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleslignefactStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
