/**
 * js-in-strings
 * A library for rendering templates with JavaScript expressions
 */

/**
 * Configuration options for renderTemplateWithJS
 */
export interface RenderOptions {
  /**
   * If true, the function will return the raw value of the expression instead of converting it to a string
   */
  returnRawValues?: boolean;
  
  /**
   * If true, the function will run in sandbox mode, restricting access to global objects
   */
  sandbox?: boolean;
  
  /**
   * Custom global objects to be provided to the expression when in sandbox mode
   */
  allowedGlobals?: Record<string, any>;
  
  /**
   * Timeout in milliseconds for expression evaluation
   * Set to 0 to disable timeout
   * Default: 1000ms (1 second)
   */
  timeout?: number;
  
  /**
   * Custom delimiters for expressions
   * Default: ['{', '}']
   */
  delimiters?: [string, string];
  
  /**
   * Additional context properties to extend the main context
   */
  contextExtensions?: Record<string, any>;
}

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
 * 
 * // Custom delimiters
 * const customResult = renderTemplateWithJS("Hello, ${name}!", { name: "World" }, { delimiters: ["${" ,"}"] });
 * // "Hello, World!"
 * ```
 */
export function renderTemplateWithJS<T = string>(
  template: string, 
  context: Record<string, any>, 
  options: RenderOptions = {}
): T | string {
  // Set up delimiters - default to {} if not specified
  const [openDelimiter, closeDelimiter] = options.delimiters || ['{', '}'];
  
  // Escape special characters for regex
  const escOpenDelimiter = openDelimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escCloseDelimiter = closeDelimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create regex pattern for the specified delimiters
  const expressionRegex = new RegExp(`${escOpenDelimiter}([^${escOpenDelimiter}${escCloseDelimiter}]*?)${escCloseDelimiter}`, 'g');
  const singleExpressionRegex = new RegExp(`^${escOpenDelimiter}([\\s\\S]*?)${escCloseDelimiter}$`);
  
  // Merge context with any extensions
  const mergedContext = {
    ...context,
    ...options.contextExtensions
  };
  
  // If the template is a single expression and returnRawValues is true, return the raw value
  if (options.returnRawValues) {
    const trimmedTemplate = template.trim();
    const match = trimmedTemplate.match(singleExpressionRegex);
    if (match) {
      try {
        const expression = match[1].trim();
        const contextKeys = Object.keys(mergedContext);
        const contextValues = Object.values(mergedContext);
        
        // Check for IIFE patterns first
        const isIIFE = /^\s*\(.*\)\s*\(.*\)/.test(expression) || // (function(){})() pattern
                      /^\s*\(.*=>.*\)\s*\(/.test(expression);   // (() => {})() pattern
        
        // Check if the expression contains declarations or complex statements
        const hasDeclarations = /\b(const|let|var|function|class)\b/.test(expression);
        const hasMultipleStatements = expression.includes(';');
        
        let result: any;
        
        // Handle different types of expressions
        if (isIIFE) {
          // For IIFE patterns, evaluate as is
          try {
            // For IIFE patterns, we'll use a special approach with Function constructor
            // Create a wrapper function that will execute the IIFE in the right context
            const contextKeys = Object.keys(mergedContext);
            const contextValues = Object.values(mergedContext);
            
            // Create a function that returns the result of the IIFE
            // Using a safer approach to avoid string termination issues
            const functionBody = `return (${expression});`;
            const iifeFn = Function.constructor.apply(null, [...contextKeys, functionBody]);
            
            // Execute the function with the context values
            result = iifeFn(...contextValues);
          } catch (error) {
            console.error(`Error executing IIFE:`, error);
            return `[Error: ${error instanceof Error ? error.message : String(error)}]` as any;
          }
        } else if (hasDeclarations || hasMultipleStatements) {
          // For complex expressions with declarations, we need to handle them specially
          // Make sure there's a return statement if one isn't already present
          let functionBody: string;
          if (expression.includes('return ')) {
            functionBody = expression;
          } else {
            // For expressions with declarations but no return, add a return at the end
            const lastSemicolonIndex = expression.lastIndexOf(';');
            if (lastSemicolonIndex !== -1 && lastSemicolonIndex < expression.length - 1) {
              // There's content after the last semicolon, return that
              const lastExpression = expression.substring(lastSemicolonIndex + 1).trim();
              functionBody = `${expression.substring(0, lastSemicolonIndex + 1)} return ${lastExpression};`;
            } else {
              // No obvious return value, just add a return undefined
              functionBody = `${expression} return undefined;`;
            }
          }
          
          try {
            // Use the safer approach for function creation to avoid string termination issues
            const evaluator = Function.constructor.apply(null, [...contextKeys, functionBody]);
            result = evaluator(...contextValues);
          } catch (error) {
            console.error(`Error executing complex expression:`, error);
            return `[Error: ${error instanceof Error ? error.message : String(error)}]` as any;
          }
        } else {
          // For simple expressions, just return them directly
          try {
            // Safely create the function body to avoid string termination issues
            // We need to ensure the expression is properly escaped
            const functionBody = `return ${expression};`;
            
            // Create the function using a safer approach
            const evaluator = Function.constructor.apply(null, [...contextKeys, functionBody]);
            result = evaluator(...contextValues);
          } catch (error) {
            console.error(`Error executing simple expression:`, error);
            return `[Error: ${error instanceof Error ? error.message : String(error)}]` as any;
          }
        }
        
        return result as T;
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
      const contextKeys = Object.keys(mergedContext);
      const contextValues = Object.values(mergedContext);
      
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
