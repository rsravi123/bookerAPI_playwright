const report = require('multiple-cucumber-html-reporter');
const fs = require('fs');

const jsonReportPath = './reports/cucumber.json';
const outputDir = './reports/html-report';

if (!fs.existsSync(jsonReportPath)) {
  console.error(`Cucumber JSON report not found at ${jsonReportPath}`);
  process.exit(1);
}

report.generate({
  jsonDir: './reports',
  reportPath: outputDir,
  metadata: {
    browser: {
      name: 'unspecified',
      version: 'unspecified'
    },
    device: 'Local machine',
    platform: {
      name: 'any',
      version: 'any'
    }
  },
  customData: {
    title: 'Run info',
    data: [
      { label: 'Project', value: 'bookerAPI_playwright' },
      { label: 'Execution Time', value: new Date().toISOString() }
    ]
  }
});

console.log('HTML report generated at', outputDir);
