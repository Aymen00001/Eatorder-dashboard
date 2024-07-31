import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllordremodeComponent } from './allordremode.component';

describe('AllordremodeComponent', () => {
  let component: AllordremodeComponent;
  let fixture: ComponentFixture<AllordremodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllordremodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllordremodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
