import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSocietyComponent } from './add-society.component';

describe('AddSocietyComponent', () => {
  let component: AddSocietyComponent;
  let fixture: ComponentFixture<AddSocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSocietyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
