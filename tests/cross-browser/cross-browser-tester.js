// Cross-Browser Compatibility Test Suite for TravelHub
// Tests core functionality across Chrome, Firefox, Safari, and Edge

const fs = require('fs');
const path = require('path');

// Test configuration
const BROWSERS = ['chromium', 'firefox', 'webkit']; // webkit represents Safari
const APP_URL = 'http://localhost:3000';
const REPORT_DIR = path.join(__dirname, 'reports');

// Test results storage
let testResults = {
  timestamp: new Date().toISOString(),
  browsers: {},
  summary: {
    total: 0,
    passed: 0,
    failed: 0
  }
};

// Ensure reports directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

class CrossBrowserTester {
  constructor() {
    this.currentBrowser = null;
    this.currentBrowserName = null;
  }

  async init(browserName) {
    this.currentBrowserName = browserName;
    testResults.browsers[browserName] = {
      tests: [],
      errors: [],
      passed: 0,
      failed: 0
    };
  }

  async logTest(testName, status, details = {}) {
    const test = {
      name: testName,
      status: status, // 'passed' or 'failed'
      details: details,
      timestamp: new Date().toISOString()
    };

    testResults.browsers[this.currentBrowserName].tests.push(test);
    testResults.summary.total++;
    
    if (status === 'passed') {
      testResults.browsers[this.currentBrowserName].passed++;
      testResults.summary.passed++;
    } else {
      testResults.browsers[this.currentBrowserName].failed++;
      testResults.summary.failed++;
    }

    console.log(`[${this.currentBrowserName}] ${testName}: ${status.toUpperCase()}`);
    if (details.error) {
      console.log(`  Error: ${details.error}`);
    }
  }

  async logError(error) {
    testResults.browsers[this.currentBrowserName].errors.push({
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }

  generateReport() {
    // Generate JSON report
    const jsonReport = JSON.stringify(testResults, null, 2);
    fs.writeFileSync(path.join(REPORT_DIR, 'browser-compatibility-results.json'), jsonReport);

    // Generate HTML report
    const htmlReport = this.generateHTMLReport();
    fs.writeFileSync(path.join(REPORT_DIR, 'browser-compatibility-report.html'), htmlReport);

    // Generate markdown summary
    const mdReport = this.generateMarkdownReport();
    fs.writeFileSync(path.join(REPORT_DIR, 'browser-compatibility-summary.md'), mdReport);

    console.log('\n=== CROSS-BROWSER TESTING COMPLETE ===');
    console.log(`Total Tests: ${testResults.summary.total}`);
    console.log(`Passed: ${testResults.summary.passed}`);
    console.log(`Failed: ${testResults.summary.failed}`);
    console.log(`Success Rate: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(2)}%`);
    console.log(`\nReports generated in: ${REPORT_DIR}`);
  }

  generateHTMLReport() {
    return `<!DOCTYPE html>
<html>
<head>
    <title>TravelHub Cross-Browser Compatibility Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f4f4f4; padding: 20px; border-radius: 5px; }
        .browser-section { margin: 20px 0; border: 1px solid #ddd; border-radius: 5px; }
        .browser-header { background: #e9e9e9; padding: 10px; font-weight: bold; }
        .test-item { padding: 10px; border-bottom: 1px solid #eee; }
        .passed { color: green; }
        .failed { color: red; }
        .error { background: #ffe6e6; padding: 5px; margin: 5px 0; border-radius: 3px; }
        .summary { background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>TravelHub Cross-Browser Compatibility Report</h1>
        <p>Generated: ${testResults.timestamp}</p>
    </div>
    
    <div class="summary">
        <h2>Summary</h2>
        <p>Total Tests: ${testResults.summary.total}</p>
        <p>Passed: <span class="passed">${testResults.summary.passed}</span></p>
        <p>Failed: <span class="failed">${testResults.summary.failed}</span></p>
        <p>Success Rate: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(2)}%</p>
    </div>

    ${Object.entries(testResults.browsers).map(([browserName, browserData]) => `
    <div class="browser-section">
        <div class="browser-header">
            ${browserName.charAt(0).toUpperCase() + browserName.slice(1)} 
            (${browserData.passed} passed, ${browserData.failed} failed)
        </div>
        ${browserData.tests.map(test => `
        <div class="test-item">
            <span class="${test.status}">${test.name}: ${test.status.toUpperCase()}</span>
            ${test.details.error ? `<div class="error">Error: ${test.details.error}</div>` : ''}
        </div>
        `).join('')}
        ${browserData.errors.length > 0 ? `
        <div class="test-item">
            <strong>Browser Errors:</strong>
            ${browserData.errors.map(err => `<div class="error">${err.error}</div>`).join('')}
        </div>
        ` : ''}
    </div>
    `).join('')}
</body>
</html>`;
  }

  generateMarkdownReport() {
    return `# TravelHub Cross-Browser Compatibility Report

Generated: ${testResults.timestamp}

## Summary
- **Total Tests**: ${testResults.summary.total}
- **Passed**: ${testResults.summary.passed}
- **Failed**: ${testResults.summary.failed}
- **Success Rate**: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(2)}%

## Browser Results

${Object.entries(testResults.browsers).map(([browserName, browserData]) => `
### ${browserName.charAt(0).toUpperCase() + browserName.slice(1)}
- Tests Passed: ${browserData.passed}
- Tests Failed: ${browserData.failed}

#### Test Details
${browserData.tests.map(test => `
- **${test.name}**: ${test.status.toUpperCase()}${test.details.error ? `\n  - Error: ${test.details.error}` : ''}
`).join('')}

${browserData.errors.length > 0 ? `#### Browser Errors\n${browserData.errors.map(err => `- ${err.error}`).join('\n')}` : ''}
`).join('')}

## Issues Found

${testResults.summary.failed > 0 ? 
  Object.entries(testResults.browsers)
    .flatMap(([browserName, browserData]) => 
      browserData.tests
        .filter(test => test.status === 'failed')
        .map(test => `### ${test.name} - ${browserName}
- **Severity**: ${test.details.severity || 'Medium'}
- **Description**: ${test.details.error || 'Test failed'}
- **Browser**: ${browserName}
`)
    ).join('') 
  : 'No issues found! All tests passed across all browsers.'
}

## Recommendations

${testResults.summary.failed > 0 ? 
  '- Review failed tests and implement browser-specific fixes\n- Consider adding polyfills for unsupported features\n- Test on additional browser versions\n- Implement continuous cross-browser testing' : 
  '- Application shows excellent cross-browser compatibility\n- Continue monitoring for future browser updates\n- Consider expanding test coverage'
}`;
  }
}

module.exports = { CrossBrowserTester, APP_URL, BROWSERS };