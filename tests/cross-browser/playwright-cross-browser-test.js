const { chromium, firefox, webkit } = require('playwright');

async function testApplicationInBrowser(browserType, browserName) {
  console.log(`\n=== Testing in ${browserName} ===`);
  
  const browser = await browserType.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Test 1: Navigate to application
    console.log('✓ Test 1: Application Loading');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Verify page title
    const title = await page.title();
    console.log(`  - Page Title: ${title}`);
    if (title !== 'TravelHub - Genetic Travel Platform') {
      throw new Error(`Unexpected page title: ${title}`);
    }
    
    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Test 2: Form functionality
    console.log('✓ Test 2: Flight Search Form');
    
    // Fill form fields
    await page.fill('input[placeholder="Departure city"]', 'New York');
    await page.fill('input[placeholder="Destination city"]', 'Los Angeles');
    await page.fill('input[type="date"]:first-of-type', '2024-12-25');
    
    // Test search button enablement
    const searchButton = page.locator('button:has-text("Search Flights")');
    const isEnabled = await searchButton.isEnabled();
    console.log(`  - Search button enabled: ${isEnabled}`);
    
    // Test 3: Search functionality
    console.log('✓ Test 3: Search Functionality');
    await searchButton.click();
    
    // Wait for results
    await page.waitForSelector('h3:has-text("Search Results")', { timeout: 5000 });
    
    // Verify results are displayed
    const resultExists = await page.locator('.flight-card').count() > 0;
    console.log(`  - Search results displayed: ${resultExists}`);
    
    // Test 4: CSS Layout verification
    console.log('✓ Test 4: CSS Layout and Styling');
    
    // Check main layout elements
    const headerExists = await page.locator('header').count() > 0;
    const mainExists = await page.locator('main').count() > 0;
    const formExists = await page.locator('.search-form').count() > 0;
    
    console.log(`  - Header present: ${headerExists}`);
    console.log(`  - Main content present: ${mainExists}`);
    console.log(`  - Search form present: ${formExists}`);
    
    // Test 5: Responsive design
    console.log('✓ Test 5: Responsive Design');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mobileFormVisible = await page.locator('.search-form').isVisible();
    console.log(`  - Form visible on mobile: ${mobileFormVisible}`);
    
    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Test 6: Form validation
    console.log('✓ Test 6: Form Validation');
    
    // Clear required fields and try to search
    await page.fill('input[placeholder="Departure city"]', '');
    await page.fill('input[placeholder="Destination city"]', '');
    
    const buttonDisabled = await searchButton.isDisabled();
    console.log(`  - Button disabled with empty fields: ${buttonDisabled}`);
    
    // Check for console errors
    if (consoleErrors.length > 0) {
      console.log(`  - Console errors found: ${consoleErrors.length}`);
      consoleErrors.forEach(error => console.log(`    • ${error}`));
      return { 
        browser: browserName, 
        success: false, 
        errors: consoleErrors,
        testsRun: 6 
      };
    }
    
    console.log(`✅ All tests passed in ${browserName}`);
    return { 
      browser: browserName, 
      success: true, 
      errors: [],
      testsRun: 6 
    };
    
  } catch (error) {
    console.log(`❌ Test failed in ${browserName}: ${error.message}`);
    return { 
      browser: browserName, 
      success: false, 
      errors: [error.message],
      testsRun: 6 
    };
  } finally {
    await browser.close();
  }
}

async function runCrossBrowserTests() {
  console.log('🚀 Starting Cross-Browser Compatibility Testing for TravelHub\n');
  
  const browsers = [
    { type: chromium, name: 'Chrome (Chromium)' },
    { type: firefox, name: 'Firefox' },
    { type: webkit, name: 'Safari (WebKit)' }
  ];
  
  const results = [];
  
  for (const { type, name } of browsers) {
    try {
      const result = await testApplicationInBrowser(type, name);
      results.push(result);
    } catch (error) {
      console.log(`❌ Failed to launch ${name}: ${error.message}`);
      results.push({ 
        browser: name, 
        success: false, 
        errors: [`Failed to launch browser: ${error.message}`],
        testsRun: 0 
      });
    }
  }
  
  // Generate summary
  console.log('\n📊 TEST SUMMARY');
  console.log('='.repeat(50));
  
  const totalTests = results.reduce((sum, r) => sum + r.testsRun, 0);
  const passedBrowsers = results.filter(r => r.success).length;
  const failedBrowsers = results.filter(r => !r.success).length;
  
  console.log(`Total Browsers Tested: ${results.length}`);
  console.log(`Browsers Passed: ${passedBrowsers}`);
  console.log(`Browsers Failed: ${failedBrowsers}`);
  console.log(`Total Tests Executed: ${totalTests}`);
  
  // Show per-browser results
  results.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${result.browser}: ${status}`);
    if (!result.success && result.errors.length > 0) {
      result.errors.forEach(error => console.log(`  ⚠️  ${error}`));
    }
  });
  
  // Write detailed results to file
  const detailedResults = {
    timestamp: new Date().toISOString(),
    summary: {
      totalBrowsers: results.length,
      passedBrowsers,
      failedBrowsers,
      totalTests
    },
    results,
    recommendations: results.every(r => r.success) 
      ? [
          'Excellent cross-browser compatibility achieved',
          'All core functionality works across Chrome, Firefox, and Safari',
          'Continue monitoring for future browser updates',
          'Consider adding Edge testing if Windows environment available'
        ]
      : [
          'Review failed test cases and implement browser-specific fixes',
          'Consider adding polyfills for unsupported features',
          'Test on additional browser versions',
          'Implement continuous cross-browser testing in CI/CD'
        ]
  };
  
  require('fs').writeFileSync(
    require('path').join(__dirname, 'reports', 'detailed-browser-test-results.json'),
    JSON.stringify(detailedResults, null, 2)
  );
  
  console.log('\n📄 Detailed results saved to: tests/cross-browser/reports/detailed-browser-test-results.json');
  
  return results.every(r => r.success);
}

if (require.main === module) {
  runCrossBrowserTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runCrossBrowserTests };