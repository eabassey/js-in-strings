import { renderTemplateWithJS } from '../src/index';

describe('renderTemplateWithJS', () => {
  describe('string template rendering', () => {
    test('renders simple variable expressions', () => {
      const template = 'Hello, {name}!';
      const context = { name: 'World' };
      
      expect(renderTemplateWithJS(template, context)).toBe('Hello, World!');
    });

    test('renders expressions with operations', () => {
      const template = 'The result is {a + b}.';
      const context = { a: 5, b: 3 };
      
      expect(renderTemplateWithJS(template, context)).toBe('The result is 8.');
    });

    test('renders nested property access', () => {
      const template = 'Welcome, {user.profile.firstName}!';
      const context = { 
        user: { 
          profile: { 
            firstName: 'Jane' 
          } 
        } 
      };
      
      expect(renderTemplateWithJS(template, context)).toBe('Welcome, Jane!');
    });

    test('renders multiple expressions', () => {
      const template = 'Hello, {firstName} {lastName}! You are {age} years old.';
      const context = { firstName: 'John', lastName: 'Doe', age: 30 };
      
      expect(renderTemplateWithJS(template, context)).toBe('Hello, John Doe! You are 30 years old.');
    });

    test('renders expressions with method calls', () => {
      const template = 'Uppercase: {name.toUpperCase()}';
      const context = { name: 'john' };
      
      expect(renderTemplateWithJS(template, context)).toBe('Uppercase: JOHN');
    });

    test('renders expressions with built-in JavaScript functions', () => {
      const template = 'Rounded: {Math.round(value)}';
      const context = { value: 3.7 };
      
      expect(renderTemplateWithJS(template, context)).toBe('Rounded: 4');
    });

    test('renders complex expressions', () => {
      const template = 'Result: {items.filter(i => i > 2).map(i => i * 2).join(", ")}';
      const context = { items: [1, 2, 3, 4, 5] };
      
      expect(renderTemplateWithJS(template, context)).toBe('Result: 6, 8, 10');
    });

    test('handles undefined values', () => {
      const template = 'Value: {undefinedValue}';
      const context = { };
      
      expect(renderTemplateWithJS(template, context)).toMatch(/Value: \[Error: .+\]/);
    });

    test('handles null values', () => {
      const template = 'Value: {nullValue}';
      const context = { nullValue: null };
      
      expect(renderTemplateWithJS(template, context)).toBe('Value: ');
    });

    test('handles errors gracefully', () => {
      const template = 'Result: {a.nonExistentMethod()}';
      const context = { a: 5 };
      
      expect(renderTemplateWithJS(template, context)).toMatch(/Result: \[Error: .+\]/);
    });

    test('handles conditional expressions', () => {
      const template = 'Status: {age >= 18 ? "Adult" : "Minor"}';
      const context = { age: 25 };
      
      expect(renderTemplateWithJS(template, context)).toBe('Status: Adult');
    });
  });

  describe('raw value extraction', () => {
    test('returns primitive values', () => {
      expect(renderTemplateWithJS('{42}', {}, { returnRawValues: true })).toBe(42);
      expect(renderTemplateWithJS('{"hello"}', {}, { returnRawValues: true })).toBe('hello');
      expect(renderTemplateWithJS('{true}', {}, { returnRawValues: true })).toBe(true);
      expect(renderTemplateWithJS('{null}', {}, { returnRawValues: true })).toBe(null);
    });

    test('returns arrays', () => {
      const result = renderTemplateWithJS('{items.filter(i => i > 2)}', { items: [1, 2, 3, 4, 5] }, { returnRawValues: true });
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([3, 4, 5]);
    });

    test('returns objects', () => {
      const result = renderTemplateWithJS('{user}', { user: { name: 'John', age: 30 } }, { returnRawValues: true });
      expect(typeof result).toBe('object');
      expect(result).toEqual({ name: 'John', age: 30 });
    });

    test('returns transformed data', () => {
      // Use a simpler transformation to avoid complex object literal syntax
      const result = renderTemplateWithJS(
        '{data.filter(item => item.active).map(item => item.name.toUpperCase())}',
        { 
          data: [
            { id: 1, name: 'apple', active: true },
            { id: 2, name: 'banana', active: false },
            { id: 3, name: 'cherry', active: true }
          ] 
        },
        { returnRawValues: true }
      );
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(['APPLE', 'CHERRY']);
    });

    test('handles complex calculations', () => {
      const result = renderTemplateWithJS(
        '{items.reduce((sum, item) => sum + item, 0)}',
        { items: [1, 2, 3, 4, 5] },
        { returnRawValues: true }
      );
      
      expect(result).toBe(15);
    });

    test('handles errors in raw value mode', () => {
      const result = renderTemplateWithJS(
        '{nonExistentVar}',
        {},
        { returnRawValues: true }
      );
      
      expect(typeof result).toBe('string');
      expect(result.toString()).toMatch(/\[Error: .+\]/);
    });
  });

  describe('advanced JavaScript expressions', () => {
    test('supports array destructuring', () => {
      const result = renderTemplateWithJS(
        '{const [first, second, ...rest] = arr; return rest.join("-")}',
        { arr: [1, 2, 3, 4, 5] },
        { returnRawValues: true }
      );
      
      expect(result).toBe('3-4-5');
    });
    
    test('supports object destructuring', () => {
      const result = renderTemplateWithJS(
        '{const { name, address: { city } } = person; return `${name} from ${city}`}',
        { person: { name: 'John', address: { city: 'New York', zip: '10001' } } },
        { returnRawValues: true }
      );
      
      expect(result).toBe('John from New York');
    });
    
    test('supports async/await with Promise.resolve', () => {
      const result = renderTemplateWithJS<Promise<number>>(
        '{async function test() { const value = await Promise.resolve(42); return value; }; return test()}',
        {},
        { returnRawValues: true }
      );
      
      // Use type assertion to tell TypeScript this is a Promise
      expect(typeof (result as any).then === 'function').toBe(true);
    });
    
    test('supports try/catch blocks', () => {
      const result = renderTemplateWithJS(
        '{try { throw new Error("test error"); } catch (e) { return `Caught: ${e.message}`; }}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('Caught: test error');
    });
    
    test('supports complex control flow', () => {
      const result = renderTemplateWithJS(
        '{let result = 0; for (let i = 0; i < 5; i++) { if (i % 2 === 0) { result += i; } else { result += i * 2; } }; return result}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe(14); // 0 + 1*2 + 2 + 3*2 + 4 = 0 + 2 + 2 + 6 + 4 = 14
    });
    
    test('supports class definitions and instantiation', () => {
      const result = renderTemplateWithJS(
        '{class Person { constructor(name) { this.name = name; } greet() { return `Hello, ${this.name}`; } }; const p = new Person("Alice"); return p.greet();}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('Hello, Alice');
    });
    
    test('supports regular expressions', () => {
      const result = renderTemplateWithJS(
        '{const regex = /^(\\d{3})-(\\d{3})-(\\d{4})$/; const match = regex.exec(phone); return match ? match[0] : "no match"}',
        { phone: '123-456-7890' },
        { returnRawValues: true }
      );
      
      expect(result).toBe('123-456-7890');
    });
    
    test('supports date manipulation', () => {
      const result = renderTemplateWithJS(
        '{const date = new Date("2023-01-01"); date.setMonth(date.getMonth() + 1); return date.toISOString().split("T")[0]}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('2023-02-01');
    });
  });
});
