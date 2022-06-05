import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrixarticleComponent } from './add-prixarticle.component';

describe('AddPrixarticleComponent', () => {
  let component: AddPrixarticleComponent;
  let fixture: ComponentFixture<AddPrixarticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPrixarticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPrixarticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
