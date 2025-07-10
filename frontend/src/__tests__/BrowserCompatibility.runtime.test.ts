import { ConsoleErrorMonitor, TypeScriptRuntimeTester } from '../utils/runtime-error-tester';

/**
 * Browser Compatibility Tests for TypeScript Compiled Code
 * Tests various browser features and TypeScript compilation targets
 */
describe('Browser Compatibility - TypeScript Runtime Tests', () => {
  let runtimeTester: TypeScriptRuntimeTester;
  let errorMonitor: ConsoleErrorMonitor;

  beforeEach(() => {
    runtimeTester = new TypeScriptRuntimeTester();
    errorMonitor = new ConsoleErrorMonitor();
  });

  afterEach(() => {
    errorMonitor.stop();
  });

  describe('JavaScript Feature Compatibility', () => {
    test('should handle ES6+ features that TypeScript compiles to', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          // Test features commonly used in TypeScript
          
          // 1. Arrow functions
          const arrow = (x: number, y: number) => x + y;
          
          // 2. Template literals
          const template = `Result: ${arrow(5, 3)}`;
          
          // 3. Destructuring
          const obj = { a: 1, b: 2, c: 3 };
          const { a, b, ...rest } = obj;
          
          // 4. Spread operator
          const arr1 = [1, 2, 3];
          const arr2 = [...arr1, 4, 5];
          
          // 5. Default parameters
          const withDefaults = (x: number = 10, y: string = 'default') => ({ x, y });
          
          // 6. Let/const
          let mutableVar = 'initial';
          const immutableVar = 'constant';
          mutableVar = 'changed';
          
          // 7. For...of loops
          const collected = [];
          for (const item of arr2) {
            collected.push(item * 2);
          }
          
          // 8. Map and Set
          const map = new Map([['key1', 'value1'], ['key2', 'value2']]);
          const set = new Set([1, 2, 3, 2, 1]); // Duplicates removed
          
          return {
            arrowResult: arrow(10, 20),
            template,
            destructured: { a, b, rest },
            spread: arr2,
            defaults: withDefaults(),
            variables: { mutableVar, immutableVar },
            collected,
            mapSize: map.size,
            setSize: set.size
          };
        },
        'ES6Features'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.arrowResult).toBe(30);
      expect(result.testResult.template).toBe('Result: 8');
      expect(result.testResult.spread).toEqual([1, 2, 3, 4, 5]);
      expect(result.testResult.setSize).toBe(3); // Duplicates removed
    });

    test('should handle modern JavaScript APIs', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          // Test modern APIs that TypeScript might use
          
          // 1. Promise-based APIs
          const promiseResult = await new Promise(resolve => {
            setTimeout(() => resolve('async-result'), 10);
          });
          
          // 2. Object.assign
          const merged = Object.assign({}, { a: 1 }, { b: 2 });
          
          // 3. Object.keys, Object.values, Object.entries
          const obj = { x: 10, y: 20 };
          const keys = Object.keys(obj);
          const values = Object.values(obj);
          const entries = Object.entries(obj);
          
          // 4. Array methods
          const numbers = [1, 2, 3, 4, 5];
          const doubled = numbers.map(n => n * 2);
          const filtered = numbers.filter(n => n > 2);
          const reduced = numbers.reduce((sum, n) => sum + n, 0);
          const found = numbers.find(n => n > 3);
          
          // 5. String methods
          const str = 'Hello TypeScript';
          const includes = str.includes('Type');
          const startsWith = str.startsWith('Hello');
          const endsWith = str.endsWith('Script');
          
          // 6. JSON operations
          const jsonStr = JSON.stringify({ test: 'data' });
          const parsed = JSON.parse(jsonStr);
          
          return {
            promiseResult,
            merged,
            objectOps: { keys, values, entries },
            arrayOps: { doubled, filtered, reduced, found },
            stringOps: { includes, startsWith, endsWith },
            jsonOps: { jsonStr, parsed }
          };
        },
        'ModernJSAPIs'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.promiseResult).toBe('async-result');
      expect(result.testResult.merged).toEqual({ a: 1, b: 2 });
      expect(result.testResult.arrayOps.doubled).toEqual([2, 4, 6, 8, 10]);
      expect(result.testResult.stringOps.includes).toBe(true);
    });

    test('should handle optional chaining and nullish coalescing', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          // TypeScript features that compile to different code in different targets
          
          interface TestObj {
            nested?: {
              value?: number;
              method?: () => string;
            };
          }
          
          const obj1: TestObj = { nested: { value: 42 } };
          const obj2: TestObj = {};
          const obj3: TestObj = { nested: {} };
          
          // Optional chaining
          const value1 = obj1.nested?.value;
          const value2 = obj2.nested?.value;
          const value3 = obj3.nested?.value;
          const method1 = obj1.nested?.method?.();
          
          // Nullish coalescing
          const default1 = value1 ?? 'default';
          const default2 = value2 ?? 'default';
          const default3 = null ?? 'null-default';
          const default4 = undefined ?? 'undefined-default';
          const default5 = 0 ?? 'zero-stays'; // 0 is falsy but not nullish
          const default6 = '' ?? 'empty-stays'; // empty string is falsy but not nullish
          
          return {
            optionalChaining: { value1, value2, value3, method1 },
            nullishCoalescing: { default1, default2, default3, default4, default5, default6 }
          };
        },
        'OptionalChainingNullishCoalescing'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.optionalChaining.value1).toBe(42);
      expect(result.testResult.optionalChaining.value2).toBeUndefined();
      expect(result.testResult.nullishCoalescing.default1).toBe(42);
      expect(result.testResult.nullishCoalescing.default2).toBe('default');
      expect(result.testResult.nullishCoalescing.default5).toBe(0); // Not nullish
    });
  });

  describe('TypeScript Compilation Target Compatibility', () => {
    test('should handle class syntax and inheritance', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          // Test class features that TypeScript compiles differently for different targets
          
          class BaseComponent {
            protected name: string;
            public version: number;
            
            constructor(name: string, version: number = 1) {
              this.name = name;
              this.version = version;
            }
            
            getName(): string {
              return this.name;
            }
            
            getVersion(): number {
              return this.version;
            }
          }
          
          class ExtendedComponent extends BaseComponent {
            private features: string[];
            
            constructor(name: string, features: string[] = []) {
              super(name, 2);
              this.features = features;
            }
            
            addFeature(feature: string): void {
              this.features.push(feature);
            }
            
            getFeatures(): string[] {
              return [...this.features];
            }
            
            // Override
            getName(): string {
              return `Extended-${super.getName()}`;
            }
          }
          
          const base = new BaseComponent('BaseComp');
          const extended = new ExtendedComponent('ExtComp', ['feature1']);
          extended.addFeature('feature2');
          
          return {
            baseInstance: {
              name: base.getName(),
              version: base.getVersion()
            },
            extendedInstance: {
              name: extended.getName(),
              version: extended.getVersion(),
              features: extended.getFeatures()
            },
            inheritance: extended instanceof BaseComponent
          };
        },
        'ClassSyntaxInheritance'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.baseInstance.name).toBe('BaseComp');
      expect(result.testResult.extendedInstance.name).toBe('Extended-ExtComp');
      expect(result.testResult.inheritance).toBe(true);
      expect(result.testResult.extendedInstance.features).toEqual(['feature1', 'feature2']);
    });

    test('should handle async/await compilation', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          // Test async/await features that compile differently
          
          const delay = (ms: number): Promise<string> => {
            return new Promise(resolve => {
              setTimeout(() => resolve(`Delayed ${ms}ms`), ms);
            });
          };
          
          const fetchData = async (id: number): Promise<{ id: number; data: string }> => {
            const result = await delay(10);
            return { id, data: result };
          };
          
          const processMultiple = async (ids: number[]): Promise<any[]> => {
            const promises = ids.map(id => fetchData(id));
            return Promise.all(promises);
          };
          
          // Test sequential async operations
          const sequential = [];
          for (const id of [1, 2]) {
            const data = await fetchData(id);
            sequential.push(data);
          }
          
          // Test parallel async operations
          const parallel = await processMultiple([3, 4, 5]);
          
          // Test error handling
          const errorHandling = async () => {
            try {
              await new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Async error')), 10);
              });
              return 'no error';
            } catch (error) {
              return 'caught error';
            }
          };
          
          const errorResult = await errorHandling();
          
          return {
            sequential,
            parallel,
            errorResult,
            allPromisesResolved: sequential.length === 2 && parallel.length === 3
          };
        },
        'AsyncAwaitHandling'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.sequential).toHaveLength(2);
      expect(result.testResult.parallel).toHaveLength(3);
      expect(result.testResult.errorResult).toBe('caught error');
      expect(result.testResult.allPromisesResolved).toBe(true);
    });

    test('should handle generator functions and iterators', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          // Test generator functions (if supported)
          function* numberGenerator(max: number): Generator<number, void, unknown> {
            for (let i = 0; i < max; i++) {
              yield i;
            }
          }
          
          function* fibonacciGenerator(): Generator<number, void, unknown> {
            let a = 0, b = 1;
            while (true) {
              yield a;
              [a, b] = [b, a + b];
            }
          }
          
          // Test iterator usage
          const numbers = [];
          for (const num of numberGenerator(5)) {
            numbers.push(num);
          }
          
          // Test manual iterator
          const fibGen = fibonacciGenerator();
          const fibNumbers = [];
          for (let i = 0; i < 6; i++) {
            fibNumbers.push(fibGen.next().value);
          }
          
          // Test with arrays
          const arrayIterator = [1, 2, 3][Symbol.iterator]();
          const iteratorResults = [];
          let result = arrayIterator.next();
          while (!result.done) {
            iteratorResults.push(result.value);
            result = arrayIterator.next();
          }
          
          return {
            generatedNumbers: numbers,
            fibonacciSequence: fibNumbers,
            iteratorResults,
            generatorSupported: typeof numberGenerator === 'function'
          };
        },
        'GeneratorIteratorSupport'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.generatedNumbers).toEqual([0, 1, 2, 3, 4]);
      expect(result.testResult.fibonacciSequence).toEqual([0, 1, 1, 2, 3, 5]);
      expect(result.testResult.iteratorResults).toEqual([1, 2, 3]);
    });
  });

  describe('TypeScript-specific Feature Tests', () => {
    test('should handle interface and type compatibility at runtime', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          // Test that TypeScript interfaces work properly at runtime
          interface User {
            id: number;
            name: string;
            email?: string;
            preferences: {
              theme: 'light' | 'dark';
              notifications: boolean;
            };
          }
          
          type UserUpdate = Partial<Pick<User, 'name' | 'email'>> & {
            updatedAt: Date;
          };
          
          const createUser = (userData: Omit<User, 'id'>): User => {
            return {
              id: Math.floor(Math.random() * 1000),
              ...userData
            };
          };
          
          const updateUser = (user: User, update: UserUpdate): User => {
            return {
              ...user,
              ...update,
              preferences: { ...user.preferences }
            };
          };
          
          // Test usage
          const user = createUser({
            name: 'Test User',
            email: 'test@example.com',
            preferences: {
              theme: 'dark',
              notifications: true
            }
          });
          
          const updatedUser = updateUser(user, {
            name: 'Updated User',
            updatedAt: new Date()
          });
          
          return {
            originalUser: {
              hasId: typeof user.id === 'number',
              hasName: typeof user.name === 'string',
              hasPreferences: typeof user.preferences === 'object'
            },
            updatedUser: {
              nameChanged: updatedUser.name !== user.name,
              idPreserved: updatedUser.id === user.id,
              hasUpdatedAt: updatedUser.updatedAt instanceof Date
            },
            typeOperationsWork: true
          };
        },
        'TypeScriptInterfaceCompatibility'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.originalUser.hasId).toBe(true);
      expect(result.testResult.updatedUser.nameChanged).toBe(true);
      expect(result.testResult.updatedUser.idPreserved).toBe(true);
    });

    test('should handle enum compilation and usage', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          // Test different enum types
          enum StringEnum {
            VALUE1 = 'value1',
            VALUE2 = 'value2',
            VALUE3 = 'value3'
          }
          
          enum NumericEnum {
            FIRST,
            SECOND,
            THIRD = 10,
            FOURTH
          }
          
          const stringEnumUsage = {
            value: StringEnum.VALUE1,
            keys: Object.keys(StringEnum),
            values: Object.values(StringEnum),
            reverse: StringEnum['value2'] as any
          };
          
          const numericEnumUsage = {
            value: NumericEnum.FIRST,
            third: NumericEnum.THIRD,
            fourth: NumericEnum.FOURTH,
            reverseNumeric: NumericEnum[0],
            reverseString: NumericEnum['SECOND']
          };
          
          return {
            stringEnum: stringEnumUsage,
            numericEnum: numericEnumUsage,
            enumsWork: StringEnum.VALUE1 === 'value1' && NumericEnum.FIRST === 0
          };
        },
        'EnumCompilationUsage'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.enumsWork).toBe(true);
      expect(result.testResult.stringEnum.value).toBe('value1');
      expect(result.testResult.numericEnum.value).toBe(0);
      expect(result.testResult.numericEnum.fourth).toBe(11); // THIRD = 10, so FOURTH = 11
    });

    test('should handle generic types at runtime', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          // Test generic functions and classes
          function identity<T>(arg: T): T {
            return arg;
          }
          
          function arrayProcessor<T>(
            items: T[],
            processor: (item: T) => T
          ): T[] {
            return items.map(processor);
          }
          
          class Container<T> {
            private value: T;
            
            constructor(value: T) {
              this.value = value;
            }
            
            getValue(): T {
              return this.value;
            }
            
            setValue(value: T): void {
              this.value = value;
            }
          }
          
          // Test usage with different types
          const numberIdentity = identity(42);
          const stringIdentity = identity('hello');
          const objectIdentity = identity({ key: 'value' });
          
          const numbers = arrayProcessor([1, 2, 3], x => x * 2);
          const strings = arrayProcessor(['a', 'b', 'c'], x => x.toUpperCase());
          
          const numberContainer = new Container(100);
          const stringContainer = new Container('container');
          
          return {
            identities: {
              number: numberIdentity,
              string: stringIdentity,
              object: objectIdentity
            },
            processed: {
              numbers,
              strings
            },
            containers: {
              numberValue: numberContainer.getValue(),
              stringValue: stringContainer.getValue()
            },
            genericsWork: true
          };
        },
        'GenericTypesRuntime'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.identities.number).toBe(42);
      expect(result.testResult.processed.numbers).toEqual([2, 4, 6]);
      expect(result.testResult.processed.strings).toEqual(['A', 'B', 'C']);
      expect(result.testResult.containers.numberValue).toBe(100);
    });
  });

  describe('Performance and Memory Tests', () => {
    test('should handle TypeScript-compiled code performance', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const startTime = performance.now();
          
          // Simulate TypeScript-heavy operations
          interface DataPoint {
            id: number;
            value: number;
            metadata: {
              timestamp: Date;
              category: string;
            };
          }
          
          const generateData = (count: number): DataPoint[] => {
            return Array.from({ length: count }, (_, i) => ({
              id: i,
              value: Math.random() * 100,
              metadata: {
                timestamp: new Date(),
                category: `category-${i % 5}`
              }
            }));
          };
          
          const processData = (data: DataPoint[]): {
            byCategory: Record<string, DataPoint[]>;
            averageValue: number;
            totalCount: number;
          } => {
            const byCategory: Record<string, DataPoint[]> = {};
            let totalValue = 0;
            
            for (const point of data) {
              const category = point.metadata.category;
              if (!byCategory[category]) {
                byCategory[category] = [];
              }
              byCategory[category].push(point);
              totalValue += point.value;
            }
            
            return {
              byCategory,
              averageValue: totalValue / data.length,
              totalCount: data.length
            };
          };
          
          // Process data
          const data = generateData(1000);
          const processed = processData(data);
          
          const endTime = performance.now();
          const processingTime = endTime - startTime;
          
          return {
            dataSize: data.length,
            categoryCount: Object.keys(processed.byCategory).length,
            averageValue: processed.averageValue,
            processingTime,
            performanceAcceptable: processingTime < 100 // Should be fast
          };
        },
        'TypeScriptPerformance'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.dataSize).toBe(1000);
      expect(result.testResult.categoryCount).toBe(5);
      expect(result.testResult.performanceAcceptable).toBe(true);
    });
  });
});