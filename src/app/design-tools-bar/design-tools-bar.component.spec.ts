import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignToolsBarComponent } from './design-tools-bar.component';

describe('DesignToolsBarComponent', () => {
  let component: DesignToolsBarComponent;
  let fixture: ComponentFixture<DesignToolsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignToolsBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignToolsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
