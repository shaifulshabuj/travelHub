import { ComponentDNA, EvolutionStep, ComponentFitnessRecord, CoreWebVitals } from '../dna/component-dna.interface';
import { TypeScriptRuntimeTester, ConsoleErrorMonitor } from '../utils/runtime-error-tester';

describe('ComponentDNA Interface - TypeScript Runtime Error Tests', () => {
  let runtimeTester: TypeScriptRuntimeTester;
  let errorMonitor: ConsoleErrorMonitor;

  beforeEach(() => {
    runtimeTester = new TypeScriptRuntimeTester();
    errorMonitor = new ConsoleErrorMonitor();
  });

  afterEach(() => {
    errorMonitor.stop();
  });

  describe('ComponentDNA Interface Compliance Tests', () => {
    const createValidComponentDNA = (): ComponentDNA => ({
      componentId: 'flight-search-001',
      componentType: 'Component',
      version: '1.0.0',
      generation: 1,
      uiFramework: 'React',
      stylingApproach: 'TailwindCSS',
      responsiveStrategy: 'MobileFirst',
      stateManagement: {
        local: 'useState',
        global: 'Zustand',
        server: 'ReactQuery'
      },
      userInteraction: {
        formHandling: 'ReactHookForm',
        validation: 'Zod',
        navigation: 'ReactRouter'
      },
      optimization: {
        lazyLoading: true,
        memoization: true,
        virtualization: false,
        codesplitting: true,
        prefetching: false,
        serviceWorker: true
      },
      a11y: {
        semanticHTML: true,
        ariaLabels: true,
        keyboardNavigation: true,
        screenReaderSupport: true,
        colorContrast: true,
        focusManagement: true
      },
      i18n: {
        supported: false,
        rtlSupport: false,
        dateLocalization: false,
        numberFormatting: false,
        pluralization: false
      },
      adaptationTraits: {
        themeable: true,
        customizable: true,
        extensible: true,
        configurable: true,
        responsive: true
      },
      performance: {
        renderTime: 120,
        bundleSize: 45,
        accessibilityScore: 95,
        lighthouseScore: 88,
        coreWebVitals: {
          largestContentfulPaint: 1200,
          firstInputDelay: 50,
          cumulativeLayoutShift: 0.05
        }
      },
      userExperience: {
        usabilityScore: 92,
        satisfactionRating: 4.5,
        taskCompletionRate: 0.95,
        errorRate: 0.02,
        learnabilityScore: 88
      },
      dependencies: {
        components: ['SearchForm', 'ResultList'],
        hooks: ['useFlightSearch', 'useBooking'],
        services: ['FlightService', 'BookingService'],
        utilities: ['dateUtils', 'validationUtils'],
        libraries: ['react', 'react-router-dom', 'zod']
      },
      parentComponents: [],
      evolutionPath: [],
      fitnessHistory: [],
      testing: {
        unitTestCoverage: 85,
        integrationTests: true,
        e2eTests: true,
        visualRegressionTests: false,
        accessibilityTests: true
      }
    });

    test('should handle valid ComponentDNA without runtime errors', async () => {
      const validDNA = createValidComponentDNA();
      
      const result = await runtimeTester.testInterfaceCompliance(
        validDNA,
        'ComponentDNA',
        (data: ComponentDNA) => {
          return (
            typeof data.componentId === 'string' &&
            typeof data.generation === 'number' &&
            data.generation >= 0 &&
            typeof data.performance.renderTime === 'number' &&
            typeof data.performance.coreWebVitals.largestContentfulPaint === 'number' &&
            Array.isArray(data.dependencies.components)
          );
        }
      );

      expect(result.success).toBe(true);
      expect(result.errorReport.errorCount).toBe(0);
      expect(result.testResult.componentId).toBe('flight-search-001');
      expect(result.testResult.generation).toBe(2); // Should be incremented
    });

    test('should detect type mismatches in ComponentDNA', async () => {
      const invalidDNA: any = {
        componentId: 123, // Should be string
        componentType: 'InvalidType', // Invalid enum value
        version: null, // Should be string
        generation: '1', // Should be number
        performance: {
          renderTime: 'slow', // Should be number
          coreWebVitals: {
            largestContentfulPaint: 'very slow' // Should be number
          }
        },
        dependencies: {
          components: 'not an array' // Should be array
        }
      };

      const result = await runtimeTester.testInterfaceCompliance(
        invalidDNA,
        'ComponentDNA',
        (data: ComponentDNA) => {
          return (
            typeof data.componentId === 'string' &&
            typeof data.generation === 'number' &&
            data.generation >= 0 &&
            typeof data.performance.renderTime === 'number' &&
            Array.isArray(data.dependencies.components)
          );
        }
      );

      expect(result.success).toBe(false);
      expect(result.runtimeError).toBeDefined();
    });

    test('should handle nested object access safely', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const dna = createValidComponentDNA();
          
          // Test deep nested access
          const webVitals = dna.performance.coreWebVitals.largestContentfulPaint;
          const dependencies = dna.dependencies.components.length;
          const a11yFeatures = Object.keys(dna.a11y).filter(key => dna.a11y[key as keyof typeof dna.a11y]);
          
          // Test array operations
          const newComponents = [...dna.dependencies.components, 'NewComponent'];
          
          // Test object spread
          const updatedDNA = {
            ...dna,
            generation: dna.generation + 1,
            performance: {
              ...dna.performance,
              renderTime: dna.performance.renderTime * 1.1
            }
          };

          return {
            webVitals,
            dependencies,
            a11yFeatures,
            newComponents,
            updatedGeneration: updatedDNA.generation
          };
        },
        'ComponentDNANestedAccess'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.webVitals).toBe(1200);
      expect(result.testResult.dependencies).toBe(2);
      expect(result.testResult.updatedGeneration).toBe(2);
    });
  });

  describe('EvolutionStep Interface Tests', () => {
    test('should handle EvolutionStep objects correctly', async () => {
      const evolutionStep: EvolutionStep = {
        generation: 2,
        timestamp: new Date(),
        evolutionType: 'Mutation',
        trigger: 'performance_degradation',
        changes: [
          {
            property: 'optimization.memoization',
            oldValue: false,
            newValue: true,
            reason: 'Improve render performance'
          }
        ],
        fitnessImprovement: 0.15
      };

      const result = await runtimeTester.testInterfaceCompliance(
        evolutionStep,
        'EvolutionStep',
        (data: EvolutionStep) => {
          return (
            typeof data.generation === 'number' &&
            data.timestamp instanceof Date &&
            ['Inheritance', 'Mutation', 'Crossover', 'Selection'].includes(data.evolutionType) &&
            Array.isArray(data.changes) &&
            typeof data.fitnessImprovement === 'number'
          );
        }
      );

      expect(result.success).toBe(true);
      expect(result.errorReport.errorCount).toBe(0);
    });
  });

  describe('CoreWebVitals Interface Tests', () => {
    test('should validate CoreWebVitals metrics', async () => {
      const webVitals: CoreWebVitals = {
        largestContentfulPaint: 1500,
        firstInputDelay: 100,
        cumulativeLayoutShift: 0.1
      };

      const result = await runtimeTester.testAsyncOperations(
        async () => {
          // Simulate operations that might be performed on web vitals
          const isGoodLCP = webVitals.largestContentfulPaint <= 2500;
          const isGoodFID = webVitals.firstInputDelay <= 100;
          const isGoodCLS = webVitals.cumulativeLayoutShift <= 0.1;
          
          const overallScore = (
            (isGoodLCP ? 1 : 0) +
            (isGoodFID ? 1 : 0) +
            (isGoodCLS ? 1 : 0)
          ) / 3;

          return {
            isGoodLCP,
            isGoodFID,
            isGoodCLS,
            overallScore,
            grade: overallScore >= 0.8 ? 'Good' : overallScore >= 0.5 ? 'Needs Improvement' : 'Poor'
          };
        },
        'CoreWebVitalsCalculation'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.isGoodLCP).toBe(true);
      expect(result.testResult.isGoodFID).toBe(true);
      expect(result.testResult.isGoodCLS).toBe(true);
      expect(result.testResult.grade).toBe('Good');
    });

    test('should handle invalid CoreWebVitals values', async () => {
      const invalidWebVitals: any = {
        largestContentfulPaint: 'slow',
        firstInputDelay: null,
        cumulativeLayoutShift: -1
      };

      const result = await runtimeTester.testAsyncOperations(
        async () => {
          try {
            // These operations should cause issues with invalid types
            const calculation = invalidWebVitals.largestContentfulPaint * 2; // 'slow' * 2 = NaN
            const comparison = invalidWebVitals.firstInputDelay <= 100; // null <= 100 = true
            
            // Check if we got NaN (which indicates a type error)
            if (isNaN(calculation)) {
              throw new Error('Type conversion failed: got NaN from string multiplication');
            }
            
            return { calculation, comparison };
          } catch (error) {
            throw error;
          }
        },
        'InvalidCoreWebVitalsHandling'
      );

      expect(result.success).toBe(false);
      expect(result.runtimeError).toBeDefined();
    });
  });

  describe('Complex Genetic Operations Tests', () => {
    test('should handle DNA evolution operations without errors', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const parentDNA = createValidComponentDNA();
          
          // Simulate evolution operations
          const evolvedDNA: ComponentDNA = {
            ...parentDNA,
            generation: parentDNA.generation + 1,
            componentId: `${parentDNA.componentId}-evolved`,
            parentComponents: [...parentDNA.parentComponents, parentDNA.componentId],
            performance: {
              ...parentDNA.performance,
              renderTime: Math.max(parentDNA.performance.renderTime * 0.9, 50), // 10% improvement
              accessibilityScore: Math.min(parentDNA.performance.accessibilityScore + 2, 100)
            },
            evolutionPath: [
              ...parentDNA.evolutionPath,
              {
                generation: parentDNA.generation + 1,
                timestamp: new Date(),
                evolutionType: 'Mutation' as const,
                trigger: 'performance_optimization',
                changes: [
                  {
                    property: 'performance.renderTime',
                    oldValue: parentDNA.performance.renderTime,
                    newValue: parentDNA.performance.renderTime * 0.9,
                    reason: 'Optimize rendering pipeline'
                  }
                ],
                fitnessImprovement: 0.1
              }
            ]
          };

          // Validate the evolved DNA still conforms to interface
          const isValid = (
            typeof evolvedDNA.componentId === 'string' &&
            evolvedDNA.generation === parentDNA.generation + 1 &&
            evolvedDNA.parentComponents.includes(parentDNA.componentId) &&
            evolvedDNA.evolutionPath.length === 1
          );

          return { evolvedDNA, isValid };
        },
        'DNAEvolutionOperation'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.isValid).toBe(true);
      expect(result.testResult.evolvedDNA.generation).toBe(2);
    });

    test('should handle fitness calculation operations', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const dna = createValidComponentDNA();
          
          // Simulate fitness calculation
          const performanceScore = (
            (1 - Math.min(dna.performance.renderTime / 1000, 1)) * 0.3 +
            (dna.performance.accessibilityScore / 100) * 0.2 +
            (dna.performance.lighthouseScore / 100) * 0.2 +
            (dna.userExperience.usabilityScore / 100) * 0.3
          );

          const qualityScore = (
            (dna.testing.unitTestCoverage / 100) * 0.4 +
            (dna.testing.integrationTests ? 0.3 : 0) +
            (dna.testing.e2eTests ? 0.2 : 0) +
            (dna.testing.accessibilityTests ? 0.1 : 0)
          );

          const overallFitness = (performanceScore + qualityScore) / 2;

          const fitnessRecord: ComponentFitnessRecord = {
            timestamp: new Date(),
            generation: dna.generation,
            performanceScore: performanceScore * 100,
            accessibilityScore: dna.performance.accessibilityScore,
            usabilityScore: dna.userExperience.usabilityScore,
            maintainabilityScore: qualityScore * 100,
            overallFitness: overallFitness * 100
          };

          return { fitnessRecord, overallFitness };
        },
        'FitnessCalculation'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.overallFitness).toBeGreaterThan(0);
      expect(result.testResult.overallFitness).toBeLessThanOrEqual(1);
      expect(result.testResult.fitnessRecord.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('Memory and Performance Tests', () => {
    test('should handle large ComponentDNA objects efficiently', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const startTime = performance.now();
          
          // Create and process multiple large DNA objects
          const largePopulation: ComponentDNA[] = [];
          
          for (let i = 0; i < 100; i++) {
            const dna = createValidComponentDNA();
            dna.componentId = `component-${i}`;
            dna.generation = i;
            
            // Add large evolution history
            for (let j = 0; j < 10; j++) {
              dna.evolutionPath.push({
                generation: j,
                timestamp: new Date(),
                evolutionType: 'Mutation',
                trigger: `trigger-${j}`,
                changes: [{
                  property: 'performance.renderTime',
                  oldValue: 100 + j,
                  newValue: 95 + j,
                  reason: `Optimization step ${j}`
                }],
                fitnessImprovement: 0.01 * j
              });
            }
            
            largePopulation.push(dna);
          }
          
          // Process the population
          const processedPopulation = largePopulation.map(dna => ({
            id: dna.componentId,
            fitness: dna.performance.renderTime + dna.performance.accessibilityScore,
            generation: dna.generation
          }));
          
          const endTime = performance.now();
          const processingTime = endTime - startTime;
          
          return {
            populationSize: largePopulation.length,
            processingTime,
            averageFitness: processedPopulation.reduce((sum, p) => sum + p.fitness, 0) / processedPopulation.length
          };
        },
        'LargeDataProcessing'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.populationSize).toBe(100);
      expect(result.testResult.processingTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});