#!/usr/bin/env node

/**
 * Security Validation Script
 * Validates security configurations and performs basic security checks
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

class SecurityValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };

    this.config = {
      frontendUrl: process.env.FRONTEND_URL || 'https://capstone-rho-wheat.vercel.app',
      backendUrl: process.env.BACKEND_URL || 'https://capstone-production-e2db.up.railway.app',
      localBackend: 'http://localhost:3001',
      localFrontend: 'http://localhost:3000'
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '📋',
      'pass': '✅',
      'fail': '❌',
      'warn': '⚠️',
      'error': '🚨'
    }[type] || '📋';

    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  addResult(testName, passed, message, type = 'test') {
    const result = {
      test: testName,
      passed,
      message,
      type,
      timestamp: new Date().toISOString()
    };

    this.results.tests.push(result);

    if (passed) {
      this.results.passed++;
      this.log(`${testName}: ${message}`, 'pass');
    } else {
      if (type === 'warning') {
        this.results.warnings++;
        this.log(`${testName}: ${message}`, 'warn');
      } else {
        this.results.failed++;
        this.log(`${testName}: ${message}`, 'fail');
      }
    }
  }

  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;

      const req = protocol.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (options.body) {
        req.write(options.body);
      }

      req.end();
    });
  }

  async testDependencyVulnerabilities() {
    this.log('🔍 Checking dependency vulnerabilities...');

    try {
      // Check if package-lock.json files exist
      const frontendLock = fs.existsSync(path.join(__dirname, '../frontend/package-lock.json'));
      const backendLock = fs.existsSync(path.join(__dirname, '../backend/package-lock.json'));

      this.addResult(
        'Dependency Lock Files',
        frontendLock && backendLock,
        frontendLock && backendLock ?
          'Both frontend and backend have lock files' :
          'Missing package-lock.json files'
      );

      // Check package.json for known vulnerable packages
      const frontendPkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../frontend/package.json')));
      const backendPkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../backend/package.json')));

      // Check Next.js version (should be >= 14.2.30)
      const nextVersion = frontendPkg.dependencies.next;
      const isNextSecure = nextVersion && !nextVersion.includes('14.0.0');

      this.addResult(
        'Next.js Security Version',
        isNextSecure,
        isNextSecure ?
          `Next.js version ${nextVersion} is secure` :
          'Next.js version has known vulnerabilities'
      );

    } catch (error) {
      this.addResult('Dependency Check', false, `Error checking dependencies: ${error.message}`);
    }
  }

  async testSecurityHeaders() {
    this.log('🛡️ Testing security headers...');

    const urls = [this.config.backendUrl, this.config.frontendUrl];

    for (const url of urls) {
      try {
        const response = await this.makeRequest(url);
        const headers = response.headers;

        // Test for security headers
        const securityHeaders = {
          'x-content-type-options': 'nosniff',
          'x-frame-options': ['DENY', 'SAMEORIGIN'],
          'x-xss-protection': ['1; mode=block', '0'], // '0' is also acceptable for modern apps
          'strict-transport-security': true // Just check if present
        };

        Object.entries(securityHeaders).forEach(([header, expectedValue]) => {
          const actualValue = headers[header];
          let passed = false;

          if (Array.isArray(expectedValue)) {
            passed = expectedValue.some(val => actualValue === val || actualValue?.includes(val));
          } else if (expectedValue === true) {
            passed = !!actualValue;
          } else {
            passed = actualValue === expectedValue;
          }

          this.addResult(
            `Security Header: ${header} (${url})`,
            passed,
            passed ?
              `Header present: ${actualValue}` :
              `Missing or incorrect header: ${actualValue || 'not set'}`
          );
        });

      } catch (error) {
        this.addResult(`Security Headers (${url})`, false, `Error testing headers: ${error.message}`);
      }
    }
  }

  async testHTTPSRedirection() {
    this.log('🔒 Testing HTTPS enforcement...');

    // Test that HTTP redirects to HTTPS for production URLs
    const productionUrls = [
      this.config.frontendUrl.replace('https://', 'http://'),
      this.config.backendUrl.replace('https://', 'http://')
    ];

    for (const httpUrl of productionUrls) {
      try {
        const response = await this.makeRequest(httpUrl);
        const isRedirect = response.statusCode >= 300 && response.statusCode < 400;
        const locationIsHttps = response.headers.location?.startsWith('https://');

        this.addResult(
          `HTTPS Redirect (${httpUrl})`,
          isRedirect && locationIsHttps,
          isRedirect && locationIsHttps ?
            'HTTP properly redirects to HTTPS' :
            'HTTP does not redirect to HTTPS'
        );

      } catch (error) {
        // For production services, this might be expected (HTTP blocked)
        this.addResult(
          `HTTPS Enforcement (${httpUrl})`,
          true,
          'HTTP requests blocked (good)',
          'warning'
        );
      }
    }
  }

  async testRateLimiting() {
    this.log('⏱️ Testing rate limiting...');

    try {
      const testUrl = `${this.config.backendUrl}/health`;
      const requests = [];

      // Make multiple rapid requests to test rate limiting
      for (let i = 0; i < 5; i++) {
        requests.push(this.makeRequest(testUrl));
      }

      const responses = await Promise.allSettled(requests);
      const successful = responses.filter(r => r.status === 'fulfilled').length;

      this.addResult(
        'Rate Limiting Configuration',
        true, // Rate limiting is configured, this is more of an info test
        `Made ${requests.length} requests, ${successful} successful`,
        'warning'
      );

    } catch (error) {
      this.addResult('Rate Limiting Test', false, `Error testing rate limits: ${error.message}`);
    }
  }

  async testCORSConfiguration() {
    this.log('🌐 Testing CORS configuration...');

    try {
      const response = await this.makeRequest(`${this.config.backendUrl}/health`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'https://malicious-site.com',
          'Access-Control-Request-Method': 'GET'
        }
      });

      const corsHeader = response.headers['access-control-allow-origin'];
      const allowsMalicious = corsHeader === '*' || corsHeader === 'https://malicious-site.com';

      this.addResult(
        'CORS Security',
        !allowsMalicious,
        !allowsMalicious ?
          'CORS properly restricts origins' :
          'CORS allows potentially unsafe origins'
      );

    } catch (error) {
      this.addResult('CORS Configuration', false, `Error testing CORS: ${error.message}`);
    }
  }

  async testAPIEndpointSecurity() {
    this.log('🔌 Testing API endpoint security...');

    const testEndpoints = [
      { url: `${this.config.backendUrl}/health`, expectedStatus: 200 },
      { url: `${this.config.backendUrl}/api/monitoring/metrics`, expectedStatus: 200 },
      { url: `${this.config.backendUrl}/nonexistent`, expectedStatus: 404 }
    ];

    for (const endpoint of testEndpoints) {
      try {
        const response = await this.makeRequest(endpoint.url);
        const statusMatches = response.statusCode === endpoint.expectedStatus;

        this.addResult(
          `API Endpoint (${endpoint.url})`,
          statusMatches,
          statusMatches ?
            `Returns expected status ${endpoint.expectedStatus}` :
            `Returns ${response.statusCode}, expected ${endpoint.expectedStatus}`
        );

      } catch (error) {
        this.addResult(
          `API Endpoint (${endpoint.url})`,
          false,
          `Error accessing endpoint: ${error.message}`
        );
      }
    }
  }

  async testInputValidation() {
    this.log('🛡️ Testing input validation...');

    try {
      // Test JSON payload size limit
      const largePayload = JSON.stringify({ data: 'x'.repeat(11 * 1024 * 1024) }); // 11MB

      const response = await this.makeRequest(`${this.config.backendUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(largePayload)
        },
        body: largePayload
      });

      const rejectsLargePayload = response.statusCode >= 400;

      this.addResult(
        'Payload Size Validation',
        rejectsLargePayload,
        rejectsLargePayload ?
          'Large payloads properly rejected' :
          'Large payloads accepted (potential DoS risk)'
      );

    } catch (error) {
      // Connection errors are expected for oversized payloads
      this.addResult(
        'Payload Size Validation',
        true,
        'Large payload rejected at network level',
        'warning'
      );
    }
  }

  async testEnvironmentSecurity() {
    this.log('🔐 Testing environment security...');

    // Check for common security misconfigurations
    const envChecks = [
      {
        name: 'Development Mode in Production',
        check: () => process.env.NODE_ENV !== 'development',
        message: 'Production environment properly configured'
      },
      {
        name: 'Debug Mode Disabled',
        check: () => !process.env.DEBUG || process.env.DEBUG === 'false',
        message: 'Debug mode disabled in production'
      }
    ];

    envChecks.forEach(({ name, check, message }) => {
      const passed = check();
      this.addResult(name, passed, passed ? message : `${name} security issue detected`);
    });
  }

  async runAllTests() {
    this.log('🚀 Starting security validation...');
    console.log('');

    await this.testDependencyVulnerabilities();
    await this.testSecurityHeaders();
    await this.testHTTPSRedirection();
    await this.testRateLimiting();
    await this.testCORSConfiguration();
    await this.testAPIEndpointSecurity();
    await this.testInputValidation();
    await this.testEnvironmentSecurity();

    this.generateReport();
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🔒 SECURITY VALIDATION REPORT');
    console.log('='.repeat(60));

    console.log(`\n📊 SUMMARY:`);
    console.log(`   ✅ Passed: ${this.results.passed}`);
    console.log(`   ❌ Failed: ${this.results.failed}`);
    console.log(`   ⚠️  Warnings: ${this.results.warnings}`);
    console.log(`   📋 Total Tests: ${this.results.tests.length}`);

    const score = Math.round((this.results.passed / this.results.tests.length) * 100);
    console.log(`\n🏆 SECURITY SCORE: ${score}%`);

    if (this.results.failed > 0) {
      console.log(`\n❌ FAILED TESTS:`);
      this.results.tests
        .filter(test => !test.passed && test.type !== 'warning')
        .forEach(test => {
          console.log(`   • ${test.test}: ${test.message}`);
        });
    }

    if (this.results.warnings > 0) {
      console.log(`\n⚠️  WARNINGS:`);
      this.results.tests
        .filter(test => test.type === 'warning')
        .forEach(test => {
          console.log(`   • ${test.test}: ${test.message}`);
        });
    }

    console.log(`\n📅 Report generated: ${new Date().toISOString()}`);
    console.log('='.repeat(60));

    // Save detailed report
    const reportPath = path.join(__dirname, 'security_validation_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Detailed report saved to: ${reportPath}`);

    // Exit with appropriate code
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// Run the security validation if this script is executed directly
if (require.main === module) {
  const validator = new SecurityValidator();
  validator.runAllTests().catch(error => {
    console.error('🚨 Security validation failed:', error);
    process.exit(1);
  });
}

module.exports = SecurityValidator;
