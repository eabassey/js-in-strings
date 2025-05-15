import { renderTemplateWithJS } from '../src/index';

describe('renderTemplateWithJS advanced JavaScript features', () => {
  describe('ES6+ syntax features', () => {
    test('supports template literals', () => {
      const result = renderTemplateWithJS(
        '{`Hello, ${name}!`}',
        { name: 'World' },
        { returnRawValues: true }
      );
      
      expect(result).toBe('Hello, World!');
    });
    
    test('supports arrow functions with block body', () => {
      const result = renderTemplateWithJS(
        '{(() => { const greeting = "Hello"; return `${greeting}, World!`; })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('Hello, World!');
    });
    
    test('supports default parameters', () => {
      const result = renderTemplateWithJS(
        '{((name = "Default") => `Hello, ${name}!`)("Custom")}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('Hello, Custom!');
    });
    
    test('supports rest parameters', () => {
      const result = renderTemplateWithJS(
        '{((...args) => args.join(", "))("apple", "banana", "cherry")}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('apple, banana, cherry');
    });
    
    test('supports spread operator with arrays', () => {
      const result = renderTemplateWithJS(
        '{[1, 2, ...[3, 4, 5]]}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
    
    test('supports spread operator with objects', () => {
      const result = renderTemplateWithJS(
        '{({...{ a: 1, b: 2 }, c: 3 })}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });
    
    test('supports object property shorthand', () => {
      const result = renderTemplateWithJS(
        '{(() => { const name = "John"; const age = 30; return { name, age }; })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual({ name: 'John', age: 30 });
    });
    
    test('supports computed property names', () => {
      const result = renderTemplateWithJS(
        '{(() => { const key = "dynamicKey"; return { [key]: "value" }; })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual({ dynamicKey: 'value' });
    });
    
    test('supports method properties', () => {
      const result = renderTemplateWithJS(
        '{(() => { const obj = { method() { return "Hello"; } }; return obj.method(); })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('Hello');
    });
  });
  
  describe('Array methods', () => {
    test('supports map', () => {
      const result = renderTemplateWithJS(
        '{[1, 2, 3].map(x => x * 2)}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual([2, 4, 6]);
    });
    
    test('supports filter', () => {
      const result = renderTemplateWithJS(
        '{[1, 2, 3, 4, 5].filter(x => x % 2 === 0)}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual([2, 4]);
    });
    
    test('supports reduce', () => {
      const result = renderTemplateWithJS(
        '{[1, 2, 3, 4, 5].reduce((acc, curr) => acc + curr, 0)}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe(15);
    });
    
    test('supports find', () => {
      const result = renderTemplateWithJS(
        '{[{id: 1, name: "John"}, {id: 2, name: "Jane"}].find(user => user.id === 2)}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual({id: 2, name: "Jane"});
    });
    
    test('supports some', () => {
      const result = renderTemplateWithJS(
        '{[1, 2, 3, 4, 5].some(x => x > 3)}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe(true);
    });
    
    test('supports every', () => {
      const result = renderTemplateWithJS(
        '{[1, 2, 3, 4, 5].every(x => x > 0)}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe(true);
    });
    
    test('supports flat', () => {
      const result = renderTemplateWithJS(
        '{[1, [2, [3, 4]]].flat(2)}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual([1, 2, 3, 4]);
    });
    
    test('supports flatMap', () => {
      const result = renderTemplateWithJS(
        '{[1, 2, 3].flatMap(x => [x, x * 2])}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual([1, 2, 2, 4, 3, 6]);
    });
  });
  
  describe('Object manipulation', () => {
    test('supports Object.keys', () => {
      const result = renderTemplateWithJS(
        '{Object.keys({a: 1, b: 2, c: 3})}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual(['a', 'b', 'c']);
    });
    
    test('supports Object.values', () => {
      const result = renderTemplateWithJS(
        '{Object.values({a: 1, b: 2, c: 3})}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual([1, 2, 3]);
    });
    
    test('supports Object.entries', () => {
      const result = renderTemplateWithJS(
        '{Object.entries({a: 1, b: 2})}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual([['a', 1], ['b', 2]]);
    });
    
    test('supports Object.assign', () => {
      const result = renderTemplateWithJS(
        '{Object.assign({a: 1}, {b: 2}, {c: 3})}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual({a: 1, b: 2, c: 3});
    });
    
    test('supports Object.fromEntries', () => {
      const result = renderTemplateWithJS(
        '{Object.fromEntries([["a", 1], ["b", 2]])}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual({a: 1, b: 2});
    });
  });
  
  describe('Control flow and loops', () => {
    test('supports for...of loops', () => {
      const result = renderTemplateWithJS(
        '{(() => { const arr = [1, 2, 3]; let sum = 0; for (const num of arr) { sum += num; } return sum; })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe(6);
    });
    
    test('supports for...in loops', () => {
      const result = renderTemplateWithJS(
        '{(() => { const obj = {a: 1, b: 2, c: 3}; let keys = ""; for (const key in obj) { keys += key; } return keys; })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('abc');
    });
    
    test('supports while loops', () => {
      const result = renderTemplateWithJS(
        '{(() => { let i = 0; let result = ""; while (i < 3) { result += i; i++; } return result; })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('012');
    });
    
    test('supports do...while loops', () => {
      const result = renderTemplateWithJS(
        '{(() => { let i = 0; let result = ""; do { result += i; i++; } while (i < 3); return result; })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('012');
    });
    
    test('supports switch statements', () => {
      const result = renderTemplateWithJS(
        '{(() => { const value = 2; let result = ""; switch(value) { case 1: result = "one"; break; case 2: result = "two"; break; default: result = "other"; } return result; })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('two');
    });
    
    test('supports ternary operator', () => {
      const result = renderTemplateWithJS(
        '{true ? "yes" : "no"}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('yes');
    });
    
    test('supports nullish coalescing operator', () => {
      const result = renderTemplateWithJS(
        '{null ?? "default"}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('default');
    });
    
    test('supports optional chaining', () => {
      const result = renderTemplateWithJS(
        '{(() => { const obj = { nested: { value: 42 } }; return obj?.nested?.value; })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe(42);
    });
  });
  
  describe('Complex patterns', () => {
    test('supports recursive functions', () => {
      const result = renderTemplateWithJS(
        '{(() => { function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); } return factorial(5); })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe(120);
    });
    
    test('supports closures', () => {
      const result = renderTemplateWithJS(
        '{(() => { function createCounter() { let count = 0; return function() { return ++count; }; } const counter = createCounter(); counter(); counter(); return counter(); })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe(3);
    });
    
    test('supports higher-order functions', () => {
      const result = renderTemplateWithJS(
        '{(() => { function multiplyBy(factor) { return function(number) { return number * factor; }; } const double = multiplyBy(2); return double(5); })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe(10);
    });
    
    test('supports function composition', () => {
      const result = renderTemplateWithJS(
        '{(() => { const add5 = x => x + 5; const multiply2 = x => x * 2; const compose = (f, g) => x => f(g(x)); return compose(add5, multiply2)(10); })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe(25); // (10 * 2) + 5 = 25
    });
    
    test('supports generators', () => {
      const result = renderTemplateWithJS(
        '{(() => { function* range(start, end) { for (let i = start; i <= end; i++) yield i; } return [...range(1, 3)]; })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual([1, 2, 3]);
    });
    
    test('supports complex data transformations', () => {
      const result = renderTemplateWithJS(
        '{(() => { const data = [{id: 1, values: [10, 20]}, {id: 2, values: [30, 40]}]; return data.flatMap(item => item.values.map(val => ({id: item.id, value: val}))); })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toEqual([
        {id: 1, value: 10},
        {id: 1, value: 20},
        {id: 2, value: 30},
        {id: 2, value: 40}
      ]);
    });
    
    test('supports context access with complex expressions', () => {
      const result = renderTemplateWithJS(
        '{users.filter(u => u.age > 30).map(u => u.name).join(", ")}',
        { 
          users: [
            {name: 'Alice', age: 25},
            {name: 'Bob', age: 35},
            {name: 'Charlie', age: 45}
          ]
        },
        { returnRawValues: true }
      );
      
      expect(result).toBe('Bob, Charlie');
    });
  });
  
  describe('Error handling', () => {
    test('handles division by zero', () => {
      const result = renderTemplateWithJS(
        '{1/0}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe(Infinity);
    });
    
    test('handles JSON.stringify circular references gracefully', () => {
      const result = renderTemplateWithJS(
        '{(() => { try { const obj = {}; obj.self = obj; return JSON.stringify(obj); } catch(e) { return "Circular reference detected"; } })()}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe('Circular reference detected');
    });
    
    test('handles property access on null with optional chaining', () => {
      const result = renderTemplateWithJS(
        '{null?.property}',
        {},
        { returnRawValues: true }
      );
      
      expect(result).toBe(undefined);
    });
  });
  
  describe('Context and extensions interaction', () => {
    test('combines context and extensions for complex operations', () => {
      const result = renderTemplateWithJS(
        '{formatCurrency(items.reduce((total, item) => total + item.price * item.quantity, 0))}',
        { 
          items: [
            {name: 'Widget', price: 9.99, quantity: 2},
            {name: 'Gadget', price: 14.95, quantity: 1}
          ]
        },
        { 
          returnRawValues: true,
          contextExtensions: {
            formatCurrency: (amount: number) => `$${amount.toFixed(2)}`
          }
        }
      );
      
      expect(result).toBe('$34.93');
    });
    
    test('uses extensions to format complex data structures', () => {
      const result = renderTemplateWithJS(
        '{formatList(items.map(item => item.name))}',
        { 
          items: [
            {name: 'Apple', category: 'Fruit'},
            {name: 'Banana', category: 'Fruit'},
            {name: 'Carrot', category: 'Vegetable'}
          ]
        },
        { 
          returnRawValues: true,
          contextExtensions: {
            formatList: (items: string[]) => items.join(' • ')
          }
        }
      );
      
      expect(result).toBe('Apple • Banana • Carrot');
    });
  });
  
  describe('Nested property access', () => {
    test('accesses deeply nested properties', () => {
      const result = renderTemplateWithJS(
        '{user.profile.address.city}, {user.profile.address.country}',
        { 
          user: {
            id: 123,
            profile: {
              name: 'John Doe',
              address: {
                street: '123 Main St',
                city: 'New York',
                country: 'USA',
                postalCode: '10001'
              }
            }
          }
        }
      );
      
      expect(result).toBe('New York, USA');
    });
    
    test('combines nested properties with string operations', () => {
      const result = renderTemplateWithJS(
        '{company.name.toUpperCase()} - {company.departments.length} departments',
        { 
          company: {
            name: 'Acme Corp',
            founded: 1985,
            departments: ['Sales', 'Marketing', 'Engineering', 'HR']
          }
        }
      );
      
      expect(result).toBe('ACME CORP - 4 departments');
    });
    
    test('handles arrays of objects with nested properties', () => {
      const result = renderTemplateWithJS(
        '{data.products.filter(p => p.category === "Electronics").map(p => p.name).join(", ")}',
        { 
          data: {
            store: 'TechMart',
            products: [
              {id: 1, name: 'Laptop', category: 'Electronics', price: 999.99},
              {id: 2, name: 'Book', category: 'Books', price: 19.99},
              {id: 3, name: 'Smartphone', category: 'Electronics', price: 699.99},
              {id: 4, name: 'Desk Chair', category: 'Furniture', price: 149.99}
            ]
          }
        },
        { returnRawValues: true }
      );
      
      expect(result).toBe('Laptop, Smartphone');
    });
    
    test('performs calculations with nested numeric properties', () => {
      const result = renderTemplateWithJS(
        '{Math.round((order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * (1 + order.tax.rate)))}',
        { 
          order: {
            id: 'ORD-12345',
            customer: 'Jane Smith',
            items: [
              {id: 'PROD-1', name: 'Widget', price: 10, quantity: 2},
              {id: 'PROD-2', name: 'Gadget', price: 15, quantity: 1}
            ],
            tax: {
              rate: 0.08,
              description: 'Sales Tax'
            }
          }
        },
        { returnRawValues: true }
      );
      
      expect(result).toBe(38); // (10*2 + 15*1) * 1.08 = 35 * 1.08 = 37.8, rounded to 38
    });
    
    test('handles conditional expressions with nested properties', () => {
      const result = renderTemplateWithJS(
        '{user.subscription.isActive ? `Premium user since ${user.subscription.startDate}` : "Free user"}',
        { 
          user: {
            name: 'Alice',
            email: 'alice@example.com',
            subscription: {
              isActive: true,
              plan: 'Premium',
              startDate: '2023-01-15',
              nextBillingDate: '2023-02-15'
            }
          }
        },
        { returnRawValues: true }
      );
      
      expect(result).toBe('Premium user since 2023-01-15');
    });
    
    test('handles optional chaining with deeply nested properties', () => {
      const result = renderTemplateWithJS(
        '{user?.subscription?.features?.map(f => f.name).join(", ") || "No features available"}',
        { 
          user: {
            name: 'Bob',
            subscription: {
              plan: 'Basic',
              features: [
                {name: 'Storage', limit: '5GB'},
                {name: 'Support', type: 'Email'},
                {name: 'Backup', frequency: 'Weekly'}
              ]
            }
          }
        },
        { returnRawValues: true }
      );
      
      expect(result).toBe('Storage, Support, Backup');
    });
    
    test('combines nested properties with complex transformations', () => {
      const result = renderTemplateWithJS(
        '{(() => { const groupedByDept = {}; organization.employees.forEach(emp => { if (!groupedByDept[emp.department]) { groupedByDept[emp.department] = []; } groupedByDept[emp.department].push(emp.name); }); return Object.entries(groupedByDept).map(([dept, names]) => `${dept}: ${names.join(", ")}`).join("\\n"); })()}',
        { 
          organization: {
            name: 'TechCorp',
            employees: [
              {name: 'Alice', department: 'Engineering', role: 'Developer'},
              {name: 'Bob', department: 'Marketing', role: 'Specialist'},
              {name: 'Charlie', department: 'Engineering', role: 'Manager'},
              {name: 'Diana', department: 'HR', role: 'Director'},
              {name: 'Eve', department: 'Marketing', role: 'Coordinator'}
            ]
          }
        },
        { returnRawValues: true }
      );
      
      expect(result).toBe('Engineering: Alice, Charlie\nMarketing: Bob, Eve\nHR: Diana');
    });
  });
});
