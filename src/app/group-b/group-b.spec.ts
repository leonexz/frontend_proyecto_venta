import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupB } from './group-b';

describe('GroupB', () => {
  let component: GroupB;
  let fixture: ComponentFixture<GroupB>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupB]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupB);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
