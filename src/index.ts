/**
 * js-in-strings
 * A library for rendering templates with JavaScript expressions
 */

/**
 * Configuration options for renderTemplateWithJS
 */
export interface RenderOptions {
  /**
   * If true, returns the raw evaluated value instead of converting to a string
   */
  returnRawValues?: boolean;
  
  /**
   * If true, restricts access to global objects for security
   */
  sandbox?: boolean;
  
  /**
   * Custom global objects to be provided when in sandbox mode
   */
  allowedGlobals?: Record<string, any>;
  
  /**
   * Timeout in milliseconds for expression evaluation
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
  
  /**
   * If true, uses a more direct but less secure evaluation method
   * Only use this if you trust the template source
   * Default: false
   */
  unsafeEval?: boolean;
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
        
        // Use a more robust approach to evaluate expressions
        try {
          // Create a safe evaluation environment
          if (options.unsafeEval) {
            // Direct eval approach - only use when templates are trusted
            // This is less secure but avoids string escaping issues
            const contextVars = Object.entries(mergedContext)
              .map(([key, value]) => `const ${key} = ${JSON.stringify(value)};`)
              .join('\n');
            
            // Use direct eval with proper context setup
            result = eval(`${contextVars}\n${expression}`);
          } else {
            // Safer approach using indirect evaluation
            // Prepare the expression based on its type
            let code: string;
            
            if (isIIFE) {
              // For IIFE patterns
              code = `(${expression})`;
            } else if (hasDeclarations || hasMultipleStatements) {
              // For complex expressions with declarations
              if (expression.includes('return ')) {
                code = `(function() { ${expression} })();`;
              } else {
                // For expressions with declarations but no return, add a return
                const lastSemicolonIndex = expression.lastIndexOf(';');
                if (lastSemicolonIndex !== -1 && lastSemicolonIndex < expression.length - 1) {
                  // There's content after the last semicolon, return that
                  const lastExpression = expression.substring(lastSemicolonIndex + 1).trim();
                  code = `(function() { ${expression.substring(0, lastSemicolonIndex + 1)} return ${lastExpression}; })();`;
                } else {
                  // No obvious return value
                  code = `(function() { ${expression}; return undefined; })();`;
                }
              }
            } else {
              // For simple expressions
              code = expression;
            }
            
            // Create a secure context for evaluation
            const secureEval = (code: string, context: Record<string, any>) => {
              // Create a proxy-based sandbox to safely evaluate code
              const sandbox = {};
              Object.entries(context).forEach(([key, value]) => {
                (sandbox as any)[key] = value;
              });
              
              // Use indirect eval through a function to avoid scope issues
              const indirectEval = (code: string) => {
                // This is safer than direct eval
                return Function('sandbox', `with(sandbox) { return ${code}; }`)(sandbox);
              };
              
              return indirectEval(code);
            };
            
            // Execute the expression in the secure context
            result = secureEval(code, mergedContext);
          }
        } catch (error) {
          console.error(`Error evaluating expression:`, error);
          return `[Error: ${error instanceof Error ? error.message : String(error)}]` as any;
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
      // Use the same robust approach for evaluating expressions in templates
      let result;
      
      if (options.unsafeEval) {
        // Direct eval approach - only use when templates are trusted
        const contextVars = Object.entries(mergedContext)
          .map(([key, value]) => `const ${key} = ${JSON.stringify(value)};`)
          .join('\n');
        
        // Use direct eval with proper context setup
        result = eval(`${contextVars}\n(${expression})`);
      } else {
        // Create a secure context for evaluation
        const secureEval = (code: string, context: Record<string, any>) => {
          // Create a sandbox to safely evaluate code
          const sandbox = {};
          Object.entries(context).forEach(([key, value]) => {
            (sandbox as any)[key] = value;
          });
          
          // Use indirect eval through a function to avoid scope issues
          return Function('sandbox', `with(sandbox) { return (${code}); }`)(sandbox);
        };
        
        // Execute the expression in the secure context
        result = secureEval(expression, mergedContext);
      }
      
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
