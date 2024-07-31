import { TestBed } from '@angular/core/testing';

import { StatisticcompanyService } from './statisticcompany.service';

describe('StatisticcompanyService', () => {
  let service: StatisticcompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticcompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
