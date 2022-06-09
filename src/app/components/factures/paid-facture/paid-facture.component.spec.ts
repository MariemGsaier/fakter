import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidFactureComponent } from './paid-facture.component';

describe('PaidFactureComponent', () => {
  let component: PaidFactureComponent;
  let fixture: ComponentFixture<PaidFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaidFactureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
