import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelTreeComponent } from './level-tree.component';

describe('LevelTreeComponent', () => {
  let component: LevelTreeComponent;
  let fixture: ComponentFixture<LevelTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
