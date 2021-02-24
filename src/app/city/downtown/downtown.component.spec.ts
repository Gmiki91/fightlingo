import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowntownComponent } from './downtown.component';

describe('DowntownComponent', () => {
  let component: DowntownComponent;
  let fixture: ComponentFixture<DowntownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DowntownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DowntownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
