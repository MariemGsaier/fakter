import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueArticlesComponent } from './historique-articles.component';

describe('HistoriqueArticlesComponent', () => {
  let component: HistoriqueArticlesComponent;
  let fixture: ComponentFixture<HistoriqueArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueArticlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
