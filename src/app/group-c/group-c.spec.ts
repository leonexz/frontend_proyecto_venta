import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupC } from './group-c';

describe('GroupC', () => {
  let component: GroupC;
  let fixture: ComponentFixture<GroupC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
