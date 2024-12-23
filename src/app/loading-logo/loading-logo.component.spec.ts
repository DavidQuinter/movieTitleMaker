import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingLogoComponent } from './loading-logo.component';

describe('LoadingLogoComponent', () => {
  let component: LoadingLogoComponent;
  let fixture: ComponentFixture<LoadingLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
