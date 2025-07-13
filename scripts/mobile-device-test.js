/**
 * Mobile Device Testing Script
 * This script uses Puppeteer to test the website on various mobile device viewports
 * Run with: node mobile-device-test.js [url]
 * Default URL is http://localhost:5173
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Device configurations to test
const devices = [
  { name: 'iPhone SE', width: 375, height: 667, userAgent: 'iPhone' },
  { name: 'iPhone X', width: 375, height: 812, userAgent: 'iPhone' },
  { name: 'iPhone 12 Pro', width: 390, height: 844, userAgent: 'iPhone' },
  { name: 'Samsung Galaxy S20', width: 360, height: 800, userAgent: 'Android' },
  { name: 'iPad', width: 768, height: 1024, userAgent: 'iPad' },
  { name: 'iPad Pro', width: 1024, height: 1366, userAgent: 'iPad' },
];

// Pages to test
const pagesToTest = [
  { path: '/', name: 'Home' },
  { path: '/inventory', name: 'Inventory' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/admin', name: 'Admin' },
];

// UI elements to test interactions with
const elementTests = [
  { selector: 'button', action: 'click', description: 'Button clickability' },
  { selector: 'a', action: 'hover', description: 'Link hover states' },
  { selector: 'input', action: 'type', description: 'Form input fields', value: 'Test input' },
  { selector: '.vehicle-card', action: 'scroll', description: 'Vehicle card visibility' },
  { selector: '.filter-dropdown', action: 'click', description: 'Filter dropdown functionality' },
];

// Create results directory
const resultsDir = path.join(__dirname, '../test-results/mobile');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Start timestamp for the report
const timestamp = new Date().toISOString().replace(/:/g, '-');
const reportFile = path.join(resultsDir, `mobile-test-report-${timestamp}.md`);

// Initialize report
fs.writeFileSync(reportFile, `# Mobile Device Testing Report\n\nDate: ${new Date().toLocaleString()}\n\n`);

async function appendToReport(content) {
  fs.appendFileSync(reportFile, content + '\n');
  console.log(content);
}

async function runTests() {
  const url = process.argv[2] || 'http://localhost:5173';
  appendToReport(`Testing URL: ${url}\n`);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // Test each device
  for (const device of devices) {
    appendToReport(`## Testing on ${device.name} (${device.width}x${device.height})\n`);
    
    const page = await browser.newPage();
    await page.setUserAgent(
      device.userAgent.includes('iPhone') 
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1' 
        : device.userAgent.includes('iPad')
        ? 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36'
    );
    await page.setViewport({ width: device.width, height: device.height });

    // Test each page
    for (const pageToTest of pagesToTest) {
      const pageUrl = `${url}${pageToTest.path}`;
      appendToReport(`### ${pageToTest.name} Page\n`);
      
      try {
        // Navigate to page
        await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        appendToReport(`✅ Page loaded successfully`);
        
        // Take screenshot
        const screenshotPath = path.join(resultsDir, `${device.name.replace(/\s+/g, '-')}-${pageToTest.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        appendToReport(`📷 Screenshot captured: ${path.basename(screenshotPath)}`);
        
        // Test responsive layout
        const layoutIssues = await page.evaluate(() => {
          const issues = [];
          const overflows = document.querySelectorAll('body *');
          for (const el of overflows) {
            if (el.offsetWidth > window.innerWidth) {
              issues.push(`Element '${el.tagName.toLowerCase()}${el.className ? '.' + el.className.replace(/\s+/g, '.') : ''}' overflows horizontally`);
            }
          }
          return issues;
        });
        
        if (layoutIssues.length === 0) {
          appendToReport(`✅ No layout issues detected`);
        } else {
          appendToReport(`⚠️ Layout issues detected:`);
          layoutIssues.forEach(issue => appendToReport(`  - ${issue}`));
        }
        
        // Test UI elements
        appendToReport(`\n#### UI Element Tests`);
        for (const test of elementTests) {
          try {
            const elements = await page.$$(test.selector);
            if (elements.length > 0) {
              appendToReport(`Testing: ${test.description}`);
              
              // Test the first element found
              const element = elements[0];
              switch (test.action) {
                case 'click':
                  await element.click().catch(() => {});
                  appendToReport(`✅ Click succeeded`);
                  break;
                case 'hover':
                  await element.hover().catch(() => {});
                  appendToReport(`✅ Hover succeeded`);
                  break;
                case 'type':
                  await element.type(test.value).catch(() => {});
                  appendToReport(`✅ Typing succeeded`);
                  break;
                case 'scroll':
                  await page.evaluate(el => el.scrollIntoView(), element);
                  appendToReport(`✅ Scroll succeeded`);
                  break;
              }
            } else {
              appendToReport(`⚠️ No elements found for selector: ${test.selector}`);
            }
          } catch (err) {
            appendToReport(`❌ Error testing ${test.description}: ${err.message}`);
          }
        }
        
      } catch (err) {
        appendToReport(`❌ Error on ${pageToTest.name} page: ${err.message}`);
      }
      
      appendToReport(''); // Empty line for readability
    }

    await page.close();
  }

  await browser.close();
  appendToReport(`\n## Testing Complete\n\nTest report saved to: ${reportFile}`);
}

// Run the tests
runTests().catch(err => {
  console.error('Error running tests:', err);
  process.exit(1);
});
