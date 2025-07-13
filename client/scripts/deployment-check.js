#!/usr/bin/env node

/**
 * Pre-deployment check script that verifies the project is ready for deployment
 * Checks for common issues that cause Netlify deployments to fail
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🔍 Running pre-deployment checks...\n');

// Directory setup
const rootDir = path.join(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');

// Check if package.json exists
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found in the root directory!');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Check for React version compatibility
console.log('📋 Checking React version compatibility...');
const reactVersion = packageJson.dependencies.react;
const reactDomVersion = packageJson.dependencies['react-dom'];

if (reactVersion && reactDomVersion) {
  console.log(`✓ React version: ${reactVersion}`);
  console.log(`✓ React DOM version: ${reactDomVersion}`);

  // Check for version mismatches between React and React DOM
  const extractVersion = (versionStr) => {
    const match = versionStr.match(/\d+\.\d+\.\d+/);
    return match ? match[0] : null;
  };

  const reactMainVersion = extractVersion(reactVersion);
  const reactDomMainVersion = extractVersion(reactDomVersion);

  if (reactMainVersion !== reactDomMainVersion) {
    console.warn('⚠️ React and React DOM versions do not match! This may cause issues.');
  }
} else {
  console.error('❌ React or React DOM missing from dependencies!');
}

// Check React TypeScript types
console.log('\n📋 Checking React TypeScript types...');
const reactTypes = packageJson.devDependencies['@types/react'];
const reactDomTypes = packageJson.devDependencies['@types/react-dom'];

if (reactTypes && reactDomTypes) {
  console.log(`✓ React types version: ${reactTypes}`);
  console.log(`✓ React DOM types version: ${reactDomTypes}`);
} else {
  console.warn('⚠️ React TypeScript types might be missing!');
}

// Check for conflicting dependencies
console.log('\n📋 Checking for known conflicting dependencies...');

// Check for multiple routing libraries
const routingLibraries = [];
if (packageJson.dependencies['react-router-dom']) routingLibraries.push('react-router-dom');
if (packageJson.dependencies['wouter']) routingLibraries.push('wouter');

if (routingLibraries.length > 1) {
  console.warn(`⚠️ Multiple routing libraries detected: ${routingLibraries.join(', ')}. This may cause conflicts.`);
} else if (routingLibraries.length === 1) {
  console.log(`✓ Using routing library: ${routingLibraries[0]}`);
} else {
  console.warn('⚠️ No routing library detected.');
}

// Check drizzle-orm and drizzle-zod compatibility
if (packageJson.dependencies['drizzle-orm'] && packageJson.dependencies['drizzle-zod']) {
  console.log(`✓ drizzle-orm version: ${packageJson.dependencies['drizzle-orm']}`);
  console.log(`✓ drizzle-zod version: ${packageJson.dependencies['drizzle-zod']}`);
  console.log('⚠️ Note: drizzle-zod requires specific drizzle-orm versions, check compatibility');
}

// Check Vite build
console.log('\n📋 Testing production build...');

try {
  console.log('📦 Running build...');
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
  console.log('✓ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed! See errors above.');
  process.exit(1);
}

// Check Netlify config
console.log('\n📋 Checking for Netlify configuration...');
const netlifyConfigPath = path.join(rootDir, '..', 'netlify.toml');

if (fs.existsSync(netlifyConfigPath)) {
  console.log('✓ netlify.toml found');
  const netlifyConfig = fs.readFileSync(netlifyConfigPath, 'utf8');
  
  // Check for build command
  if (netlifyConfig.includes('command =')) {
    console.log('✓ Build command defined in netlify.toml');
  } else {
    console.warn('⚠️ No build command found in netlify.toml');
  }
  
  // Check for base directory
  if (netlifyConfig.includes('base =')) {
    console.log('✓ Base directory defined in netlify.toml');
  } else {
    console.warn('⚠️ No base directory found in netlify.toml');
  }
  
  // Check for publish directory
  if (netlifyConfig.includes('publish =')) {
    console.log('✓ Publish directory defined in netlify.toml');
  } else {
    console.warn('⚠️ No publish directory found in netlify.toml');
  }
} else {
  console.warn('⚠️ netlify.toml not found in project root');
}

console.log('\n✅ Pre-deployment check completed!');
console.log('➡️ If no critical errors were reported, the project should be ready for deployment.');
console.log('➡️ Address any warnings before deploying to ensure the best experience.\n');
