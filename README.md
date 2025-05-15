# js-in-strings

A powerful JavaScript library for rendering templates with embedded JavaScript expressions, supporting advanced features like custom delimiters, context extensions, and sandboxing.

## Installation

```bash
npm install js-in-strings
# or
yarn add js-in-strings
# or
bun add js-in-strings
```

## Basic Usage

```javascript
import { renderTemplateWithJS } from 'js-in-strings';

// Basic usage
const template = 'Hello, {name}!';
const context = { name: 'World' };
const result = renderTemplateWithJS(template, context);
// Output: "Hello, World!"
```

## Features

- **Full JavaScript Support**: Evaluate any valid JavaScript expression within templates
- **Nested Properties**: Access deeply nested object properties
- **Advanced JavaScript**: Use modern ES6+ features, complex expressions, and control flow
- **Raw Value Extraction**: Return raw data types (arrays, objects, primitives) when needed
- **Custom Delimiters**: Define your own delimiters instead of the default `{}`
- **Context Extensions**: Extend the context with helper functions and utilities
- **Robust Error Handling**: Graceful handling of syntax errors and runtime exceptions
- **Lightweight**: Zero dependencies

## Examples

### String Template Rendering

```javascript
import { renderTemplateWithJS } from 'js-in-strings';

// Basic expressions
renderTemplateWithJS('The result is {a + b * 2}.', { a: 5, b: 3 });
// Output: "The result is 11."

// Nested properties
renderTemplateWithJS('Welcome, {user.profile.firstName}!', { 
  user: { profile: { firstName: 'Jane' } } 
});
// Output: "Welcome, Jane!"

// Array methods
renderTemplateWithJS('Filtered items: {items.filter(i => i > 2).join(", ")}', 
  { items: [1, 2, 3, 4, 5] }
);
// Output: "Filtered items: 3, 4, 5"

// Conditional expressions
renderTemplateWithJS('Status: {isActive ? "Active" : "Inactive"}', { isActive: true });
// Output: "Status: Active"

// Template literals
renderTemplateWithJS('Message: {`Hello ${name}, today is ${new Date().toLocaleDateString()}`}', 
  { name: 'Alice' }
);
// Output: "Message: Hello Alice, today is 5/15/2025" (date will vary)
```

### Raw Value Extraction

Extract raw values (preserving their original data types) from expressions:

```javascript
// Extract an array
const arrayResult = renderTemplateWithJS(
  '{items.filter(i => i > 2)}',
  { items: [1, 2, 3, 4, 5] },
  { returnRawValues: true }
);
// Output: [3, 4, 5] (actual array, not a string)

// Extract an object
const objectResult = renderTemplateWithJS(
  '{user}',
  { user: { name: 'John', age: 30 } },
  { returnRawValues: true }
);
// Output: { name: 'John', age: 30 } (actual object)

// Complex data transformations
const transformedData = renderTemplateWithJS(
  '{data.filter(item => item.active).map(item => ({ id: item.id, upper: item.name.toUpperCase() }))}',
  { 
    data: [
      { id: 1, name: 'apple', active: true },
      { id: 2, name: 'banana', active: false },
      { id: 3, name: 'cherry', active: true }
    ] 
  },
  { returnRawValues: true }
);
// Output: [{ id: 1, upper: 'APPLE' }, { id: 3, upper: 'CHERRY' }]
```

### Advanced JavaScript Features

```javascript
// Destructuring
renderTemplateWithJS(
  'The coordinates are {[x, y] = coords; `(${x},${y})`}',
  { coords: [10, 20] }
);
// Output: "The coordinates are (10,20)"

// Object destructuring
renderTemplateWithJS(
  'Contact: {({name, email} = user; `${name} <${email}>`)}',
  { user: { name: 'John Doe', email: 'john@example.com' } }
);
// Output: "Contact: John Doe <john@example.com>"

// IIFE (Immediately Invoked Function Expression)
renderTemplateWithJS(
  'Sum: {(() => { let sum = 0; for(let i = 1; i <= 5; i++) { sum += i; } return sum; })()}',
  {}
);
// Output: "Sum: 15"

// Class definitions
renderTemplateWithJS(
  '{class Person { constructor(name) { this.name = name; } greet() { return `Hello, ${this.name}`; } }; const p = new Person("Alice"); p.greet()}',
  {},
  { returnRawValues: true }
);
// Output: "Hello, Alice"

// Async/await with Promise.resolve
renderTemplateWithJS(
  '{(async () => { const value = await Promise.resolve(42); return value; })()}',
  {},
  { returnRawValues: true }
);
// Output: Promise object that resolves to 42
```

### Custom Delimiters

Use custom delimiters instead of the default `{}`:

```javascript
// Using ${} delimiters (like template literals)
renderTemplateWithJS(
  'Hello, ${name}!',
  { name: 'World' },
  { delimiters: ['${', '}'] }
);
// Output: "Hello, World!"

// Using custom delimiters
renderTemplateWithJS(
  'Hello, <<name>>!',
  { name: 'World' },
  { delimiters: ['<<', '>>'] }
);
// Output: "Hello, World!"
```

### Context Extensions

Extend the context with helper functions:

