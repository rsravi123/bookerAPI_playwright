const fs = require('fs');
const path = require('path');

const jsonReportPath = path.resolve('reports', 'cucumber.json');
const outputDir = path.resolve('reports', 'html-report');

if (!fs.existsSync(jsonReportPath)) {
  console.error(`Cucumber JSON report not found at ${jsonReportPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

let html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Cucumber Report</title>
  <style>body{font-family:Arial,Helvetica,sans-serif} .feature{margin-bottom:20px} .scenario.pass{color:green} .scenario.fail{color:red}</style>
</head>
<body>
  <h1>Cucumber Report</h1>
  <p>Generated: ${new Date().toISOString()}</p>
`;

data.forEach(feature => {
  html += `<div class="feature"><h2>Feature: ${feature.name}</h2>`;
  feature.elements && feature.elements.forEach(elem => {
    const status = elem.steps && elem.steps.every(s => s.result && s.result.status === 'passed') ? 'pass' : 'fail';
    html += `<div class="scenario ${status}"><strong>Scenario:</strong> ${elem.name} — <em>${status}</em><ul>`;
    elem.steps && elem.steps.forEach(step => {
      const st = step.result ? step.result.status : 'unknown';
      html += `<li>${step.keyword} ${step.name} — ${st}</li>`;
    });
    html += `</ul></div>`;
  });
  html += `</div>`;
});

html += `</body></html>`;

fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf8');
console.log('Simple HTML report generated at', outputDir);
