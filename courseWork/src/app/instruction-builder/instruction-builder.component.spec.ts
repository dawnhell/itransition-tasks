import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionBuilderComponent } from './instruction-builder.component';

describe('InstructionBuilderComponent', () => {
  let component: InstructionBuilderComponent;
  let fixture: ComponentFixture<InstructionBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructionBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
