import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridEditorModalComponent } from './grid-editor-modal.component';

describe('GridEditorModalComponent', () => {
  let component: GridEditorModalComponent;
  let fixture: ComponentFixture<GridEditorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridEditorModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
