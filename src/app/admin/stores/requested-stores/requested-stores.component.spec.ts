import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedStoresComponent } from './requested-stores.component';

describe('RequestedStoresComponent', () => {
  let component: RequestedStoresComponent;
  let fixture: ComponentFixture<RequestedStoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedStoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
