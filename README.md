# js-in-strings

A lightweight JavaScript library for rendering templates with embedded JavaScript expressions and extracting raw values.

## Installation

```bash
npm install js-in-strings
```

## Usage

### String Template Rendering

```javascript
import { renderTemplateWithJS } from 'js-in-strings';

// Basic usage
const template = 'Hello, {name}!';
const context = { name: 'World' };
const result = renderTemplateWithJS(template, context);
// Output: "Hello, World!"

// Using JavaScript expressions
const mathTemplate = 'The result is {a + b * 2}.';
const mathContext = { a: 5, b: 3 };
const mathResult = renderTemplateWithJS(mathTemplate, mathContext);
// Output: "The result is 11."

// Accessing nested properties
const nestedTemplate = 'Welcome, {user.profile.firstName}!';
const nestedContext = { 
  user: { 
    profile: { 
      firstName: 'Jane' 
    } 
  } 
};
const nestedResult = renderTemplateWithJS(nestedTemplate, nestedContext);
// Output: "Welcome, Jane!"

// Using JavaScript methods and functions
const complexTemplate = 'Filtered items: {items.filter(i => i > 2).join(", ")}'; 
const complexContext = { items: [1, 2, 3, 4, 5] };
const complexResult = renderTemplateWithJS(complexTemplate, complexContext);
// Output: "Filtered items: 3, 4, 5"
```

### Raw Value Extraction

You can also extract raw values (preserving their original data types) from expressions:

```javascript
import { renderTemplateWithJS } from 'js-in-strings';

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

// Complex transformations
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
// Output: [{ id: 1, upper: 'APPLE' }, { id: 3, upper: 'CHERRY' }] (actual array of objects)
```

## Features

- Evaluate any valid JavaScript expression within templates
- Access context object properties, including nested properties
- Use JavaScript built-in methods and functions
- Return raw data types (arrays, objects, primitives) when needed
- Error handling for invalid expressions
- Lightweight with zero dependencies

## API

### renderTemplateWithJS(template, context, options)

Renders a template string with JavaScript expressions or extracts raw values from expressions.

#### Parameters

- `template` (string): The template string containing JavaScript expressions wrapped in `{}` delimiters
- `context` (object): The context object containing values to be used in the template
- `options` (object, optional): Configuration options
  - `returnRawValues` (boolean): If true and the template contains a single expression, returns the raw evaluated value instead of converting to string

#### Returns

- When `options.returnRawValues` is `false` or not provided:
  - (string): The rendered template with all expressions evaluated and converted to strings
- When `options.returnRawValues` is `true` and the template is a single expression:
  - (any): The raw value of the evaluated expression with its original data type preserved

## License

MIT
