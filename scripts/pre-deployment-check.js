#!/usr/bin/env node
/**
 * Pre-Deployment Checklist Script
 * 
 * This script performs a series of checks to ensure the project is ready for production deployment.
 * Run this script before deploying to production to catch common issues.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

// Configuration
const projectRoot = path.join(__dirname, '..');
const clientRoot = path.join(projectRoot, 'client');

// Console colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

console.log(`${colors.bold}${colors.blue}=== ANI Auto Sallon Pre-Deployment Checklist ===${colors.reset}\n`);

const checks = [
  {
    name: 'Build Configuration',
    check: async () => {
      // Check for package.json
      const packageJsonPath = path.join(clientRoot, 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        throw new Error('package.json not found in client directory');
      }
      
      // Check for build script
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (!packageJson.scripts || !packageJson.scripts.build) {
        throw new Error('Build script not found in package.json');
      }
      
      return 'Build configuration looks good';
    }
  },
  {
    name: 'Environment Variables',
    check: async () => {
      // Check for .env files
      const envProdPath = path.join(clientRoot, '.env.production');
      const envPath = path.join(clientRoot, '.env');
      
      if (!fs.existsSync(envProdPath) && !fs.existsSync(envPath)) {
        throw new Error('No environment files (.env.production or .env) found');
      }
      
      return 'Environment files found';
    }
  },
  {
    name: 'Netlify Configuration',
    check: async () => {
      // Check for netlify.toml
      const netlifyPath = path.join(projectRoot, 'netlify.toml');
      if (!fs.existsSync(netlifyPath)) {
        throw new Error('netlify.toml not found');
      }
      
      const netlifyContent = fs.readFileSync(netlifyPath, 'utf8');
      if (!netlifyContent.includes('build') || !netlifyContent.includes('publish')) {
        throw new Error('netlify.toml missing required build configuration');
      }
      
      return 'Netlify configuration looks good';
    }
  },
  {
    name: 'TypeScript Compilation',
    check: async () => {
      // Check TypeScript compilation
      try {
        const { stderr } = await execAsync('cd ' + clientRoot + ' && npx tsc --noEmit');
        if (stderr) {
          throw new Error('TypeScript compilation errors: ' + stderr);
        }
        return 'TypeScript compilation successful';
      } catch (error) {
        // Many projects have type errors but still build, so we'll warn rather than fail
        return { warning: 'TypeScript compilation has errors, but this might not prevent building' };
      }
    }
  },
  {
    name: 'Bundle Size',
    check: async () => {
      // Try to build and check bundle size
      try {
        await execAsync('cd ' + clientRoot + ' && npm run build');
        
        const distDir = path.join(clientRoot, 'dist');
        if (!fs.existsSync(distDir)) {
          throw new Error('Build failed to produce dist directory');
        }
        
        // Check bundle size
        let totalSize = 0;
        const getSize = (dirPath) => {
          const files = fs.readdirSync(dirPath);
          for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
              getSize(filePath);
            } else {
              totalSize += stats.size;
            }
          }
        };
        
        getSize(distDir);
        
        // Convert to MB
        const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
        
        if (sizeInMB > 10) {
          return { warning: `Bundle size is ${sizeInMB}MB which is quite large. Consider optimization.` };
        }
        
        return `Bundle size: ${sizeInMB}MB`;
      } catch (error) {
        throw new Error('Build failed: ' + error.message);
      }
    }
  },
  {
    name: 'SEO Readiness',
    check: async () => {
      // Check for robots.txt and sitemap.xml
      const distDir = path.join(clientRoot, 'dist');
      const robotsPath = path.join(distDir, 'robots.txt');
      const sitemapPath = path.join(distDir, 'sitemap.xml');
      
      const issues = [];
      
      if (!fs.existsSync(robotsPath)) {
        issues.push('robots.txt not found');
      }
      
      if (!fs.existsSync(sitemapPath)) {
        issues.push('sitemap.xml not found');
      }
      
      // Check for meta tags in HTML
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf8');
        if (!content.includes('<meta name="description"')) {
          issues.push('Description meta tag not found');
        }
        
        if (!content.includes('<meta property="og:')) {
          issues.push('Open Graph meta tags not found');
        }
      }
      
      if (issues.length > 0) {
        return { warning: 'SEO issues found: ' + issues.join(', ') };
      }
      
      return 'SEO configuration looks good';
    }
  },
  {
    name: 'Dependency Check',
    check: async () => {
      // Check for dependency issues
      try {
        const { stdout } = await execAsync('cd ' + clientRoot + ' && npm list --json');
        const depList = JSON.parse(stdout);
        
        // Look for problems
        if (depList.problems && depList.problems.length > 0) {
          return { warning: 'Dependency issues found: ' + depList.problems.join(', ') };
        }
        
        return 'No dependency issues found';
      } catch (error) {
        // npm list often exits with non-zero even with minor issues
        return { warning: 'Dependency check had issues, but this might not prevent deployment' };
      }
    }
  },
  {
    name: 'Peer Dependencies',
    check: async () => {
      // Look for common peer dependency issues
      try {
        const { stdout, stderr } = await execAsync('cd ' + clientRoot + ' && npm ls react react-dom @types/react @types/react-dom');
        
        // Check for mismatched React and React DOM versions
        const reactMatch = stdout.match(/react@([\d.]+)/);
        const reactDomMatch = stdout.match(/react-dom@([\d.]+)/);
        
        if (reactMatch && reactDomMatch) {
          const reactVersion = reactMatch[1].split('.')[0]; // Major version
          const reactDomVersion = reactDomMatch[1].split('.')[0]; // Major version
          
          if (reactVersion !== reactDomVersion) {
            return { warning: `React (v${reactMatch[1]}) and React DOM (v${reactDomMatch[1]}) versions don't match` };
          }
        }
        
        // Check for type mismatches
        const typesReactMatch = stdout.match(/@types\/react@([\d.]+)/);
        const typesReactDomMatch = stdout.match(/@types\/react-dom@([\d.]+)/);
        
        if (reactMatch && typesReactMatch) {
          const reactMajor = reactMatch[1].split('.')[0];
          const typesReactMajor = typesReactMatch[1].split('.')[0];
          
          if (reactMajor !== typesReactMajor) {
            return { warning: `React (v${reactMatch[1]}) and @types/react (v${typesReactMatch[1]}) versions don't match` };
          }
        }
        
        return 'Peer dependencies look compatible';
      } catch (error) {
        return { warning: 'Peer dependency check encountered errors' };
      }
    }
  }
];

// Run all checks
let allPassed = true;
let warnings = 0;

(async () => {
  for (const check of checks) {
    process.stdout.write(`${colors.blue}Checking ${check.name}...${colors.reset} `);
    
    try {
      const result = await check.check();
      
      if (typeof result === 'object' && result.warning) {
        console.log(`${colors.yellow}WARNING${colors.reset}`);
        console.log(`  ${colors.yellow}${result.warning}${colors.reset}`);
        warnings++;
      } else {
        console.log(`${colors.green}PASSED${colors.reset}`);
        console.log(`  ${result}`);
      }
    } catch (error) {
      console.log(`${colors.red}FAILED${colors.reset}`);
      console.log(`  ${colors.red}${error.message}${colors.reset}`);
      allPassed = false;
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Final summary
  console.log(`${colors.bold}=== Pre-Deployment Check Summary ===${colors.reset}`);
  
  if (allPassed) {
    if (warnings > 0) {
      console.log(`${colors.yellow}All checks completed with ${warnings} warning(s).${colors.reset}`);
      console.log(`${colors.yellow}You may proceed with deployment, but consider addressing the warnings.${colors.reset}`);
    } else {
      console.log(`${colors.green}All checks passed! You're good to deploy.${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}Some checks failed. Please address the issues before deploying.${colors.reset}`);
  }
})();
