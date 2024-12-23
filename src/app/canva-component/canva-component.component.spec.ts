import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvaComponent } from './canva-component.component';

describe('CanvaComponentComponent', () => {
  let component: CanvaComponent;
  let fixture: ComponentFixture<CanvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
