import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeForgotpwComponent } from './change-forgotpw.component';

describe('ChangeForgotpwComponent', () => {
  let component: ChangeForgotpwComponent;
  let fixture: ComponentFixture<ChangeForgotpwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeForgotpwComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeForgotpwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
