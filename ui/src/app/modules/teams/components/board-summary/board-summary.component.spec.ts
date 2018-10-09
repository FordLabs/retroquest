import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardSummaryComponent } from './board-summary.component';

describe('BoardSummaryComponent', () => {
  let component: BoardSummaryComponent;
  let fixture: ComponentFixture<BoardSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
