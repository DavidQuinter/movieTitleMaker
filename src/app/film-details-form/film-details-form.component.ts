import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button-component/button-component.component';
import { HttpClient } from '@angular/common/http';

interface UploadedFile {
  id: number,
  filename: string,
  originalname: string,
  filepath: string,
  created_at: string
}

@Component({
  selector: 'app-film-details-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonComponent],
  templateUrl: './film-details-form.component.html',
  styleUrls: ['./film-details-form.component.css', '../button-component/button-component.component.css']
})
export class FilmDetailsFormComponent implements OnInit {
  filmDetails = {
    movieTitle: '',
    director: '',
    producer: '',
    musiComposer: '',
    casting: '',
    releaseDate: '',
  }

  url: string | ArrayBuffer | null = "assets/placeholder.jpg";
  selectedFiles: File[] = [];
  uploadedFiles: UploadedFile[] = [];
  isManualInput: boolean = false;
  hasLoadedData: boolean = false;
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void { }

  onSelectImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.url = e.target?.result || null;
      };

      reader.readAsDataURL(file);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  uploadFilesAndGetData() {
    if (this.selectedFiles.length === 0) {
      alert('Please select files first');
      return;
    }
    
    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    this.http.post<any>('http://localhost:3000/random-movie', formData)
      .subscribe({
        next: (response) => {
          console.log('Upload successful', response);
          this.uploadedFiles = response;
          this.selectedFiles = [];
          

          this.updateFormWithReceivedData(response);
        },
        error: (error) => {
          console.error('Upload failed', error);
          alert('Failed to get movie data. Please try again or input manually.');
        }
      });
  }

  updateFormWithReceivedData(data: any) {

    this.filmDetails = {
      movieTitle: data.movieTitle || '',
      director: data.director || '',
      producer: data.producer || '',
      musiComposer: data.musiComposer || '',
      casting: data.casting || '',
      releaseDate: data.releaseDate || '',
    };
    
    this.hasLoadedData = true;
  }

  generatePoster() {
    console.log('Generating poster with details:', this.filmDetails);
  }
}