```javascript
// Adding a formatting helper
renderTemplateWithJS(
  'Total: {formatCurrency(total)}',
  { total: 99.95 },
  { 
    contextExtensions: { 
      formatCurrency: (amount) => `$${amount.toFixed(2)}` 
    }
  }
);
// Output: "Total: $99.95"

// Combining context and extensions
renderTemplateWithJS(
  '{formatList(items.map(item => item.name))}',
  { 
    items: [
      {name: 'Apple', category: 'Fruit'},
      {name: 'Banana', category: 'Fruit'},
      {name: 'Carrot', category: 'Vegetable'}
    ]
  },
  { 
    contextExtensions: {
      formatList: (items) => items.join(' • ')
    }
  }
);
// Output: "Apple • Banana • Carrot"

// Complex calculations with extensions
renderTemplateWithJS(
  '{calculateTotal(items)}',
  { 
    items: [
      {name: 'Widget', price: 9.99, quantity: 2},
      {name: 'Gadget', price: 14.95, quantity: 1}
    ]
  },
  { 
    returnRawValues: true,
    contextExtensions: {
      calculateTotal: (items) => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    }
  }
);
// Output: 34.93
```

### Error Handling

The library handles errors gracefully:

```javascript
// Syntax error
renderTemplateWithJS('{const x = }', {});
// Output: "[Error: Unexpected token '}'"

// Runtime error
renderTemplateWithJS('{undefined.property}', {});
// Output: "[Error: Cannot read property 'property' of undefined]"

// Undefined variable
renderTemplateWithJS('{nonExistentVar}', {});
// Output: "[Error: nonExistentVar is not defined]"
```

## API Reference

### renderTemplateWithJS(template, context, options)

Renders a template string with JavaScript expressions or extracts raw values from expressions.

#### Parameters

- `template` (string): The template string containing JavaScript expressions wrapped in delimiters
- `context` (object): The context object containing values to be used in the template
- `options` (object, optional): Configuration options
  - `returnRawValues` (boolean): If true, returns the raw evaluated value instead of converting to string
  - `delimiters` (array): Custom delimiters to use instead of the default `{}`. Must be an array with exactly two strings: `[openDelimiter, closeDelimiter]`
  - `contextExtensions` (object): Additional properties and functions to extend the context
  - `sandbox` (boolean): If true, restricts access to global objects for security
  - `allowedGlobals` (object): Custom global objects to be provided when in sandbox mode
  - `timeout` (number): Timeout in milliseconds for expression evaluation (default: 1000ms)

#### Returns

- When `options.returnRawValues` is `false` or not provided:
  - (string): The rendered template with all expressions evaluated and converted to strings
- When `options.returnRawValues` is `true`:
  - (any): The raw value of the evaluated expression with its original data type preserved

## Advanced Use Cases

### Data Processing Pipeline

```javascript
// Process data through multiple transformations
const processedData = renderTemplateWithJS(
  '{
    // Get raw data
    const data = rawData;
    
    // Filter active items
    const activeItems = data.filter(item => item.active);
    
    // Transform the data
    const transformed = activeItems.map(item => ({
      id: item.id,
      name: item.name.toUpperCase(),
      price: item.price * 1.1 // Add 10% tax
    }));
    
    // Sort by price
    transformed.sort((a, b) => a.price - b.price);
    
    // Return the processed data
    return transformed;
  }',
  { 
    rawData: [
      { id: 1, name: 'apple', price: 1.99, active: true },
      { id: 2, name: 'banana', price: 0.99, active: true },
      { id: 3, name: 'cherry', price: 2.99, active: false },
      { id: 4, name: 'date', price: 3.99, active: true }
    ] 
  },
  { returnRawValues: true }
);
// Output: [
//   { id: 2, name: 'BANANA', price: 1.089 },
//   { id: 1, name: 'APPLE', price: 2.189 },
//   { id: 4, name: 'DATE', price: 4.389 }
// ]
```

### Dynamic Report Generation

```javascript
const report = renderTemplateWithJS(
  'Sales Report: {reportDate}\n\n' +
  'Total Sales: {formatCurrency(sales.reduce((sum, sale) => sum + sale.amount, 0))}\n' +
  'Average Sale: {formatCurrency(sales.reduce((sum, sale) => sum + sale.amount, 0) / sales.length)}\n\n' +
  'Top Performers:\n{sales.sort((a, b) => b.amount - a.amount).slice(0, 3).map(sale => `- ${sale.salesperson}: ${formatCurrency(sale.amount)}`).join("\n")}\n\n' +
  'Sales by Category:\n{(() => {\n' +
  '  const byCategory = {};\n' +
  '  sales.forEach(sale => {\n' +
  '    byCategory[sale.category] = (byCategory[sale.category] || 0) + sale.amount;\n' +
  '  });\n' +
  '  return Object.entries(byCategory)\n' +
  '    .map(([category, amount]) => `- ${category}: ${formatCurrency(amount)}`)\n' +
  '    .join("\n");\n' +
  '})()}',
  { 
    reportDate: new Date().toLocaleDateString(),
    sales: [
      { salesperson: 'Alice', amount: 12500, category: 'Electronics' },
      { salesperson: 'Bob', amount: 8700, category: 'Furniture' },
      { salesperson: 'Charlie', amount: 15200, category: 'Electronics' },
      { salesperson: 'Diana', amount: 9300, category: 'Clothing' },
      { salesperson: 'Eve', amount: 10800, category: 'Furniture' }
    ]
  },
  { 
    contextExtensions: {
      formatCurrency: (amount) => `$${amount.toFixed(2)}`
    }
  }
);
// Output: A formatted sales report with totals, averages, top performers, and sales by category
```

## License

MIT
