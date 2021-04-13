import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnPubComponent } from './own-pub.component';

describe('OwnPubComponent', () => {
  let component: OwnPubComponent;
  let fixture: ComponentFixture<OwnPubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnPubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnPubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
