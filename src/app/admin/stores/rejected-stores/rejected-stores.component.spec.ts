import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedStoresComponent } from './rejected-stores.component';

describe('RejectedStoresComponent', () => {
  let component: RejectedStoresComponent;
  let fixture: ComponentFixture<RejectedStoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedStoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
