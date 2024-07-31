import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllpromoComponent } from './allpromo.component';

describe('AllpromoComponent', () => {
  let component: AllpromoComponent;
  let fixture: ComponentFixture<AllpromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllpromoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllpromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
