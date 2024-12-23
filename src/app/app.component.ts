import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilmDetailsFormComponent } from './film-details-form/film-details-form.component';
import { DesignToolsBarComponent } from './design-tools-bar/design-tools-bar.component';
import { FormsModule } from '@angular/forms';
import { CanvasService } from './canva-service/canva-service.service';
import { CanvaComponent } from './canva-component/canva-component.component';
import { LoadingLogoComponent } from './loading-logo/loading-logo.component';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoadingService } from './loading.service';
import { ElementRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FilmDetailsFormComponent,
    FormsModule,
    DesignToolsBarComponent,
    CanvaComponent,
    LoadingLogoComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  showForm = true;
  private destroy$ = new Subject<void>();

  constructor(
    private canvasService: CanvasService,
    public loadingService: LoadingService,
    private elementRef: ElementRef
  ) {
    this.canvasService.formVisibility$
      .pipe(takeUntil(this.destroy$))
      .subscribe(visible => {
        if (!visible) {
          const form = this.elementRef.nativeElement.querySelector('.form-container');
          form.classList.add('fade-panel');
          setTimeout(() => this.showForm = false, 500);
        } else {
          this.showForm = true;
        }
      });
  }

  ngOnInit() {

    this.loadingService.show();
    this.elementRef.nativeElement.classList.add('fade-out');

    setTimeout(() => {
      this.loadingService.hide();
    }, 2000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}