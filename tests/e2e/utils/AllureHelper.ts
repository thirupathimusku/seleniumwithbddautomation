import { allure } from 'allure-cucumberjs';

/**
 * Allure Helper for enhanced reporting
 * Provides methods to add attachments, labels, and steps to Allure reports
 */
export class AllureHelper {
  /**
   * Add a step to Allure report
   * @param name - Step name
   * @param body - Step body function
   */
  async step<T>(name: string, body: () => Promise<T>): Promise<T> {
    return await allure.step(name, body);
  }

  /**
   * Attach screenshot to Allure report
   * @param name - Screenshot name
   * @param screenshot - Screenshot buffer
   */
  async attachScreenshot(name: string, screenshot: Buffer): Promise<void> {
    await allure.attachment(name, screenshot, 'image/png');
  }

  /**
   * Attach text to Allure report
   * @param name - Attachment name
   * @param content - Text content
   */
  async attachText(name: string, content: string): Promise<void> {
    await allure.attachment(name, content, 'text/plain');
  }

  /**
   * Attach JSON to Allure report
   * @param name - Attachment name
   * @param json - JSON object
   */
  async attachJSON(name: string, json: any): Promise<void> {
    await allure.attachment(name, JSON.stringify(json, null, 2), 'application/json');
  }

  /**
   * Add severity label
   * @param severity - Severity level (blocker, critical, normal, minor, trivial)
   */
  addSeverity(severity: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'): void {
    allure.severity(severity);
  }

  /**
   * Add epic label
   * @param epic - Epic name
   */
  addEpic(epic: string): void {
    allure.epic(epic);
  }

  /**
   * Add feature label
   * @param feature - Feature name
   */
  addFeature(feature: string): void {
    allure.feature(feature);
  }

  /**
   * Add story label
   * @param story - Story name
   */
  addStory(story: string): void {
    allure.story(story);
  }

  /**
   * Add owner label
   * @param owner - Owner name
   */
  addOwner(owner: string): void {
    allure.owner(owner);
  }

  /**
   * Add tag label
   * @param tag - Tag name
   */
  addTag(tag: string): void {
    allure.tag(tag);
  }

  /**
   * Add issue link
   * @param issueId - Issue ID
   * @param url - Issue URL
   */
  addIssue(issueId: string, url?: string): void {
    if (url) {
      allure.link(url, issueId, 'issue');
    } else {
      allure.issue(issueId);
    }
  }

  /**
   * Add test case link
   * @param testCaseId - Test case ID
   * @param url - Test case URL
   */
  addTestCase(testCaseId: string, url?: string): void {
    if (url) {
      allure.link(url, testCaseId, 'tms');
    } else {
      allure.tms(testCaseId);
    }
  }

  /**
   * Add description
   * @param description - Description text
   */
  addDescription(description: string): void {
    allure.description(description);
  }

  /**
   * Add environment information
   * @param name - Environment variable name
   * @param value - Environment variable value
   */
  addEnvironment(name: string, value: string): void {
    allure.parameter(name, value);
  }

  /**
   * Add parameter
   * @param name - Parameter name
   * @param value - Parameter value
   */
  addParameter(name: string, value: any): void {
    allure.parameter(name, value);
  }
}
