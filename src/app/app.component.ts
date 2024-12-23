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
})
export class AppComponent implements OnInit, OnDestroy {
  showForm = true; 
  private destroy$ = new Subject<void>();

  constructor(
    private canvasService: CanvasService,
    public loadingService: LoadingService
  ) {
    this.canvasService.formVisibility$
      .pipe(takeUntil(this.destroy$))
      .subscribe(visible => {
        this.showForm = visible;
      });
  }

  ngOnInit() {
    // Mostrar loading al iniciar
    this.loadingService.show();

    // Simular tiempo de carga de la aplicación
    setTimeout(() => {
      this.loadingService.hide();
    }, 2000); // Ocultar después de 2 segundos
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}