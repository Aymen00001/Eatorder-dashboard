import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreComparativeComponent } from './store-comparative.component';

describe('StoreComparativeComponent', () => {
  let component: StoreComparativeComponent;
  let fixture: ComponentFixture<StoreComparativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreComparativeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreComparativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
