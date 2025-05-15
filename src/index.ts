/**
 * js-in-strings
 * A library for rendering templates with JavaScript expressions
 */

/**
 * Renders a template string with JavaScript expressions
 * 
 * @param template - The template string containing JavaScript expressions wrapped in {}
 * @param context - The context object containing values to be used in the template
 * @param options - Optional configuration options
 * @returns The rendered template with all expressions evaluated, or the raw evaluated expression if returnRawValues is true
 * 
 * @example
 * ```ts
 * // String template rendering
 * const template = "Hello, {name}! Your score is {Math.round(score)}.";
 * const context = { name: "John", score: 95.6 };
 * const result = renderTemplateWithJS(template, context);
 * // "Hello, John! Your score is 96."
 * 
 * // Raw value extraction
 * const data = renderTemplateWithJS("{items.filter(i => i > 2)}", { items: [1, 2, 3, 4, 5] }, { returnRawValues: true });
 * // Returns the actual array: [3, 4, 5]
 * ```
 */
export function renderTemplateWithJS<T = string>(
  template: string, 
  context: Record<string, any>, 
  options: { returnRawValues?: boolean } = {}
): T | string {
  // Regular expression to match JavaScript expressions within {}
  const expressionRegex = /\{([^{}]*?)\}/g;
  
  // If the template is a single expression and returnRawValues is true, return the raw value
  if (options.returnRawValues) {
    const trimmedTemplate = template.trim();
    const match = trimmedTemplate.match(/^\{([\s\S]*?)\}$/);
    if (match) {
      try {
        const expression = match[1];
        const contextKeys = Object.keys(context);
        const contextValues = Object.values(context);
        
        // Check if the expression contains multiple statements or return statement
        const hasMultipleStatements = expression.includes(';');
        const hasReturnStatement = /\breturn\b/.test(expression);
        
        let evaluator;
        if (hasMultipleStatements || hasReturnStatement) {
          // For complex expressions with multiple statements or explicit return
          evaluator = new Function(...contextKeys, expression.includes('return') ? expression : `return (${expression});`);
        } else {
          // For simple expressions
          evaluator = new Function(...contextKeys, `return (${expression});`);
        }
        
        return evaluator(...contextValues) as T;
      } catch (error) {
        console.error(`Error evaluating expression:`, error);
        return `[Error: ${error instanceof Error ? error.message : String(error)}]` as any;
      }
    }
  }
  
  // Replace each matched expression with its evaluated result
  return template.replace(expressionRegex, (match, expression) => {
    try {
      // Create a function that evaluates the expression within the context
      const contextKeys = Object.keys(context);
      const contextValues = Object.values(context);
      
      // Create a new function with the context variables as parameters
      // and the expression as the function body
      const evaluator = new Function(...contextKeys, `return (${expression});`);
      
      // Execute the function with the context values
      const result = evaluator(...contextValues);
      
      // Handle undefined and null values
      if (result === undefined || result === null) {
        return '';
      }
      
      // Convert the result to string for template rendering
      return String(result);
    } catch (error) {
      // Return an error message if evaluation fails
      console.error(`Error evaluating expression "${expression}":`, error);
      return `[Error: ${error instanceof Error ? error.message : String(error)}]`;
    }
  });
}
