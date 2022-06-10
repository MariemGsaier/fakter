import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveFactureComponent } from './archive-facture.component';

describe('ArchiveFactureComponent', () => {
  let component: ArchiveFactureComponent;
  let fixture: ComponentFixture<ArchiveFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveFactureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
