import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupeOptionComponent } from './add-groupe-option.component';

describe('AddGroupeOptionComponent', () => {
  let component: AddGroupeOptionComponent;
  let fixture: ComponentFixture<AddGroupeOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGroupeOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroupeOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
