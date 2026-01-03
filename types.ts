export enum VectorStyle {
  REALISTIC = 'Realistic Tracing',
  FLAT_DESIGN = 'Flat Design Icon',
  MINIMALIST = 'Minimalist Line Art',
  LOW_POLY = 'Low Poly Geometric',
  ABSTRACT = 'Abstract Artistic',
  PIXEL_ART = 'Pixel Art Style'
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: string; // Description of current step
  error: string | null;
}

export interface GeneratedSvg {
  code: string;
  style: VectorStyle;
  timestamp: number;
}