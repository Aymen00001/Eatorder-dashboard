import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOwnersComponent } from './add-owners.component';

describe('AddOwnersComponent', () => {
  let component: AddOwnersComponent;
  let fixture: ComponentFixture<AddOwnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOwnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
