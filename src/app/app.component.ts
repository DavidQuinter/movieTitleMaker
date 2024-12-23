import { Component } from '@angular/core';
import { FilmDetailsFormComponent } from './film-details-form/film-details-form.component';
import { DesignToolsBarComponent } from './design-tools-bar/design-tools-bar.component';
import { FormsModule } from '@angular/forms';
import { CanvasService } from './canva-service/canva-service.service';
import { CanvaComponent } from './canva-component/canva-component.component';
import { LoadingLogoComponent } from './loading-logo/loading-logo.component';

@Component({
  selector: 'app-root',
  imports: [ FilmDetailsFormComponent, FormsModule, DesignToolsBarComponent, CanvaComponent, LoadingLogoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers : [CanvasService]
})
export class AppComponent {

}
