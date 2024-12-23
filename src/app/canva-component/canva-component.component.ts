import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import * as fabric from 'fabric';
import { CanvasService } from '../canva-service/canva-service.service';
@Component({
  selector: 'app-canva-component',
  imports: [],
  templateUrl: './canva-component.component.html',
  styleUrl: './canva-component.component.css'
})
export class CanvaComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer') containerRef!: ElementRef<HTMLDivElement>;
  private canvas!: fabric.Canvas;
  private readonly aspectRatio = 10/7;

  private getInitialDimensions() {
    let baseWidth;
    if (window.innerWidth > 1440) {
      baseWidth = 600;
      console.log(baseWidth)
    } else if (window.innerWidth <= 1440 && window.innerWidth > 768) {
      baseWidth = 400;
      console.log(baseWidth)
    } else if (window.innerWidth <= 768 && window.innerWidth > 550) {
      baseWidth = 500;
      console.log(baseWidth)
    } else {
      baseWidth = 300;
      console.log(baseWidth)
    }

    const baseHeight = baseWidth * this.aspectRatio;
    return { width: baseWidth, height: baseHeight };
  }

  ngOnInit() {}

  private initCanvas() {
    const dimensions = this.getInitialDimensions();

    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement, {
      backgroundColor: 'white',
      width: dimensions.width,
      height: dimensions.height,
      selection: true
    });

    this.centerCanvas();

    const resizeObserver = new ResizeObserver(() => {
      this.onResize();
    });
    
    if (this.containerRef?.nativeElement) {
      resizeObserver.observe(this.containerRef.nativeElement);
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.canvas) return;

    const dimensions = this.getInitialDimensions();

    this.canvas.setDimensions({
      width: dimensions.width,
      height: dimensions.height
    });

    const objects = this.canvas.getObjects();
    if (objects.length > 0) {
      const oldZoom = this.canvas.getZoom();
      this.canvas.setZoom(oldZoom);
    }

    this.centerCanvas();
    this.canvas.renderAll();
  }

  private centerCanvas() {
    if (!this.canvas) return;
    
    const canvasElement = this.canvas.getElement();
    const canvasWrapper = canvasElement.parentElement as HTMLElement;

    if (canvasWrapper) {
      canvasWrapper.style.position = 'relative';
      canvasWrapper.style.left = '50%';
      canvasWrapper.style.transform = 'translateX(-50%)';
    }
  }

  constructor(private canvasService: CanvasService) {}
  ngOnDestroy() {
    this.canvasService.destroy();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log('Initializing canvas...'); // Debug
      this.initCanvas();
      console.log('Canvas initialized:', this.canvas); // Debug
      this.canvasService.setCanvas(this.canvas);
      console.log('Canvas set in service'); // Debug
    }, 0);
  }

}