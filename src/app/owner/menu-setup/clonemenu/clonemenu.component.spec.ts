import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClonemenuComponent } from './clonemenu.component';

describe('ClonemenuComponent', () => {
  let component: ClonemenuComponent;
  let fixture: ComponentFixture<ClonemenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClonemenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClonemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
