import { Before, After, BeforeAll, AfterAll, Status, setWorldConstructor } from '@cucumber/cucumber';
import { ApiWorld } from './ApiWorld';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set API world constructor
setWorldConstructor(ApiWorld);

/**
 * BeforeAll Hook for API tests
 * Runs once before all API scenarios
 */
BeforeAll(async function () {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 Starting API Test Execution');
  console.log('='.repeat(80));
  console.log(`Environment: ${process.env.NODE_ENV || 'test'}`);
  console.log(`Base URL: ${process.env.BASE_URL}`);
  console.log('='.repeat(80) + '\n');
});

/**
 * Before Hook for API tests
 * Runs before each API scenario
 */
Before({ tags: '@api' }, async function (this: ApiWorld, { pickle, gherkinDocument }) {
  // Store scenario information
  this.scenarioName = pickle.name;
  this.scenarioTags = pickle.tags.map((tag) => tag.name);

  this.logger.scenario(pickle.name, 'started');
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📋 API Scenario: ${pickle.name}`);
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
  if (this.scenarioTags.includes('@authentication') || this.scenarioTags.includes('@auth-api')) {
    await this.allure.addEpic('Authentication API');
  } else if (this.scenarioTags.includes('@users') || this.scenarioTags.includes('@users-api')) {
    await this.allure.addEpic('User Management API');
  }

  // Add tags to Allure
  this.scenarioTags.forEach((tag) => {
    this.allure.addTag(tag.replace('@', ''));
  });

  // Add environment info
  await this.allure.addEnvironment('API Base URL', process.env.BASE_URL || 'OrangeHRM Demo');
  await this.allure.addEnvironment('Environment', process.env.NODE_ENV || 'test');
});

/**
 * After Hook for API tests
 * Runs after each API scenario
 */
After({ tags: '@api' }, async function (this: ApiWorld, { result, pickle }) {
  const status = result?.status || Status.UNKNOWN;
  const duration = result?.duration?.nanos ? result.duration.nanos / 1000000 : 0; // Convert to ms

  // Attach response details to report
  if (this.apiResponse) {
    await this.attachResponseToReport();
  }

  // Log scenario result
  if (status === Status.PASSED) {
    this.logger.scenario(pickle.name, 'passed', { duration: `${duration.toFixed(0)}ms` });
    console.log(`✅ API Scenario PASSED (${duration.toFixed(0)}ms)`);
  } else if (status === Status.FAILED) {
    this.logger.scenario(pickle.name, 'failed', { duration: `${duration.toFixed(0)}ms` });
    console.log(`❌ API Scenario FAILED (${duration.toFixed(0)}ms)`);

    // Attach error message
    if (result?.message) {
      await this.allure.attachText('Error Message', result.message);
      this.logger.error('Failure Reason:', result.message);
    }

    // Attach request/response details
    if (this.apiResponse) {
      try {
        const responseBody = await this.getResponseText();
        await this.allure.attachText('Failed Response', responseBody);
      } catch (error) {
        this.logger.error('Could not attach response', error);
      }
    }
  } else if (status === Status.SKIPPED) {
    this.logger.scenario(pickle.name, 'failed');
    console.log(`⏭️  API Scenario SKIPPED`);
  }

  console.log(`${'='.repeat(80)}\n`);

  // Cleanup resources
  await this.cleanup();
});

/**
 * AfterAll Hook for API tests
 * Runs once after all API scenarios
 */
AfterAll(async function () {
  console.log('\n' + '='.repeat(80));
  console.log('🏁 API Test Execution Completed');
  console.log('='.repeat(80));
  console.log('📊 Check Allure report for detailed results');
  console.log('💡 Run "npm run report" to generate and view the Allure report');
  console.log('='.repeat(80) + '\n');
});
