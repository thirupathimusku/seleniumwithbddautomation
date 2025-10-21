import { Before, After, BeforeAll, AfterAll, Status, setWorldConstructor } from '@cucumber/cucumber';
import { CustomWorld } from './CustomWorld';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

// Set custom world constructor
setWorldConstructor(CustomWorld);

// Store console logs
const consoleLogs: string[] = [];

/**
 * BeforeAll Hook
 * Runs once before all scenarios
 */
BeforeAll(async function () {
  console.log('🚀 Starting Test Execution');
  console.log('='.repeat(80));
  console.log(`Environment: ${process.env.NODE_ENV || 'test'}`);
  console.log(`Browser: ${process.env.BROWSER || 'chromium'}`);
  console.log(`Headless: ${process.env.HEADLESS || 'true'}`);
  console.log(`Base URL: ${process.env.BASE_URL}`);
  console.log('='.repeat(80));

  // Create necessary directories
  const dirs = ['logs', 'screenshots', 'test-results', 'allure-results', 'test-results/videos', 'test-results/traces'];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
});

/**
 * Before Hook
 * Runs before each scenario
 */
Before(async function (this: CustomWorld, { pickle, gherkinDocument }) {
  // Store scenario information
  this.scenarioName = pickle.name;
  this.scenarioTags = pickle.tags.map((tag) => tag.name);

  this.logger.scenario(pickle.name, 'started');
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📋 Scenario: ${pickle.name}`);
  console.log(`🏷️  Tags: ${this.scenarioTags.join(', ')}`);
  console.log(`${'='.repeat(80)}`);

  // Add Allure metadata
  await this.allure.addFeature(gherkinDocument.feature?.name || 'Unknown Feature');
  await this.allure.addStory(pickle.name);

  // Determine severity from tags
  if (this.scenarioTags.includes('@P0')) {
    await this.allure.addSeverity('critical');
  } else if (this.scenarioTags.includes('@P1')) {
    await this.allure.addSeverity('normal');
  } else if (this.scenarioTags.includes('@P2')) {
    await this.allure.addSeverity('minor');
  } else {
    await this.allure.addSeverity('trivial');
  }

  // Add epic from tags
  if (this.scenarioTags.includes('@authentication')) {
    await this.allure.addEpic('User Authentication & Access Control');
  }

  // Add tags to Allure
  this.scenarioTags.forEach((tag) => {
    this.allure.addTag(tag.replace('@', ''));
  });

  // Add environment info
  await this.allure.addEnvironment('Browser', process.env.BROWSER || 'chromium');
  await this.allure.addEnvironment('Environment', process.env.NODE_ENV || 'test');
  await this.allure.addEnvironment('Base URL', process.env.BASE_URL || 'OrangeHRM Demo');

  // Initialize browser
  await this.init();

  // Setup console log collection
  if (this.page) {
    this.page.on('console', (msg) => {
      const logMessage = `[${msg.type()}] ${msg.text()}`;
      consoleLogs.push(logMessage);
    });

    // Setup page error handling
    this.page.on('pageerror', (error) => {
      this.logger.error('Page Error:', error);
      consoleLogs.push(`[ERROR] ${error.message}`);
    });
  }
});

/**
 * After Hook
 * Runs after each scenario
 */
After(async function (this: CustomWorld, { result, pickle }) {
  const status = result?.status || Status.UNKNOWN;
  const duration = result?.duration?.nanos ? result.duration.nanos / 1000000 : 0; // Convert to ms

  // Log scenario result
  if (status === Status.PASSED) {
    this.logger.scenario(pickle.name, 'passed', { duration: `${duration.toFixed(0)}ms` });
    console.log(`✅ Scenario PASSED (${duration.toFixed(0)}ms)`);
  } else if (status === Status.FAILED) {
    this.logger.scenario(pickle.name, 'failed', { duration: `${duration.toFixed(0)}ms` });
    console.log(`❌ Scenario FAILED (${duration.toFixed(0)}ms)`);

    // Capture screenshot on failure
    if (this.page) {
      await this.captureScreenshot(pickle.name);
    }

    // Capture trace on failure
    await this.captureTrace(pickle.name);

    // Attach page HTML on failure
    await this.attachPageHTML();

    // Attach console logs on failure
    await this.attachConsoleLogs(consoleLogs);

    // Attach error message
    if (result?.message) {
      await this.allure.attachText('Error Message', result.message);
      this.logger.error('Failure Reason:', result.message);
    }
  } else if (status === Status.SKIPPED) {
    this.logger.scenario(pickle.name, 'failed');
    console.log(`⏭️  Scenario SKIPPED`);
  }

  console.log(`${'='.repeat(80)}\n`);

  // Clear console logs for next scenario
  consoleLogs.length = 0;

  // Cleanup browser
  await this.cleanup();
});

/**
 * AfterAll Hook
 * Runs once after all scenarios
 */
AfterAll(async function () {
  console.log('\n' + '='.repeat(80));
  console.log('🏁 Test Execution Completed');
  console.log('='.repeat(80));
  console.log('📊 Check Allure report for detailed results');
  console.log('💡 Run "npm run report" to generate and view the Allure report');
  console.log('='.repeat(80) + '\n');
});

/**
 * Step Hook - Before each step
 */
// BeforeStep can be added if needed for step-level logging
/*
BeforeStep(async function (this: CustomWorld, { pickleStep }) {
  this.logger.step(pickleStep.text, 'started');
});
*/

/**
 * Step Hook - After each step
 */
// AfterStep can be added if needed for step-level logging
/*
AfterStep(async function (this: CustomWorld, { pickleStep, result }) {
  const status = result?.status || Status.UNKNOWN;
  if (status === Status.PASSED) {
    this.logger.step(pickleStep.text, 'passed');
  } else if (status === Status.FAILED) {
    this.logger.step(pickleStep.text, 'failed');
  }
});
*/
