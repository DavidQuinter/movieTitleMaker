import { Injectable } from '@angular/core';
import * as fabric from 'fabric';
import { BehaviorSubject } from 'rxjs';
import { Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CanvasService {

  private canvas: fabric.Canvas | null = null;
  private canvasSubject = new BehaviorSubject<fabric.Canvas | null>(null);
  canvas$ = this.canvasSubject.asObservable();

  public categories = {
    movieTitle: {
      fontFamily: 'Arial',
      fontSize: 50,
      fontWeight: 'bold',
      fill: '#000',
      left: 100,
      top: 0
    },
    director: {
      fontFamily: 'Arial',
      fontSize: 22,
      fontWeight: 'bold',
      fill: '#000',
      left: 100,
      top: 100,
    },
    producer: {
      fontFamily: 'Arial',
      fontSize: 22,
      fontWeight: 'bold',
      fill: '#000',
      left: 100,
      top: 100,
    },
    musiComposer: {
      fontFamily: 'Arial',
      fontSize: 22,
      fontWeight: 'bold',
      fill: '#000',
      left: 100,
      top: 100,
    },
    casting: {
      fontFamily: 'Arial',
      fontSize: 22,
      fontWeight: 'bold',
      fill: '#000',
      left: 100,
      top: 100,
    },
    releaseDate: {
      fontFamily: 'Arial',
      fontSize: 22,
      fontWeight: 'bold',
      fill: '#000',
      left: 100,
      top: 100,
    },
  };


  constructor() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {

    if (event.key === 'Delete' || event.key === 'Backspace') {

      const activeElement = document.activeElement?.tagName.toLowerCase();
      if (activeElement !== 'input' && activeElement !== 'textarea') {
        this.deleteSelected();
      }
    }
  }

  public destroy() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  setCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.canvasSubject.next(canvas);
  }



  // text.on('scaling', (event) => {
  //   const activeObject = event.target;
  //   if (activeObject) {
  //     // Maintain original height while allowing width changes
  //     activeObject.set({
  //       scaleY: 1,
  //       fontSize: categoryStyle.fontSize,
  //       width: activeObject.width! * activeObject.scaleX!
  //     });
  //   }
  // });


  addText(category: string, inputText: string) {
    if (!this.canvas) return;

    const categoryStyle = (this.categories as any)[category];
    if (!categoryStyle) {
      console.warn('Category not found:', category);
      return;
    }

    const text = new fabric.IText(inputText || 'Text', {
      ...categoryStyle,
      lockScalingY: true,
      scaleY: 1,
      width: 200,
      breakWords: true,
      textAlign: 'left',
      splitByGrapheme: false,
    });

    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    this.canvas.renderAll();
  }



  async addPoster(url: string): Promise<void> {
    if (!this.canvas) return;

    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(url, {
        crossOrigin: 'anonymous'
      })
        .then((img: fabric.Image) => {
          if (!img) {
            reject(new Error('Failed to load poster image'));
            return;
          }


          const canvasWidth = this.canvas!.width!;
          const canvasHeight = this.canvas!.height!;

          const scaleX = canvasWidth / img.width!;
          const scaleY = canvasHeight / img.height!;
          const scale = Math.max(scaleX, scaleY);

          img.set({
            scaleX: scale,
            scaleY: scale,
            left: 0,
            top: 0,
            selectable: false,
            hasControls: false,
            lockMovementX: true,
            lockMovementY: true,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true
          });
          this.canvas!.clear();
          this.canvas!.add(img);
          const centerX = (canvasWidth - (img.width! * scale)) / 2;
          const centerY = (canvasHeight - (img.height! * scale)) / 2;
          img.set({
            left: centerX,
            top: centerY
          });

          this.canvas!.renderAll();
          resolve();
        })
        .catch(error => {
          reject(new Error('Error loading poster image: ' + error));
        });
    });
  }




  async addImage(url?: string) {
    if (!this.canvas) return;

    try {
      if (!url) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = (e: any) => {
          const file = e.target.files[0];
          const reader = new FileReader();

          reader.onload = (event: any) => {
            fabric.Image.fromURL(event.target.result, {
              crossOrigin: 'anonymous'
            }).then((img) => {
              const maxSize = 300;
              if (img.width && img.width > maxSize) {
                const ratio = maxSize / img.width;
                img.scale(ratio);
              }

              this.canvas?.add(img);
              this.canvas?.renderAll();
            });
          };

          reader.readAsDataURL(file);
        };

        input.click();
      } else {
        const img = await fabric.Image.fromURL(url, {
          crossOrigin: 'anonymous'
        });
        this.canvas.add(img);
        this.canvas.renderAll();
      }
    } catch (error) {
      console.error('Error adding image:', error);
    }
  }


  private getActiveObject(): fabric.Object | null | undefined {
    return this.canvas?.getActiveObject();
  }

  changeFontFamily(fontFamily: string) {
    const activeObject = this.getActiveObject();
    if (activeObject && 'fontFamily' in activeObject) {
      (activeObject as fabric.IText).set('fontFamily', fontFamily);
      this.canvas?.renderAll();
    }
  }

  changeFontSize(size: number) {
    const activeObject = this.getActiveObject();
    if (activeObject && 'fontSize' in activeObject) {
      (activeObject as fabric.IText).set('fontSize', size);
      this.canvas?.renderAll();
    }
  }

  changeTextColor(color: string) {
    const activeObject = this.getActiveObject();
    if (activeObject && 'fill' in activeObject) {
      (activeObject as fabric.IText).set('fill', color);
      this.canvas?.renderAll();
    }
  }

  toggleBold() {
    const activeObject = this.getActiveObject();
    if (activeObject && 'fontWeight' in activeObject) {
      const currentWeight = (activeObject as fabric.IText).get('fontWeight');
      (activeObject as fabric.IText).set('fontWeight', currentWeight === 'bold' ? 'normal' : 'bold');
      this.canvas?.renderAll();
    }
  }

  toggleItalic() {
    const activeObject = this.getActiveObject();
    if (activeObject && 'fontStyle' in activeObject) {
      const currentStyle = (activeObject as fabric.IText).get('fontStyle');
      (activeObject as fabric.IText).set('fontStyle', currentStyle === 'italic' ? 'normal' : 'italic');
      this.canvas?.renderAll();
    }
  }

  toggleUnderline() {
    const activeObject = this.getActiveObject();
    if (activeObject && 'underline' in activeObject) {
      const currentUnderline = (activeObject as fabric.IText).get('underline');
      (activeObject as fabric.IText).set('underline', !currentUnderline);
      this.canvas?.renderAll();
    }
  }

  setTextAlign(align: 'left' | 'center' | 'right') {
    const activeObject = this.getActiveObject();
    if (activeObject && 'textAlign' in activeObject) {
      (activeObject as fabric.IText).set('textAlign', align);
      this.canvas?.renderAll();
    }
  }

  alignHorizontal(position: 'left' | 'center' | 'right') {
    if (!this.canvas || !this.getActiveObject()) return;

    const object = this.getActiveObject()!;
    const canvasWidth = this.canvas.width!;

    switch (position) {
      case 'left':
        object.set('left', 0);
        break;
      case 'center':
        const centerX = (canvasWidth - object.getScaledWidth()) / 2;
        object.set('left', centerX);
        break;
      case 'right':
        object.set('left', canvasWidth - object.getScaledWidth());
        break;
    }

    this.canvas.renderAll();
  }

  alignVertical(position: 'top' | 'middle' | 'bottom') {
    if (!this.canvas || !this.getActiveObject()) return;

    const object = this.getActiveObject()!;
    const canvasHeight = this.canvas.height!;

    switch (position) {
      case 'top':
        object.set('top', 0);
        break;
      case 'middle':
        const centerY = (canvasHeight - object.getScaledHeight()) / 2;
        object.set('top', centerY);
        break;
      case 'bottom':
        object.set('top', canvasHeight - object.getScaledHeight());
        break;
    }

    this.canvas.renderAll();
  }

  rotate(degrees: number) {
    const activeObject = this.getActiveObject();
    if (activeObject) {
      const currentAngle = activeObject.angle || 0;
      activeObject.rotate(currentAngle + degrees);
      this.canvas?.renderAll();
    }
  }

  flip(direction: 'horizontal' | 'vertical' = 'horizontal') {
    const activeObject = this.getActiveObject();
    if (activeObject) {
      if (direction === 'horizontal') {
        activeObject.set('flipX', !activeObject.flipX);
      } else {
        activeObject.set('flipY', !activeObject.flipY);
      }
      this.canvas?.renderAll();
    }
  }


  deleteSelected() {
    if (!this.canvas) return;
    const activeObjects = this.canvas.getActiveObjects();
    this.canvas.remove(...activeObjects);
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  exportCanvas(format: 'png' | 'jpeg') {
    if (!this.canvas) return;

    let dataURL: string;

    // Configurar opciones de exportación
    const options = {
      format: format,
      quality: 1.0,
      multiplier: 2
    };

    try {
      if (format === 'jpeg') {
        dataURL = this.canvas.toDataURL({
          ...options,

        });
      } else {
        dataURL = this.canvas.toDataURL(options);
      }

      const link = document.createElement('a');
      link.download = `poster.${format}`;
      link.href = dataURL;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error exporting canvas:', error);
    }
  }
  private formVisibility = new BehaviorSubject<boolean>(true);
  formVisibility$ = this.formVisibility.asObservable();

  hideForm() {
    this.formVisibility.next(false);
  }
}
