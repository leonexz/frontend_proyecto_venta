import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupA } from './group-a';

describe('GroupA', () => {
  let component: GroupA;
  let fixture: ComponentFixture<GroupA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
