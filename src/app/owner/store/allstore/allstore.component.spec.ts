import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllstoreComponent } from './allstore.component';

describe('AllstoreComponent', () => {
  let component: AllstoreComponent;
  let fixture: ComponentFixture<AllstoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllstoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
