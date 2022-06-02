import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDatedevisesComponent } from './add-datedevises.component';

describe('AddDatedevisesComponent', () => {
  let component: AddDatedevisesComponent;
  let fixture: ComponentFixture<AddDatedevisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDatedevisesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDatedevisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
