import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticcompanyComponent } from './statisticcompany.component';

describe('StatisticcompanyComponent', () => {
  let component: StatisticcompanyComponent;
  let fixture: ComponentFixture<StatisticcompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticcompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticcompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
