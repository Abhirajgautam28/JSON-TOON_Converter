export class ToonParser {
  static jsonToToon(jsonString: string): string {
    try {
      const jsonData = JSON.parse(jsonString);
      return this.convertJsonToToon(jsonData, 0);
    } catch (error) {
      throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static toonToJson(toonString: string): string {
    try {
      const lines = toonString.split('\n');
      const jsonData = this.parseToonLines(lines, 0).value;
      return JSON.stringify(jsonData, null, 2);
    } catch (error) {
      throw new Error(`Invalid TOON format: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static convertJsonToToon(data: unknown, indent: number): string {
    const indentation = '  '.repeat(indent);

    if (data === null || data === undefined) {
      return '';
    }

    if (typeof data === 'string') {
      return data;
    }

    if (typeof data === 'number' || typeof data === 'boolean') {
      return String(data);
    }

    if (Array.isArray(data)) {
      const lines: string[] = [];
      data.forEach((item) => {
        const value = this.convertJsonToToon(item, indent + 1);
        if (value) {
          lines.push(`${indentation}  ${value}`);
        }
      });
      return lines.join('\n');
    }

    if (typeof data === 'object') {
      const entries = Object.entries(data as Record<string, unknown>);
      const lines: string[] = [];

      entries.forEach(([key, value]) => {
        if (value === null || value === undefined) {
          return;
        }

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          lines.push(`${indentation}${key},${this.convertJsonToToon(value, indent)}`);
        } else if (Array.isArray(value)) {
          lines.push(`${indentation}${key},`);
          const arrayLines = this.convertJsonToToon(value, indent + 1);
          if (arrayLines) {
            lines.push(arrayLines);
          }
        } else if (typeof value === 'object') {
          lines.push(`${indentation}${key},`);
          const objectLines = this.convertJsonToToon(value, indent + 1);
          if (objectLines) {
            lines.push(objectLines);
          }
        }
      });

      return lines.join('\n');
    }

    return String(data);
  }

  private static parseToonLines(
    lines: string[],
    startIndex: number
  ): { value: Record<string, unknown>; nextIndex: number } {
    const result: Record<string, unknown> = {};
    let i = startIndex;
    let parentIndent = -1;

    if (startIndex > 0) {
      const prevLine = lines[startIndex - 1];
      parentIndent = (prevLine.length - prevLine.trimStart().length) / 2;
    }

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trimStart();

      if (!trimmed) {
        i++;
        continue;
      }

      const indent = (line.length - trimmed.length) / 2;

      if (startIndex > 0 && indent <= parentIndent) {
        break;
      }

      const commaIndex = trimmed.indexOf(',');

      if (commaIndex === -1) {
        i++;
        continue;
      }

      const key = trimmed.substring(0, commaIndex).trim();
      const value = trimmed.substring(commaIndex + 1).trim();

      if (value === '') {
        i++;
        const nested = this.parseToonLines(lines, i);
        result[key] = nested.value;
        i = nested.nextIndex;
      } else {
        result[key] = this.parseValue(value);
        i++;
      }
    }

    return { value: result, nextIndex: i };
  }

  private static parseValue(value: string): string | number | boolean | null {
    const lower = value.toLowerCase();

    if (lower === 'true') {
      return true;
    }

    if (lower === 'false') {
      return false;
    }

    if (lower === 'null') {
      return null;
    }

    const num = Number(value);
    if (!isNaN(num) && value.trim() !== '') {
      return num;
    }

    return value;
  }
}
