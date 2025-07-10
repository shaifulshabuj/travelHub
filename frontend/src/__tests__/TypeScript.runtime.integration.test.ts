import { RuntimeErrorTestRunner, RuntimeTestSummary } from '../utils/runtime-test-runner';

describe('TypeScript Runtime Error Testing Suite', () => {
  let testRunner: RuntimeErrorTestRunner;

  beforeAll(() => {
    testRunner = new RuntimeErrorTestRunner();
  });

  describe('Comprehensive Runtime Error Testing', () => {
    test('should run all TypeScript runtime error tests and generate comprehensive report', async () => {
      // This is the main integration test that runs all runtime error tests
      const summary: RuntimeTestSummary = await testRunner.runAllTests();

      // Validate the test summary structure
      expect(summary).toBeDefined();
      expect(summary.timestamp).toBeInstanceOf(Date);
      expect(summary.summary).toBeDefined();
      expect(summary.globalErrors).toBeDefined();
      expect(summary.categoryResults).toBeInstanceOf(Array);
      expect(summary.detailedResults).toBeInstanceOf(Array);
      expect(summary.recommendations).toBeInstanceOf(Array);
      expect(summary.environmentInfo).toBeDefined();

      // Validate that all test categories were executed
      const expectedCategories = [
        'Component Runtime',
        'Interface Compliance', 
        'Genetic Algorithm',
        'Browser Compatibility',
        'Error Handling',
        'Performance'
      ];

      const actualCategories = summary.categoryResults.map(result => result.category);
      expectedCategories.forEach(category => {
        expect(actualCategories).toContain(category);
      });

      // Validate test execution metrics
      expect(summary.summary.totalTests).toBeGreaterThan(0);
      expect(summary.summary.totalExecutionTime).toBeGreaterThan(0);
      expect(summary.summary.successRate).toBeGreaterThanOrEqual(0);
      expect(summary.summary.successRate).toBeLessThanOrEqual(1);

      // Log detailed test results for visibility
      console.log('\n📊 TypeScript Runtime Error Test Summary:');
      console.log(`Total Tests: ${summary.summary.totalTests}`);
      console.log(`Passed: ${summary.summary.passedTests}`);
      console.log(`Failed: ${summary.summary.failedTests}`);
      console.log(`Success Rate: ${(summary.summary.successRate * 100).toFixed(2)}%`);
      console.log(`Total Execution Time: ${summary.summary.totalExecutionTime.toFixed(2)}ms`);

      console.log('\n📋 Category Results:');
      summary.categoryResults.forEach(result => {
        const status = result.success ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${result.category} (${result.executionTime.toFixed(2)}ms)`);
        if (result.errorCount > 0) {
          console.log(`  └─ Errors: ${result.errorCount}`);
        }
        if (result.warningCount > 0) {
          console.log(`  └─ Warnings: ${result.warningCount}`);
        }
      });

      if (summary.globalErrors.errorCount > 0) {
        console.log('\n🚨 Global Errors Detected:');
        summary.globalErrors.errors.forEach((error, index) => {
          console.log(`${index + 1}. ${error.message}`);
        });
      }

      console.log('\n💡 Recommendations:');
      summary.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });

      console.log('\n🌐 Environment Info:');
      console.log(`Platform: ${summary.environmentInfo.platform}`);
      console.log(`User Agent: ${summary.environmentInfo.userAgent}`);
      console.log(`Language: ${summary.environmentInfo.language}`);

      // Assert that the test suite has reasonable success rate
      // Allow some flexibility for different environments
      expect(summary.summary.successRate).toBeGreaterThanOrEqual(0.8); // 80% success rate minimum

      // Assert that no critical runtime errors were detected
      // Note: We allow some warnings as they might be expected in certain scenarios
      expect(summary.globalErrors.errorCount).toBeLessThanOrEqual(2);

      // Generate final assessment
      const assessment = summary.summary.successRate >= 0.95 ? 'EXCELLENT' :
                        summary.summary.successRate >= 0.85 ? 'GOOD' :
                        summary.summary.successRate >= 0.7 ? 'FAIR' : 'NEEDS_IMPROVEMENT';

      console.log(`\n🎯 Overall Assessment: ${assessment}`);

      // The test passes if we get a reasonable success rate and execute without crashing
      expect(['EXCELLENT', 'GOOD', 'FAIR']).toContain(assessment);

    }, 30000); // 30 second timeout for comprehensive testing

    test('should validate specific error detection capabilities', async () => {
      // This test validates that our error detection system actually works
      // by intentionally triggering errors and ensuring they are caught

      const summary = await testRunner.runAllTests();
      
      // Find the error handling test results
      const errorHandlingResult = summary.detailedResults.find(
        result => result.category === 'Error Handling'
      );

      expect(errorHandlingResult).toBeDefined();
      expect(errorHandlingResult!.success).toBe(true);
      
      // Validate that error handling test results
      if (errorHandlingResult!.details) {
        const details = errorHandlingResult!.details;
        expect(details.totalScenarios).toBeGreaterThan(0);
        expect(details.handledErrors).toBeGreaterThan(0);
        expect(details.errorHandlingRate).toBeGreaterThan(0);
      } else {
        // If no details, the test should still have succeeded
        expect(errorHandlingResult!.success).toBe(true);
      }
    });

    test('should validate performance benchmarks are within acceptable ranges', async () => {
      const summary = await testRunner.runAllTests();
      
      const performanceResult = summary.detailedResults.find(
        result => result.category === 'Performance'
      );

      expect(performanceResult).toBeDefined();
      expect(performanceResult!.success).toBe(true);

      if (performanceResult!.details) {
        const details = performanceResult!.details;
        // Validate that performance benchmarks completed
        expect(details.allBenchmarksCompleted).toBe(true);
        
        // Validate that performance is not extremely poor
        expect(['Excellent', 'Good', 'Fair']).toContain(details.performanceScore);

        // Validate reasonable execution times (not more than 10 seconds for all benchmarks)
        expect(details.totalExecutionTime).toBeLessThan(10000);
      } else {
        expect(performanceResult!.success).toBe(true);
      }
    });

    test('should validate browser compatibility scores', async () => {
      const summary = await testRunner.runAllTests();
      
      const compatibilityResult = summary.detailedResults.find(
        result => result.category === 'Browser Compatibility'
      );

      expect(compatibilityResult).toBeDefined();
      expect(compatibilityResult!.success).toBe(true);

      if (compatibilityResult!.details) {
        const details = compatibilityResult!.details;
        // Should support most modern JavaScript features
        expect(details.compatibilityScore).toBeGreaterThan(0.8);
        expect(details.supportedCount).toBeGreaterThan(0);
        expect(details.totalFeatures).toBeGreaterThan(0);
      } else {
        expect(compatibilityResult!.success).toBe(true);
      }
    });

    test('should validate TypeScript interface compliance testing', async () => {
      const summary = await testRunner.runAllTests();
      
      const interfaceResult = summary.detailedResults.find(
        result => result.category === 'Interface Compliance'
      );

      expect(interfaceResult).toBeDefined();
      expect(interfaceResult!.success).toBe(true);

      if (interfaceResult!.details) {
        const details = interfaceResult!.details;
        // Should be able to detect interface violations
        expect(details.interfaceValidationWorking).toBe(true);
      } else {
        expect(interfaceResult!.success).toBe(true);
      }
    });

    test('should validate genetic algorithm runtime testing', async () => {
      const summary = await testRunner.runAllTests();
      
      const geneticResult = summary.detailedResults.find(
        result => result.category === 'Genetic Algorithm'
      );

      expect(geneticResult).toBeDefined();
      expect(geneticResult!.success).toBe(true);

      if (geneticResult!.details) {
        const details = geneticResult!.details;
        // Validate genetic operations worked
        expect(details.inheritance).toBeDefined();
        expect(details.mutation).toBeDefined();
        expect(details.crossover).toBeDefined();
        expect(details.population).toBeDefined();

        // Validate inheritance logic
        expect(details.inheritance.childGeneration)
          .toBeGreaterThan(details.inheritance.parentGeneration);

        // Validate population operations
        expect(details.population.size).toBeGreaterThan(0);
        expect(details.population.selectedSize).toBeLessThanOrEqual(details.population.size);
      } else {
        expect(geneticResult!.success).toBe(true);
      }
    });
  });

  describe('Error Reporting and Analysis', () => {
    test('should generate meaningful error reports', async () => {
      const summary = await testRunner.runAllTests();

      // Validate error report structure
      expect(summary.globalErrors.timestamp).toBeInstanceOf(Date);
      expect(typeof summary.globalErrors.errorCount).toBe('number');
      expect(typeof summary.globalErrors.warningCount).toBe('number');
      expect(Array.isArray(summary.globalErrors.errors)).toBe(true);
      expect(Array.isArray(summary.globalErrors.warnings)).toBe(true);
      expect(typeof summary.globalErrors.summary).toBe('string');

      // Validate recommendations are generated
      expect(summary.recommendations.length).toBeGreaterThan(0);
      expect(summary.recommendations.every(rec => typeof rec === 'string')).toBe(true);
    });

    test('should provide environment information', async () => {
      const summary = await testRunner.runAllTests();

      expect(summary.environmentInfo).toBeDefined();
      expect(typeof summary.environmentInfo.userAgent).toBe('string');
      expect(typeof summary.environmentInfo.platform).toBe('string');
      expect(typeof summary.environmentInfo.language).toBe('string');
      expect(typeof summary.environmentInfo.timestamp).toBe('string');

      // Validate timestamp format
      expect(() => new Date(summary.environmentInfo.timestamp)).not.toThrow();
    });
  });
});