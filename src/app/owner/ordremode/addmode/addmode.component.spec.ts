import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmodeComponent } from './addmode.component';

describe('AddmodeComponent', () => {
  let component: AddmodeComponent;
  let fixture: ComponentFixture<AddmodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddmodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
