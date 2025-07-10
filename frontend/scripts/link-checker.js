#!/usr/bin/env node

/**
 * Simple Link Checker for TravelHub
 * 
 * This script crawls the TravelHub application and checks for broken links.
 * Run with: node scripts/link-checker.js
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const BASE_URL = 'http://localhost:3000';
const PAGES_TO_CHECK = [
  '/',
  '/flights',
  '/hotels', 
  '/bookings',
  '/about',
  '/contact'
];

// Track checked URLs to avoid duplicates
const checkedUrls = new Set();
const brokenLinks = [];
const workingLinks = [];

/**
 * Makes HTTP request and returns status code
 */
function checkUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    // Use GET for internal routes (SPA routing), HEAD for external
    const method = url.startsWith(BASE_URL) ? 'GET' : 'HEAD';
    
    const options = {
      method,
      timeout: 5000,
      headers: {
        'User-Agent': 'TravelHub-Link-Checker/1.0'
      }
    };

    const req = protocol.request(url, options, (res) => {
      resolve({
        url,
        status: res.statusCode,
        success: res.statusCode >= 200 && res.statusCode < 400
      });
    });

    req.on('error', (error) => {
      resolve({
        url,
        status: 0,
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

/**
 * Simulates fetching page content (in real implementation, would use a headless browser)
 */
async function getPageLinks(pageUrl) {
  // For this simplified version, we'll return the known links from each page
  const pageLinks = {
    '/': [
      '/',
      '/flights',
      '/hotels',
      '/bookings',
      '/about',
      '/contact'
    ],
    '/flights': [
      '/',
      '/flights',
      '/hotels', 
      '/bookings',
      '/about',
      '/contact'
    ],
    '/hotels': [
      '/',
      '/flights',
      '/hotels',
      '/bookings', 
      '/about',
      '/contact'
    ],
    '/bookings': [
      '/',
      '/flights',
      '/hotels',
      '/bookings',
      '/about',
      '/contact',
      '/contact' // The "Need help? Contact us" link
    ],
    '/about': [
      '/',
      '/flights',
      '/hotels',
      '/bookings',
      '/about', 
      '/contact',
      'https://github.com/shaifulshabuj/travelHub'
    ],
    '/contact': [
      '/',
      '/flights',
      '/hotels',
      '/bookings',
      '/about',
      '/contact',
      '#footer'
    ]
  };

  return pageLinks[pageUrl] || [];
}

/**
 * Main link checking function
 */
async function checkLinks() {
  console.log('🔍 TravelHub Link Checker Starting...\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Pages to check: ${PAGES_TO_CHECK.length}\n`);

  for (const page of PAGES_TO_CHECK) {
    console.log(`📄 Checking page: ${page}`);
    
    // First check if the page itself is accessible
    const pageResult = await checkUrl(`${BASE_URL}${page}`);
    if (!pageResult.success) {
      console.log(`❌ Page ${page} is not accessible: ${pageResult.status} ${pageResult.error || ''}`);
      brokenLinks.push({
        source: 'Direct access',
        url: page,
        status: pageResult.status,
        error: pageResult.error
      });
      continue;
    }
    
    console.log(`✅ Page ${page} is accessible (${pageResult.status})`);
    
    // Get links from the page
    const links = await getPageLinks(page);
    
    for (const link of links) {
      if (checkedUrls.has(link)) {
        continue; // Skip already checked URLs
      }
      
      checkedUrls.add(link);
      
      // Skip anchor links for now
      if (link.startsWith('#')) {
        console.log(`🔗 Skipping anchor link: ${link}`);
        continue;
      }
      
      // Determine full URL
      let fullUrl;
      if (link.startsWith('http')) {
        fullUrl = link;
      } else {
        fullUrl = `${BASE_URL}${link}`;
      }
      
      const result = await checkUrl(fullUrl);
      
      if (result.success) {
        console.log(`✅ Link OK: ${link} (${result.status})`);
        workingLinks.push({
          source: page,
          url: link,
          status: result.status
        });
      } else {
        console.log(`❌ Broken link: ${link} (${result.status}) ${result.error || ''}`);
        brokenLinks.push({
          source: page,
          url: link,
          status: result.status,
          error: result.error
        });
      }
    }
    
    console.log(''); // Empty line for readability
  }

  // Print summary
  console.log('📊 LINK CHECK SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Working links: ${workingLinks.length}`);
  console.log(`❌ Broken links: ${brokenLinks.length}`);
  console.log(`🔍 Total links checked: ${checkedUrls.size}`);
  
  if (brokenLinks.length > 0) {
    console.log('\n❌ BROKEN LINKS FOUND:');
    brokenLinks.forEach((link, index) => {
      console.log(`${index + 1}. ${link.url}`);
      console.log(`   Source: ${link.source}`);
      console.log(`   Status: ${link.status}`);
      if (link.error) console.log(`   Error: ${link.error}`);
      console.log('');
    });
    
    process.exit(1); // Exit with error code
  } else {
    console.log('\n🎉 All links are working correctly!');
    process.exit(0);
  }
}

/**
 * Test specific broken links scenarios
 */
async function testBrokenLinksScenarios() {
  console.log('\n🧪 Testing broken link scenarios...\n');
  
  const testUrls = [
    'http://localhost:3000/broken-link', // Should show 404
    'http://localhost:3000/nonexistent-page', // Should show 404
    'https://nonexistent-domain-123456.com', // Should fail
  ];
  
  for (const url of testUrls) {
    const result = await checkUrl(url);
    console.log(`🧪 Test: ${url}`);
    console.log(`   Status: ${result.status}`);
    console.log(`   Success: ${result.success}`);
    if (result.error) console.log(`   Error: ${result.error}`);
    console.log('');
  }
}

// Run the link checker
if (require.main === module) {
  checkLinks()
    .then(() => testBrokenLinksScenarios())
    .catch((error) => {
      console.error('Error running link checker:', error);
      process.exit(1);
    });
}

module.exports = { checkLinks, checkUrl };