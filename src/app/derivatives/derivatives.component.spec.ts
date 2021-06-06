import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivativesComponent } from './derivatives.component';

describe('DerivativesComponent', () => {
  let component: DerivativesComponent;
  let fixture: ComponentFixture<DerivativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DerivativesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
