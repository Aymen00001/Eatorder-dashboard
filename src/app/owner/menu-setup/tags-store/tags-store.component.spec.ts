import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsStoreComponent } from './tags-store.component';

describe('TagsStoreComponent', () => {
  let component: TagsStoreComponent;
  let fixture: ComponentFixture<TagsStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagsStoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
