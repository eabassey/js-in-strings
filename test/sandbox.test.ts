import { renderTemplateWithJS } from '../src/index';

describe('renderTemplateWithJS additional features', () => {
  describe('custom delimiters', () => {
    test('supports custom delimiters', () => {
      const result = renderTemplateWithJS(
        'Result: ${Math.max(1, 2, 3)}',
        {},
        { delimiters: ['${', '}'] }
      );
      
      expect(result).toBe('Result: 3');
    });
    
    test('supports different delimiter styles', () => {
      const result = renderTemplateWithJS(
        'Result: <<customVar>>',
        { customVar: 'Hello World' },
        { delimiters: ['<<', '>>'] }
      );
      
      expect(result).toBe('Result: Hello World');
    });
  });
  
  describe('context extensions', () => {
    test('allows custom helper functions', () => {
      const result = renderTemplateWithJS(
        'Result: {formatNumber(value)}',
        { value: 1234.5678 },
        { 
          contextExtensions: { 
            formatNumber: (num: number) => num.toFixed(2) 
          }
        }
      );
      
      expect(result).toBe('Result: 1234.57');
    });
    
    test('allows accessing both context and extensions', () => {
      const result = renderTemplateWithJS(
        '{capitalize(name)}',
        { name: 'john' },
        { 
          returnRawValues: true,
          contextExtensions: { 
            capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1) 
          }
        }
      );
      
      expect(result).toBe('John');
    });
  });
  
  describe('complex operations', () => {
    test('handles simple computations', () => {
      const result = renderTemplateWithJS(
        '{(() => { let sum = 0; for(let i = 0; i < 10; i++) { sum += i; } return sum; })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe(45); // sum of numbers 0-9
    });
    
    test('supports IIFE pattern', () => {
      const result = renderTemplateWithJS(
        '{(function() { return "Hello from IIFE"; })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('Hello from IIFE');
    });
    
    test('supports arrow functions with implicit return', () => {
      const result = renderTemplateWithJS(
        '{(() => "Arrow function")()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('Arrow function');
    });
  });
  
  describe('error handling', () => {
    test('handles syntax errors gracefully', () => {
      const result = renderTemplateWithJS(
        '{const x = }',
        {},
        { returnRawValues: true }
      );
      
      expect(typeof result).toBe('string');
      expect(result.toString()).toMatch(/\[Error: .+\]/);
    });
    
    test('handles runtime errors gracefully', () => {
      const result = renderTemplateWithJS(
        '{undefined.property}',
        {},
        { returnRawValues: true }
      );
      
      expect(typeof result).toBe('string');
      expect(result.toString()).toMatch(/\[Error: .+\]/);
    });
  });
});
