import { test, expect } from '@playwright/test';

test.describe('TravelHub Navigation and Link Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should have working main navigation links', async ({ page }) => {
    // Test Home/Logo link
    await page.getByRole('link', { name: 'TravelHub' }).click();
    await expect(page).toHaveURL('http://localhost:3000/');
    await expect(page.getByRole('heading', { name: 'Welcome to TravelHub' })).toBeVisible();

    // Test Flights link
    await page.getByRole('link', { name: 'Flights' }).click();
    await expect(page).toHaveURL('http://localhost:3000/flights');
    await expect(page.getByRole('heading', { name: 'Flight Search' })).toBeVisible();

    // Test Hotels link
    await page.getByRole('link', { name: 'Hotels' }).click();
    await expect(page).toHaveURL('http://localhost:3000/hotels');
    await expect(page.getByRole('heading', { name: 'Hotel Search' })).toBeVisible();

    // Test Bookings link
    await page.getByRole('link', { name: 'Bookings' }).click();
    await expect(page).toHaveURL('http://localhost:3000/bookings');
    await expect(page.getByRole('heading', { name: 'My Bookings' })).toBeVisible();

    // Test About link
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL('http://localhost:3000/about');
    await expect(page.getByRole('heading', { name: 'About TravelHub' })).toBeVisible();

    // Test Contact link
    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL('http://localhost:3000/contact');
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
  });

  test('should have working call-to-action buttons on home page', async ({ page }) => {
    // Test Search Flights button
    await page.getByRole('link', { name: 'Search Flights' }).click();
    await expect(page).toHaveURL('http://localhost:3000/flights');
    
    await page.goto('http://localhost:3000');
    
    // Test Find Hotels button
    await page.getByRole('link', { name: 'Find Hotels' }).click();
    await expect(page).toHaveURL('http://localhost:3000/hotels');
  });

  test('should have working back-to-home links on all pages', async ({ page }) => {
    const pages = ['/flights', '/hotels', '/bookings', '/about', '/contact'];
    
    for (const pagePath of pages) {
      await page.goto(`http://localhost:3000${pagePath}`);
      await page.getByRole('link', { name: '← Back to Home' }).click();
      await expect(page).toHaveURL('http://localhost:3000/');
    }
  });

  test('should handle fixed internal links correctly', async ({ page }) => {
    // Test the fixed link on Bookings page
    await page.goto('http://localhost:3000/bookings');
    await page.getByRole('link', { name: 'Need help? Contact us' }).click();
    await expect(page).toHaveURL('http://localhost:3000/contact');
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
  });

  test('should handle external links correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/about');
    
    // Check that external GitHub link exists and has correct attributes
    const githubLink = page.getByRole('link', { name: 'View our GitHub repository' });
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/shaifulshabuj/travelHub');
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should handle anchor links correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/contact');
    
    // Test anchor link to footer
    await page.getByRole('link', { name: 'Jump to footer' }).click();
    await expect(page).toHaveURL('http://localhost:3000/contact#footer');
    
    // Check that footer element exists
    await expect(page.locator('#footer')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Footer' })).toBeVisible();
  });

  test('should show 404 page for invalid routes', async ({ page }) => {
    const invalidRoutes = [
      '/nonexistent-page',
      '/invalid-route', 
      '/broken-link',
      '/random-path',
      '/admin',
      '/test123'
    ];

    for (const route of invalidRoutes) {
      await page.goto(`http://localhost:3000${route}`);
      await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
      await expect(page.getByText('The page you are looking for does not exist.')).toBeVisible();
      
      // Test 404 page navigation links
      await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Search Flights' })).toBeVisible();
    }
  });

  test('should have working navigation from 404 page', async ({ page }) => {
    await page.goto('http://localhost:3000/invalid-route');
    
    // Test Go Home button from 404 page
    await page.getByRole('link', { name: 'Go Home' }).click();
    await expect(page).toHaveURL('http://localhost:3000/');
    
    await page.goto('http://localhost:3000/another-invalid-route');
    
    // Test Search Flights button from 404 page
    await page.getByRole('link', { name: 'Search Flights' }).click();
    await expect(page).toHaveURL('http://localhost:3000/flights');
  });

  test('should not have any broken internal links', async ({ page }) => {
    const pages = ['/', '/flights', '/hotels', '/bookings', '/about', '/contact'];
    
    for (const pagePath of pages) {
      await page.goto(`http://localhost:3000${pagePath}`);
      
      // Get all internal links (excluding external links and anchors starting with #)
      const links = await page.locator('a[href^="/"], a[href^="./"], a[href^="../"]').all();
      
      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('#')) {
          // Navigate to the link and check it doesn't result in an error
          const response = await page.goto(`http://localhost:3000${href}`);
          expect(response?.status()).toBeLessThan(400);
        }
      }
    }
  });

  test('should maintain consistent navigation across all pages', async ({ page }) => {
    const pages = ['/', '/flights', '/hotels', '/bookings', '/about', '/contact'];
    const expectedNavLinks = ['TravelHub', 'Flights', 'Hotels', 'Bookings', 'About', 'Contact'];
    
    for (const pagePath of pages) {
      await page.goto(`http://localhost:3000${pagePath}`);
      
      // Check all navigation links are present
      for (const navLink of expectedNavLinks) {
        await expect(page.getByRole('link', { name: navLink })).toBeVisible();
      }
    }
  });

  test('should handle browser navigation correctly', async ({ page }) => {
    // Test browser back/forward functionality
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Flights' }).click();
    await page.getByRole('link', { name: 'Hotels' }).click();
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('http://localhost:3000/flights');
    
    // Go back again
    await page.goBack();
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // Go forward
    await page.goForward();
    await expect(page).toHaveURL('http://localhost:3000/flights');
  });
});