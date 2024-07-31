import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsGroupsComponent } from './options-groups.component';

describe('OptionsGroupsComponent', () => {
  let component: OptionsGroupsComponent;
  let fixture: ComponentFixture<OptionsGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionsGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
