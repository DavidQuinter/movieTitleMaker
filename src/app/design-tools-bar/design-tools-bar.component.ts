import { Component, OnInit, inject } from '@angular/core';
import { ButtonComponent } from '../button-component/button-component.component';
import { CommonModule } from '@angular/common';
import { CanvasService } from '../canva-service/canva-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface ToolButton {
  label: string;
  icon: string;
  action: () => void;
  group: string;
  tooltip?: string;
}
interface GoogleFont {
  family: string;
  variants: string[];
  files: Record<string, string>;
  category?: string;
}

interface GoogleFontResponse {
  kind: string;
  items: GoogleFont[];
}

@Component({
  selector: 'app-design-tools-bar',
  standalone: true,
  imports: [CommonModule, ButtonComponent, HttpClientModule],
  templateUrl: './design-tools-bar.component.html',
  styleUrl: './design-tools-bar.component.css'
})
export class DesignToolsBarComponent implements OnInit {

  private apikey: string = 'AIzaSyAFOMmHiZD8lXNyoaRw73AeHNhdbJuHez0'

  fontsApi: GoogleFont[] = [];
  fontsLoaded: boolean = false;
  selectedFont: string = 'Arial';
  fontSize: number = 12;
  loadedFonts: Set<string> = new Set();

  httpClient = inject(HttpClient);
  tools: ToolButton[] = [];

  constructor(private canvasService: CanvasService) { }

  ngOnInit() {
    this.initializeTools();
    this.fetchFonts();
  }

  fetchFonts() {
    const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${this.apikey}`;
    this.httpClient.get<GoogleFontResponse>(url)
      .subscribe({
        next: (response: GoogleFontResponse) => {
          this.fontsApi = response.items;
          this.fontsLoaded = true;
        },
        error: (error: any) => {
          console.error('Error fetching fonts:', error);
          this.fontsLoaded = false;
        }
      });
  }
  private loadGoogleFont(fontFamily: string): void {
    if (this.loadedFonts.has(fontFamily)) {
      return;
    }

    const fontToLoad = this.fontsApi.find(font => font.family === fontFamily);
    if (!fontToLoad) {
      console.warn(`Font ${fontFamily} not found in Google Fonts`);
      return;
    }

    try {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css?family=${fontFamily.replace(/\s+/g, '+')}`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      this.loadedFonts.add(fontFamily);

      link.onload = () => {
        console.log(`Font ${fontFamily} loaded successfully`);
      };

      link.onerror = () => {
        console.error(`Error loading font ${fontFamily}`);
        this.loadedFonts.delete(fontFamily);
        document.head.removeChild(link);
      };
    } catch (error) {
      console.error(`Error loading font ${fontFamily}:`, error);
    }
  }

  private initializeTools() {
    this.tools = [
      ...this.getCreationTools(),
      ...this.getTextEditingTools(),
      ...this.getFormattingTools(),
      ...this.getPositioningTools()
    ];
  }

  private getCreationTools(): ToolButton[] {
    return [
      {
        label: '',
        icon: 'title',
        action: () => this.canvasService.addText('producer', 'text '),
        group: 'creation',
        tooltip: 'Add new text element'
      },
      {
        label: '',
        icon: 'image',
        action: () => this.canvasService.addImage(),
        group: 'creation',
        tooltip: 'Add new image'
      }
    ];
  }

  private getTextEditingTools(): ToolButton[] {
    return [];
  }

  onFontChange(value: string) {
    if (!value) return;
    this.selectedFont = value;
    this.canvasService.changeFontFamily(value);
  }

  onFontSizeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const size = parseInt(input.value);
    if (!isNaN(size) && size >= 8 && size <= 72) {
      this.fontSize = size;
      this.canvasService.changeFontSize(size);
    }
  }

  private getFormattingTools(): ToolButton[] {
    const formatActions = {
      italic: () => this.canvasService.toggleItalic(),
      bold: () => this.canvasService.toggleBold(),
      underline: () => this.canvasService.toggleUnderline(),
      alignLeft: () => this.canvasService.setTextAlign('left'),
      alignCenter: () => this.canvasService.setTextAlign('center'),
      alignRight: () => this.canvasService.setTextAlign('right')
    };

    return [
      { label: '', icon: 'format_italic', action: formatActions.italic, group: 'formatting' },
      { label: '', icon: 'format_bold', action: formatActions.bold, group: 'formatting' },
      { label: '', icon: 'format_underlined', action: formatActions.underline, group: 'formatting' },
      { label: '', icon: 'format_align_left', action: formatActions.alignLeft, group: 'formatting' },
      { label: '', icon: 'format_align_center', action: formatActions.alignCenter, group: 'formatting' },
      { label: '', icon: 'format_align_right', action: formatActions.alignRight, group: 'formatting' }
    ];
  }

  private getPositioningTools(): ToolButton[] {
    const positionActions = {
      alignLeft: () => this.canvasService.alignHorizontal('left'),
      alignCenter: () => this.canvasService.alignHorizontal('center'),
      alignRight: () => this.canvasService.alignHorizontal('right'),
      alignTop: () => this.canvasService.alignVertical('top'),
      alignMiddle: () => this.canvasService.alignVertical('middle'),
      alignBottom: () => this.canvasService.alignVertical('bottom'),
      rotateLeft: () => this.canvasService.rotate(-90),
      rotateRight: () => this.canvasService.rotate(90),
      flip: () => this.canvasService.flip()
    };

    return [
      { label: '', icon: 'align_horizontal_left', action: positionActions.alignLeft, group: 'position' },
      { label: '', icon: 'align_horizontal_center', action: positionActions.alignCenter, group: 'position' },
      { label: '', icon: 'align_horizontal_right', action: positionActions.alignRight, group: 'position' },
      { label: '', icon: 'align_vertical_top', action: positionActions.alignTop, group: 'position' },
      { label: '', icon: 'align_vertical_center', action: positionActions.alignMiddle, group: 'position' },
      { label: '', icon: 'align_vertical_bottom', action: positionActions.alignBottom, group: 'position' },
      { label: '', icon: 'rotate_90_degrees_ccw', action: positionActions.rotateLeft, group: 'position' },
      { label: '', icon: 'rotate_90_degrees_cw', action: positionActions.rotateRight, group: 'position' },
      { label: '', icon: 'flip', action: positionActions.flip, group: 'position' }
    ];
  }


  getToolsByGroup(group: string): ToolButton[] {
    return this.tools.filter(tool => tool.group === group);
  }

  executeAction(tool: ToolButton) {
    try {
      tool.action();
    } catch (error) {
      console.error(`Error executing action for ${tool.label}:`, error);

    }
  }
}