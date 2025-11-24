import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LendAlert } from './lend-alert';

describe('LendAlert', () => {
  let component: LendAlert;
  let fixture: ComponentFixture<LendAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LendAlert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LendAlert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
