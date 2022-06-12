import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveUsersComponent } from './archive-users.component';

describe('ArchiveUsersComponent', () => {
  let component: ArchiveUsersComponent;
  let fixture: ComponentFixture<ArchiveUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
