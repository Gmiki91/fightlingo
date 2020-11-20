import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmDojoComponent } from './gm-dojo.component';

describe('GmDojoComponent', () => {
  let component: GmDojoComponent;
  let fixture: ComponentFixture<GmDojoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmDojoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmDojoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
