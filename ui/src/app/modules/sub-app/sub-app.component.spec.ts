import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAppComponent } from './sub-app.component';

describe('SubAppComponent', () => {
  let component: SubAppComponent;
  let fixture: ComponentFixture<SubAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
