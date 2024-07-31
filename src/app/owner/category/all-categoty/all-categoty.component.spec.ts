import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCategotyComponent } from './all-categoty.component';

describe('AllCategotyComponent', () => {
  let component: AllCategotyComponent;
  let fixture: ComponentFixture<AllCategotyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCategotyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCategotyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
