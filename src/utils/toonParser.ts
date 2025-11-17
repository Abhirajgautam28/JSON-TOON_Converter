export class ToonParser {
  static jsonToToon(jsonString: string): string {
    try {
      const jsonData = JSON.parse(jsonString);
      return this.convertJsonToToon(jsonData);
    } catch (error) {
      throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static toonToJson(toonString: string): string {
    try {
      const jsonData = this.convertToonToJson(toonString);
      return JSON.stringify(jsonData, null, 2);
    } catch (error) {
      throw new Error(`Invalid TOON format: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static convertJsonToToon(data: unknown, indent: number = 0): string {
    const indentation = '  '.repeat(indent);

    if (data === null) {
      return 'null';
    }

    if (data === undefined) {
      return 'undefined';
    }

    if (typeof data === 'string') {
      return `"${this.escapeString(data)}"`;
    }

    if (typeof data === 'number' || typeof data === 'boolean') {
      return String(data);
    }

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return '[]';
      }

      const items = data.map(item =>
        `${indentation}  ${this.convertJsonToToon(item, indent + 1)}`
      ).join('\n');

      return `[\n${items}\n${indentation}]`;
    }

    if (typeof data === 'object') {
      const entries = Object.entries(data as Record<string, unknown>);

      if (entries.length === 0) {
        return '{}';
      }

      const items = entries.map(([key, value]) => {
        const toonValue = this.convertJsonToToon(value, indent + 1);
        return `${indentation}  ${key}: ${toonValue}`;
      }).join('\n');

      return `{\n${items}\n${indentation}}`;
    }

    return String(data);
  }

  private static convertToonToJson(toonString: string): unknown {
    const tokens = this.tokenize(toonString);
    const { value } = this.parseValue(tokens, 0);
    return value;
  }

  private static tokenize(input: string): string[] {
    const tokens: string[] = [];
    let i = 0;

    while (i < input.length) {
      const char = input[i];

      if (/\s/.test(char)) {
        i++;
        continue;
      }

      if (char === '{' || char === '}' || char === '[' || char === ']' || char === ':' || char === ',') {
        tokens.push(char);
        i++;
        continue;
      }

      if (char === '"') {
        let str = '"';
        i++;
        while (i < input.length) {
          if (input[i] === '\\' && i + 1 < input.length) {
            str += input[i] + input[i + 1];
            i += 2;
          } else if (input[i] === '"') {
            str += '"';
            i++;
            break;
          } else {
            str += input[i];
            i++;
          }
        }
        tokens.push(str);
        continue;
      }

      let token = '';
      while (i < input.length && !/[\s{}[\]:,]/.test(input[i])) {
        token += input[i];
        i++;
      }
      if (token) {
        tokens.push(token);
      }
    }

    return tokens;
  }

  private static parseValue(tokens: string[], index: number): { value: unknown; nextIndex: number } {
    if (index >= tokens.length) {
      throw new Error('Unexpected end of input');
    }

    const token = tokens[index];

    if (token === '{') {
      return this.parseObject(tokens, index);
    }

    if (token === '[') {
      return this.parseArray(tokens, index);
    }

    if (token.startsWith('"') && token.endsWith('"')) {
      return {
        value: this.unescapeString(token.slice(1, -1)),
        nextIndex: index + 1
      };
    }

    if (token === 'null') {
      return { value: null, nextIndex: index + 1 };
    }

    if (token === 'undefined') {
      return { value: null, nextIndex: index + 1 };
    }

    if (token === 'true') {
      return { value: true, nextIndex: index + 1 };
    }

    if (token === 'false') {
      return { value: false, nextIndex: index + 1 };
    }

    const num = Number(token);
    if (!isNaN(num)) {
      return { value: num, nextIndex: index + 1 };
    }

    throw new Error(`Unexpected token: ${token}`);
  }

  private static parseObject(tokens: string[], index: number): { value: Record<string, unknown>; nextIndex: number } {
    const obj: Record<string, unknown> = {};
    let i = index + 1;

    if (tokens[i] === '}') {
      return { value: obj, nextIndex: i + 1 };
    }

    while (i < tokens.length) {
      if (tokens[i] === '}') {
        return { value: obj, nextIndex: i + 1 };
      }

      const key = tokens[i];
      i++;

      if (tokens[i] !== ':') {
        throw new Error(`Expected ':', got '${tokens[i]}'`);
      }
      i++;

      const { value, nextIndex } = this.parseValue(tokens, i);
      obj[key] = value;
      i = nextIndex;

      if (tokens[i] === ',') {
        i++;
      }
    }

    throw new Error('Unclosed object');
  }

  private static parseArray(tokens: string[], index: number): { value: unknown[]; nextIndex: number } {
    const arr: unknown[] = [];
    let i = index + 1;

    if (tokens[i] === ']') {
      return { value: arr, nextIndex: i + 1 };
    }

    while (i < tokens.length) {
      if (tokens[i] === ']') {
        return { value: arr, nextIndex: i + 1 };
      }

      const { value, nextIndex } = this.parseValue(tokens, i);
      arr.push(value);
      i = nextIndex;

      if (tokens[i] === ',') {
        i++;
      }
    }

    throw new Error('Unclosed array');
  }

  private static escapeString(str: string): string {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }

  private static unescapeString(str: string): string {
    return str
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }
}
