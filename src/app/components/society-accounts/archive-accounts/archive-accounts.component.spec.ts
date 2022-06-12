import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveAccountsComponent } from './archive-accounts.component';

describe('ArchiveAccountsComponent', () => {
  let component: ArchiveAccountsComponent;
  let fixture: ComponentFixture<ArchiveAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
