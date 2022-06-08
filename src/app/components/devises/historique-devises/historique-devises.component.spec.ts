import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueDevisesComponent } from './historique-devises.component';

describe('HistoriqueDevisesComponent', () => {
  let component: HistoriqueDevisesComponent;
  let fixture: ComponentFixture<HistoriqueDevisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueDevisesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueDevisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
