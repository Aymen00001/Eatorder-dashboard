import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGroupeOptionComponent } from './all-groupe-option.component';

describe('AllGroupeOptionComponent', () => {
  let component: AllGroupeOptionComponent;
  let fixture: ComponentFixture<AllGroupeOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllGroupeOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllGroupeOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
