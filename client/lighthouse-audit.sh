#!/bin/bash
# Lighthouse Performance Audit Script

echo "🚀 Starting Lighthouse Performance Audit"

# Check if lighthouse is installed globally
if ! command -v lighthouse &> /dev/null; then
  echo "Lighthouse is not installed. Installing now..."
  npm install -g lighthouse
fi

# Create directory for reports if it doesn't exist
REPORT_DIR="lighthouse-reports"
REPORT_DATE=$(date +"%Y-%m-%d-%H-%M-%S")
mkdir -p $REPORT_DIR

# URLs to test (add more as needed)
URLS=(
  "https://www.aniautosallon.com"
  "https://www.aniautosallon.com/inventory"
  "https://www.aniautosallon.com/about"
  "https://www.aniautosallon.com/contact"
)

# Run lighthouse for each URL
for url in "${URLS[@]}"; do
  echo "Running audit for $url"
  PAGE_NAME=$(echo $url | sed 's/https:\/\/www.aniautosallon.com\///g' | sed 's/\//-/g')
  if [ -z "$PAGE_NAME" ]; then
    PAGE_NAME="home"
  fi
  
  # Run lighthouse with specific categories and output formats
  lighthouse "$url" \
    --output html --output json --output csv \
    --output-path "$REPORT_DIR/${REPORT_DATE}-${PAGE_NAME}" \
    --chrome-flags="--headless --no-sandbox" \
    --only-categories=performance,accessibility,best-practices,seo
done

echo "✅ Lighthouse audits completed. Reports saved to $REPORT_DIR directory."
echo "Summary of findings:"

# Extract key metrics from JSON reports for a summary
for url in "${URLS[@]}"; do
  PAGE_NAME=$(echo $url | sed 's/https:\/\/www.aniautosallon.com\///g' | sed 's/\//-/g')
  if [ -z "$PAGE_NAME" ]; then
    PAGE_NAME="home"
  fi
  
  JSON_REPORT="$REPORT_DIR/${REPORT_DATE}-${PAGE_NAME}.report.json"
  
  if [ -f "$JSON_REPORT" ]; then
    echo "----------------"
    echo "Page: $url"
    PERFORMANCE=$(cat "$JSON_REPORT" | grep -o '"performance":[0-9.]*' | cut -d':' -f2)
    ACCESSIBILITY=$(cat "$JSON_REPORT" | grep -o '"accessibility":[0-9.]*' | cut -d':' -f2)
    BEST_PRACTICES=$(cat "$JSON_REPORT" | grep -o '"best-practices":[0-9.]*' | cut -d':' -f2)
    SEO=$(cat "$JSON_REPORT" | grep -o '"seo":[0-9.]*' | cut -d':' -f2)
    
    echo "Performance: $PERFORMANCE"
    echo "Accessibility: $ACCESSIBILITY"
    echo "Best Practices: $BEST_PRACTICES"
    echo "SEO: $SEO"
  else
    echo "No report found for $url"
  fi
done

echo "----------------"
echo "For detailed results, open the HTML reports in your browser."
