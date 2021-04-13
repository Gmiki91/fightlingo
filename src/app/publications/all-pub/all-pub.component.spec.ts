import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPubComponent } from './all-pub.component';

describe('AllPubComponent', () => {
  let component: AllPubComponent;
  let fixture: ComponentFixture<AllPubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
