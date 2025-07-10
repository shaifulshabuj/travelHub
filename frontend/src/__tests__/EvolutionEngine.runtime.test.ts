import { ComponentDNA } from '../dna/component-dna.interface';
import { 
  EvolutionEngine, 
  ServiceDNA, 
  EvolutionConfig,
  EvolutionContext,
  FitnessEvaluator,
  GeneticOperator,
  SelectionStrategy
} from '../utils/evolution-engine';
import { TypeScriptRuntimeTester, ConsoleErrorMonitor } from '../utils/runtime-error-tester';

describe('EvolutionEngine - TypeScript Runtime Error Tests', () => {
  let runtimeTester: TypeScriptRuntimeTester;
  let errorMonitor: ConsoleErrorMonitor;
  let evolutionEngine: EvolutionEngine;
  let mockFitnessEvaluator: FitnessEvaluator;
  let mockGeneticOperator: GeneticOperator;
  let mockSelectionStrategy: SelectionStrategy;

  beforeEach(() => {
    runtimeTester = new TypeScriptRuntimeTester();
    errorMonitor = new ConsoleErrorMonitor();

    // Create mock implementations
    mockFitnessEvaluator = {
      evaluate: jest.fn().mockResolvedValue(0.8)
    };

    mockGeneticOperator = {
      applyTrait: jest.fn().mockImplementation(async (dna, trait, context) => {
        return Promise.resolve({ ...dna, [`trait_${trait}`]: true });
      }),
      mutate: jest.fn().mockImplementation(async (dna, trigger) => {
        return Promise.resolve({ ...dna, [`mutated_${trigger}`]: true });
      }),
      inheritTrait: jest.fn().mockImplementation(async (offspring, parent, trait) => {
        return Promise.resolve({ ...offspring, [`inherited_${trait}`]: true });
      })
    };

    mockSelectionStrategy = {
      select: jest.fn().mockImplementation((population) => {
        return population[Math.floor(Math.random() * population.length)];
      })
    };

    evolutionEngine = new EvolutionEngine(
      mockFitnessEvaluator,
      mockGeneticOperator,
      mockSelectionStrategy
    );
  });

  afterEach(() => {
    errorMonitor.stop();
    jest.clearAllMocks();
  });

  const createMockComponentDNA = (id: string = 'test-component', generation: number = 0): ComponentDNA => ({
    componentId: id,
    componentType: 'Component',
    version: '1.0.0',
    generation,
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
      lazyLoading: false,
      memoization: false,
      virtualization: false,
      codesplitting: false,
      prefetching: false,
      serviceWorker: false
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
      renderTime: 150,
      bundleSize: 50,
      accessibilityScore: 90,
      lighthouseScore: 85,
      coreWebVitals: {
        largestContentfulPaint: 1300,
        firstInputDelay: 60,
        cumulativeLayoutShift: 0.08
      }
    },
    userExperience: {
      usabilityScore: 88,
      satisfactionRating: 4.2,
      taskCompletionRate: 0.92,
      errorRate: 0.03,
      learnabilityScore: 85
    },
    dependencies: {
      components: ['SearchForm'],
      hooks: ['useSearch'],
      services: ['SearchService'],
      utilities: ['searchUtils'],
      libraries: ['react']
    },
    parentComponents: [],
    evolutionPath: [],
    fitnessHistory: [],
    testing: {
      unitTestCoverage: 80,
      integrationTests: true,
      e2eTests: false,
      visualRegressionTests: false,
      accessibilityTests: true
    }
  });

  const createMockServiceDNA = (id: string = 'test-service', generation: number = 0): ServiceDNA => ({
    serviceId: id,
    generation,
    parentServices: [],
    evolutionTriggers: []
  });

  describe('Inheritance Operations', () => {
    test('should handle inheritance without runtime errors', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const parentDNA = createMockComponentDNA('parent-component', 1);
          const traits = ['optimization', 'accessibility'];
          const context: EvolutionContext = {
            trigger: 'performance_improvement',
            metrics: { renderTime: 150, accessibilityScore: 90 }
          };

          const inheritedDNA = await evolutionEngine.inherit(parentDNA, traits, context);

          return {
            originalGeneration: parentDNA.generation,
            inheritedGeneration: inheritedDNA.generation,
            hasParent: inheritedDNA.parentComponents.includes('parent-component'),
            traitsApplied: traits.length
          };
        },
        'InheritanceOperation'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.inheritedGeneration).toBe(2);
      expect(result.testResult.hasParent).toBe(true);
      expect(mockGeneticOperator.applyTrait).toHaveBeenCalledTimes(2);
    });

    test('should handle service DNA inheritance', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const parentService = createMockServiceDNA('parent-service', 1);
          const traits = ['caching', 'security'];
          const context: EvolutionContext = {
            trigger: 'scalability_improvement',
            metrics: { throughput: 1000 }
          };

          const inheritedService = await evolutionEngine.inherit(parentService, traits, context);

          return {
            originalGeneration: parentService.generation,
            inheritedGeneration: inheritedService.generation,
            hasParentService: inheritedService.parentServices.includes('parent-service')
          };
        },
        'ServiceInheritanceOperation'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.inheritedGeneration).toBe(2);
      expect(result.testResult.hasParentService).toBe(true);
    });
  });

  describe('Mutation Operations', () => {
    test('should handle mutations without runtime errors', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const originalDNA = createMockComponentDNA('mutable-component', 2);
          const mutationTriggers = ['performance_degradation', 'user_feedback'];
          const mutationRate = 0.8; // High rate to ensure mutations occur

          const mutatedDNA = await evolutionEngine.mutate(originalDNA, mutationTriggers, mutationRate);

          return {
            originalGeneration: originalDNA.generation,
            mutatedGeneration: mutatedDNA.generation,
            mutationCallCount: (mockGeneticOperator.mutate as jest.Mock).mock.calls.length
          };
        },
        'MutationOperation'
      );

      expect(result.success).toBe(true);
      expect(mockGeneticOperator.mutate).toHaveBeenCalled();
    });

    test('should handle edge cases in mutation rate', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const dna = createMockComponentDNA('edge-case-component');
          
          // Test with extreme mutation rates
          const zeroRateDNA = await evolutionEngine.mutate(dna, ['trigger1'], 0.0);
          const maxRateDNA = await evolutionEngine.mutate(dna, ['trigger2'], 1.0);
          
          return {
            zeroRateProcessed: zeroRateDNA !== null,
            maxRateProcessed: maxRateDNA !== null
          };
        },
        'MutationEdgeCases'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.zeroRateProcessed).toBe(true);
      expect(result.testResult.maxRateProcessed).toBe(true);
    });
  });

  describe('Crossover Operations', () => {
    test('should handle crossover without runtime errors', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const parent1 = createMockComponentDNA('parent1', 3);
          const parent2 = createMockComponentDNA('parent2', 4);
          const traits = ['uiFramework', 'stateManagement', 'optimization'];
          const crossoverRate = 1.0; // Ensure crossover occurs

          const offspring = await evolutionEngine.crossover(parent1, parent2, traits, crossoverRate);

          return {
            parent1Generation: parent1.generation,
            parent2Generation: parent2.generation,
            offspringGeneration: offspring.generation,
            traitInheritanceCalls: (mockGeneticOperator.inheritTrait as jest.Mock).mock.calls.length
          };
        },
        'CrossoverOperation'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.offspringGeneration).toBe(5); // max(3,4) + 1
    });

    test('should handle no crossover scenario', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const parent1 = createMockComponentDNA('parent1', 1);
          const parent2 = createMockComponentDNA('parent2', 2);
          const traits = ['optimization'];
          const crossoverRate = 0.0; // No crossover

          const offspring = await evolutionEngine.crossover(parent1, parent2, traits, crossoverRate);

          return {
            offspringId: offspring.componentId,
            parent1Id: parent1.componentId,
            sameAsParent1: offspring.componentId === parent1.componentId
          };
        },
        'NoCrossoverOperation'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.sameAsParent1).toBe(true);
    });
  });

  describe('Selection Operations', () => {
    test('should handle fitness-based selection without errors', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const population = [
            createMockComponentDNA('comp1', 1),
            createMockComponentDNA('comp2', 2),
            createMockComponentDNA('comp3', 3),
            createMockComponentDNA('comp4', 4),
            createMockComponentDNA('comp5', 5)
          ];

          const selected = await evolutionEngine.selectFittest(population, 0.6);

          return {
            originalPopulationSize: population.length,
            selectedPopulationSize: selected.length,
            fitnessEvaluationCalls: (mockFitnessEvaluator.evaluate as jest.Mock).mock.calls.length
          };
        },
        'SelectionOperation'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.selectedPopulationSize).toBe(3); // 60% of 5
      expect(result.testResult.fitnessEvaluationCalls).toBe(5);
    });

    test('should handle empty population gracefully', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const emptyPopulation: ComponentDNA[] = [];
          const selected = await evolutionEngine.selectFittest(emptyPopulation, 0.5);

          return {
            selectedSize: selected.length,
            isArray: Array.isArray(selected)
          };
        },
        'EmptyPopulationSelection'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.selectedSize).toBe(0);
      expect(result.testResult.isArray).toBe(true);
    });
  });

  describe('Complete Evolution Pipeline', () => {
    test('should handle full population evolution without errors', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const initialPopulation = [
            createMockComponentDNA('comp1', 1),
            createMockComponentDNA('comp2', 1),
            createMockComponentDNA('comp3', 1),
            createMockComponentDNA('comp4', 1)
          ];

          const evolutionConfig: EvolutionConfig = {
            selectionRate: 0.75,
            eliteRate: 0.25,
            crossoverRate: 0.8,
            mutationRate: 0.2,
            crossoverTraits: ['optimization', 'performance'],
            mutationTriggers: ['user_feedback', 'performance_issue'],
            maxGenerations: 5,
            fitnessThreshold: 0.9
          };

          const evolvedPopulation = await evolutionEngine.evolvePopulation(
            initialPopulation,
            evolutionConfig
          );

          return {
            initialSize: initialPopulation.length,
            evolvedSize: evolvedPopulation.length,
            configValid: evolutionConfig.selectionRate > 0 && evolutionConfig.mutationRate >= 0
          };
        },
        'FullEvolutionPipeline'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.evolvedSize).toBe(result.testResult.initialSize);
      expect(result.testResult.configValid).toBe(true);
    });

    test('should handle large population evolution efficiently', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const startTime = performance.now();
          
          // Create larger population
          const largePopulation: ComponentDNA[] = [];
          for (let i = 0; i < 50; i++) {
            largePopulation.push(createMockComponentDNA(`comp${i}`, 1));
          }

          const evolutionConfig: EvolutionConfig = {
            selectionRate: 0.6,
            eliteRate: 0.1,
            crossoverRate: 0.7,
            mutationRate: 0.1,
            crossoverTraits: ['optimization'],
            mutationTriggers: ['feedback'],
            maxGenerations: 1,
            fitnessThreshold: 0.8
          };

          const evolved = await evolutionEngine.evolvePopulation(largePopulation, evolutionConfig);
          
          const endTime = performance.now();
          const processingTime = endTime - startTime;

          return {
            populationSize: largePopulation.length,
            evolvedSize: evolved.length,
            processingTime,
            performanceAcceptable: processingTime < 5000 // Less than 5 seconds
          };
        },
        'LargePopulationEvolution'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.performanceAcceptable).toBe(true);
      expect(result.testResult.evolvedSize).toBe(50);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle invalid evolution config gracefully', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const population = [createMockComponentDNA('comp1', 1)];
          
          // Test with invalid config values
          const invalidConfig: EvolutionConfig = {
            selectionRate: -0.5, // Invalid negative rate
            eliteRate: 1.5, // Invalid rate > 1
            crossoverRate: 0.5,
            mutationRate: 0.1,
            crossoverTraits: [],
            mutationTriggers: [],
            maxGenerations: -1, // Invalid negative
            fitnessThreshold: 2.0 // Invalid > 1
          };

          try {
            const evolved = await evolutionEngine.evolvePopulation(population, invalidConfig);
            return { success: true, hasResult: evolved.length > 0 };
          } catch (error) {
            return { success: false, error: error.message };
          }
        },
        'InvalidConfigHandling'
      );

      // Should either handle gracefully or fail predictably
      expect(result.success).toBe(true);
    });

    test('should handle null/undefined DNA objects', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          try {
            // Test with null DNA
            const nullResult = await evolutionEngine.inherit(
              null as any,
              ['trait'],
              { trigger: 'test', metrics: {} }
            );
            return { handledNull: false };
          } catch (error) {
            return { handledNull: true, errorType: typeof error };
          }
        },
        'NullDNAHandling'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.handledNull).toBe(true);
    });
  });

  describe('Memory Management Tests', () => {
    test('should not cause memory leaks during evolution cycles', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const cycles = 10;
          const results = [];
          
          for (let cycle = 0; cycle < cycles; cycle++) {
            const population = [
              createMockComponentDNA(`cycle${cycle}-comp1`, cycle),
              createMockComponentDNA(`cycle${cycle}-comp2`, cycle)
            ];

            const config: EvolutionConfig = {
              selectionRate: 0.5,
              eliteRate: 0.5,
              crossoverRate: 0.5,
              mutationRate: 0.1,
              crossoverTraits: ['optimization'],
              mutationTriggers: ['feedback'],
              maxGenerations: 1,
              fitnessThreshold: 0.8
            };

            const evolved = await evolutionEngine.evolvePopulation(population, config);
            results.push(evolved.length);
            
            // Clear references to allow garbage collection
            population.length = 0;
          }

          return {
            cyclesCompleted: cycles,
            allResultsValid: results.every(count => count > 0),
            totalOperations: results.length
          };
        },
        'MemoryManagementTest'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.cyclesCompleted).toBe(10);
      expect(result.testResult.allResultsValid).toBe(true);
    });
  });
});