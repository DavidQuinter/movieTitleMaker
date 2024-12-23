import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmDetailsFormComponent } from './film-details-form.component';

describe('FilmDetailsFormComponent', () => {
  let component: FilmDetailsFormComponent;
  let fixture: ComponentFixture<FilmDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmDetailsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
