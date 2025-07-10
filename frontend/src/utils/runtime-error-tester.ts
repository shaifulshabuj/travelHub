import { ComponentDNA } from '../dna/component-dna.interface';

/**
 * Console Error Monitor - Captures and reports runtime console errors
 */
export class ConsoleErrorMonitor {
  private errors: ConsoleError[] = [];
  private warnings: ConsoleWarning[] = [];
  private originalConsoleError: typeof console.error;
  private originalConsoleWarn: typeof console.warn;

  constructor() {
    this.originalConsoleError = console.error;
    this.originalConsoleWarn = console.warn;
  }

  start() {
    this.errors = [];
    this.warnings = [];

    // Override console.error to capture errors
    console.error = (...args: any[]) => {
      this.errors.push({
        timestamp: new Date(),
        message: args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' '),
        stack: new Error().stack,
        args: args
      });
      this.originalConsoleError.apply(console, args);
    };

    // Override console.warn to capture warnings
    console.warn = (...args: any[]) => {
      this.warnings.push({
        timestamp: new Date(),
        message: args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' '),
        args: args
      });
      this.originalConsoleWarn.apply(console, args);
    };
  }

  stop() {
    console.error = this.originalConsoleError;
    console.warn = this.originalConsoleWarn;
  }

  getErrors(): ConsoleError[] {
    return [...this.errors];
  }

  getWarnings(): ConsoleWarning[] {
    return [...this.warnings];
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  hasWarnings(): boolean {
    return this.warnings.length > 0;
  }

  clear() {
    this.errors = [];
    this.warnings = [];
  }

  generateReport(): ErrorReport {
    return {
      timestamp: new Date(),
      errorCount: this.errors.length,
      warningCount: this.warnings.length,
      errors: this.getErrors(),
      warnings: this.getWarnings(),
      summary: this.generateSummary()
    };
  }

  private generateSummary(): string {
    const errorCount = this.errors.length;
    const warningCount = this.warnings.length;
    
    if (errorCount === 0 && warningCount === 0) {
      return 'No runtime errors or warnings detected';
    }

    const parts = [];
    if (errorCount > 0) {
      parts.push(`${errorCount} error${errorCount > 1 ? 's' : ''}`);
    }
    if (warningCount > 0) {
      parts.push(`${warningCount} warning${warningCount > 1 ? 's' : ''}`);
    }

    return `Runtime issues detected: ${parts.join(' and ')}`;
  }
}

/**
 * TypeScript Runtime Error Tester - Tests TypeScript modules for runtime errors
 */
export class TypeScriptRuntimeTester {
  private errorMonitor: ConsoleErrorMonitor;

  constructor() {
    this.errorMonitor = new ConsoleErrorMonitor();
  }

  /**
   * Test TypeScript interface compliance at runtime
   */
  async testInterfaceCompliance<T>(
    data: any,
    interfaceName: string,
    validator?: (data: any) => boolean
  ): Promise<RuntimeTestResult> {
    this.errorMonitor.start();
    const startTime = performance.now();

    try {
      // Basic type checking
      if (validator && !validator(data)) {
        throw new Error(`Data does not comply with ${interfaceName} interface`);
      }

      // Try to use the data as if it were the expected type
      const testResult = await this.performInterfaceOperations(data, interfaceName);
      
      const endTime = performance.now();
      this.errorMonitor.stop();

      return {
        success: !this.errorMonitor.hasErrors(),
        interfaceName,
        executionTime: endTime - startTime,
        errorReport: this.errorMonitor.generateReport(),
        testResult
      };
    } catch (error) {
      const endTime = performance.now();
      this.errorMonitor.stop();

      return {
        success: false,
        interfaceName,
        executionTime: endTime - startTime,
        errorReport: this.errorMonitor.generateReport(),
        runtimeError: error instanceof Error ? error : new Error(String(error))
      };
    }
  }

  /**
   * Test async operations for runtime errors
   */
  async testAsyncOperations(
    operation: () => Promise<any>,
    operationName: string
  ): Promise<RuntimeTestResult> {
    this.errorMonitor.start();
    const startTime = performance.now();

    try {
      const result = await operation();
      const endTime = performance.now();
      this.errorMonitor.stop();

      return {
        success: !this.errorMonitor.hasErrors(),
        interfaceName: operationName,
        executionTime: endTime - startTime,
        errorReport: this.errorMonitor.generateReport(),
        testResult: result
      };
    } catch (error) {
      const endTime = performance.now();
      this.errorMonitor.stop();

      return {
        success: false,
        interfaceName: operationName,
        executionTime: endTime - startTime,
        errorReport: this.errorMonitor.generateReport(),
        runtimeError: error instanceof Error ? error : new Error(String(error))
      };
    }
  }

  /**
   * Test component rendering for runtime errors
   */
  async testComponentRendering(
    renderFunction: () => void,
    componentName: string
  ): Promise<RuntimeTestResult> {
    this.errorMonitor.start();
    const startTime = performance.now();

    try {
      renderFunction();
      
      // Wait a bit for any async rendering errors
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const endTime = performance.now();
      this.errorMonitor.stop();

      return {
        success: !this.errorMonitor.hasErrors(),
        interfaceName: componentName,
        executionTime: endTime - startTime,
        errorReport: this.errorMonitor.generateReport()
      };
    } catch (error) {
      const endTime = performance.now();
      this.errorMonitor.stop();

      return {
        success: false,
        interfaceName: componentName,
        executionTime: endTime - startTime,
        errorReport: this.errorMonitor.generateReport(),
        runtimeError: error instanceof Error ? error : new Error(String(error))
      };
    }
  }

  private async performInterfaceOperations(data: any, interfaceName: string): Promise<any> {
    // Perform common operations that might fail with type mismatches
    switch (interfaceName) {
      case 'ComponentDNA':
        return this.testComponentDNAOperations(data as ComponentDNA);
      default:
        // Generic operations
        JSON.stringify(data);
        Object.keys(data);
        return data;
    }
  }

  private async testComponentDNAOperations(dna: ComponentDNA): Promise<any> {
    // Test operations that might fail with invalid ComponentDNA
    const componentId = dna.componentId.toString();
    const generation = dna.generation + 1;
    const dependencies = [...dna.dependencies.components];
    
    // Test nested object access
    const performance = dna.performance.renderTime;
    const webVitals = dna.performance.coreWebVitals.largestContentfulPaint;
    
    return {
      componentId,
      generation,
      dependencies,
      performance,
      webVitals
    };
  }
}

export interface ConsoleError {
  timestamp: Date;
  message: string;
  stack?: string;
  args: any[];
}

export interface ConsoleWarning {
  timestamp: Date;
  message: string;
  args: any[];
}

export interface ErrorReport {
  timestamp: Date;
  errorCount: number;
  warningCount: number;
  errors: ConsoleError[];
  warnings: ConsoleWarning[];
  summary: string;
}

export interface RuntimeTestResult {
  success: boolean;
  interfaceName: string;
  executionTime: number;
  errorReport: ErrorReport;
  testResult?: any;
  runtimeError?: Error;
}