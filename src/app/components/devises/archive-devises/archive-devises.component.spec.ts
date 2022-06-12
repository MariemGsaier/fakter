import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveDevisesComponent } from './archive-devises.component';

describe('ArchiveDevisesComponent', () => {
  let component: ArchiveDevisesComponent;
  let fixture: ComponentFixture<ArchiveDevisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveDevisesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveDevisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
