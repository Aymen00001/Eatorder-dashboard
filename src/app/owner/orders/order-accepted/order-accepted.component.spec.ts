import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAcceptedComponent } from './order-accepted.component';

describe('OrderAcceptedComponent', () => {
  let component: OrderAcceptedComponent;
  let fixture: ComponentFixture<OrderAcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderAcceptedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
