export interface ConversionResult {
  success: boolean;
  data?: string;
  error?: string;
  fileName?: string;
}

export type ConversionMode = 'json-to-toon' | 'toon-to-json';

export interface FileData {
  name: string;
  content: string;
  type: string;
}
