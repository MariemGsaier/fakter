import { TestBed } from '@angular/core/testing';

import { LoginGardGuard } from './login-gard.guard';

describe('LoginGardGuard', () => {
  let guard: LoginGardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoginGardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
