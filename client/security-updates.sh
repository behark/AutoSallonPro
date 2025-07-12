#!/bin/bash
# Automated Security Updates Script

echo "🔒 Starting security updates for dependencies..."

# Function to check for and apply npm audit fixes
run_npm_audit() {
  echo "Checking for vulnerable dependencies..."
  npm audit

  # If vulnerabilities found, try to fix them
  if [ $? -ne 0 ]; then
    echo "Vulnerabilities found, attempting to fix..."
    npm audit fix
    
    # If some vulnerabilities couldn't be fixed automatically
    if [ $? -ne 0 ]; then
      echo "⚠️ Some vulnerabilities require manual review:"
      npm audit --json > security-audit-$(date +"%Y-%m-%d").json
      echo "Audit report saved to security-audit-$(date +"%Y-%m-%d").json"
      echo "Consider running 'npm audit fix --force' after review, but be cautious as it may cause breaking changes."
    else
      echo "✅ All automatically fixable vulnerabilities have been addressed."
    fi
  else
    echo "✅ No vulnerabilities found."
  fi
}

# Function to update dependencies to their latest versions
update_dependencies() {
  echo "Checking for outdated dependencies..."
  npm outdated
  
  echo "Would you like to update all dependencies to their latest versions? (y/n)"
  read -r update_choice
  
  if [ "$update_choice" = "y" ] || [ "$update_choice" = "Y" ]; then
    echo "Creating package backup before updating..."
    cp package.json package.json.backup-$(date +"%Y-%m-%d")
    cp package-lock.json package-lock.json.backup-$(date +"%Y-%m-%d")
    
    echo "Updating dependencies..."
    npx npm-check-updates -u
    npm install --legacy-peer-deps
    
    echo "✅ Dependencies updated. Testing the application is recommended."
  else
    echo "Dependency update skipped."
  fi
}

# Function to install and run dependency-check for additional security scanning
run_dependency_check() {
  if ! command -v dependency-check &> /dev/null; then
    echo "dependency-check not found. Would you like to install it? (y/n)"
    read -r install_choice
    
    if [ "$install_choice" = "y" ] || [ "$install_choice" = "Y" ]; then
      echo "Installing dependency-check..."
      # This is a simplified example - actual installation may vary
      npm install -g dependency-check
    else
      echo "dependency-check installation skipped."
      return
    fi
  fi
  
  if command -v dependency-check &> /dev/null; then
    echo "Running dependency-check for additional security scanning..."
    dependency-check --project "Auto Ani" --scan ./ --out security-report-$(date +"%Y-%m-%d")
    echo "✅ Security scan complete. Report saved to security-report-$(date +"%Y-%m-%d")"
  fi
}

# Main execution
echo "Select security update operation:"
echo "1. Run npm audit and fix vulnerabilities"
echo "2. Update dependencies to latest versions"
echo "3. Run comprehensive dependency security check"
echo "4. Run all checks"
read -r operation_choice

case $operation_choice in
  1)
    run_npm_audit
    ;;
  2)
    update_dependencies
    ;;
  3)
    run_dependency_check
    ;;
  4)
    run_npm_audit
    update_dependencies
    run_dependency_check
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

echo "🎉 Security update process completed!"
echo "Remember to test your application thoroughly after applying updates."
