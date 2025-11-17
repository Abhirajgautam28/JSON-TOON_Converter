import { ConversionResult, ConversionMode } from '../types';
import { ToonParser } from './toonParser';

export class FileHandler {
  static async readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  static async convertFile(
    file: File,
    mode: ConversionMode
  ): Promise<ConversionResult> {
    try {
      const content = await this.readFile(file);

      if (mode === 'json-to-toon') {
        const toonContent = ToonParser.jsonToToon(content);
        const fileName = file.name.replace(/\.json$/i, '.toon');
        return {
          success: true,
          data: toonContent,
          fileName
        };
      } else {
        const jsonContent = ToonParser.toonToJson(content);
        const fileName = file.name.replace(/\.toon$/i, '.json');
        return {
          success: true,
          data: jsonContent,
          fileName
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Conversion failed'
      };
    }
  }

  static downloadFile(content: string, fileName: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static validateFileType(file: File, mode: ConversionMode): boolean {
    if (mode === 'json-to-toon') {
      return file.name.toLowerCase().endsWith('.json') || file.type === 'application/json';
    } else {
      return file.name.toLowerCase().endsWith('.toon') || file.type === 'text/plain';
    }
  }
}
