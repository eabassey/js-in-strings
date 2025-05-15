// Example usage of js-in-strings library

import { renderTemplateWithJS } from '../src/index.js';

// Basic example
const simpleTemplate = 'Hello, {name}!';
const simpleContext = { name: 'World' };
console.log('Simple example:');
console.log(renderTemplateWithJS(simpleTemplate, simpleContext));
// Output: "Hello, World!"

// Math operations
const mathTemplate = 'The result of {a} + {b} * 2 is {a + b * 2}.';
const mathContext = { a: 5, b: 3 };
console.log('\nMath operations:');
console.log(renderTemplateWithJS(mathTemplate, mathContext));
// Output: "The result of 5 + 3 * 2 is 11."

// Nested properties
const nestedTemplate = 'Welcome, {user.profile.firstName} {user.profile.lastName}!';
const nestedContext = { 
  user: { 
    profile: { 
      firstName: 'Jane',
      lastName: 'Doe'
    } 
  } 
};
console.log('\nNested properties:');
console.log(renderTemplateWithJS(nestedTemplate, nestedContext));
// Output: "Welcome, Jane Doe!"

// Using JavaScript methods and functions
const complexTemplate = 'Filtered items: {items.filter(i => i > 2).join(", ")}';
const complexContext = { items: [1, 2, 3, 4, 5] };
console.log('\nUsing JavaScript methods:');
console.log(renderTemplateWithJS(complexTemplate, complexContext));
// Output: "Filtered items: 3, 4, 5"

// Conditional expressions
const conditionalTemplate = 'You are {age >= 18 ? "an adult" : "a minor"}.';
const conditionalContext = { age: 25 };
console.log('\nConditional expressions:');
console.log(renderTemplateWithJS(conditionalTemplate, conditionalContext));
// Output: "You are an adult."

// Complex transformations
const transformTemplate = 'Transformed data: {data.filter(item => item.active).map(item => item.name.toUpperCase()).join(" | ")}';
const transformContext = { 
  data: [
    { name: 'apple', active: true },
    { name: 'banana', active: false },
    { name: 'cherry', active: true },
    { name: 'date', active: true }
  ] 
};
console.log('\nComplex transformations:');
console.log(renderTemplateWithJS(transformTemplate, transformContext));
// Output: "Transformed data: APPLE | CHERRY | DATE"
