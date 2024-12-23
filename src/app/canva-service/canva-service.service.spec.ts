import { TestBed } from '@angular/core/testing';

import { CanvasService } from './canva-service.service';

describe('CanvaServiceService', () => {
  let service: CanvasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
