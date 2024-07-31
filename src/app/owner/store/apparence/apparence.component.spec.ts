import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApparenceComponent } from './apparence.component';

describe('ApparenceComponent', () => {
  let component: ApparenceComponent;
  let fixture: ComponentFixture<ApparenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApparenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApparenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
