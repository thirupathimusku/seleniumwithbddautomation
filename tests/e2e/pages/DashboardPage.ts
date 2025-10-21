import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Dashboard Page Object Model
 * Contains all elements and actions for the OrangeHRM dashboard page
 */
export class DashboardPage extends BasePage {
  // Page elements
  private readonly dashboardHeader: Locator;
  private readonly userProfileIcon: Locator;
  private readonly userDropdown: Locator;
  private readonly logoutOption: Locator;
  private readonly mainNavigationMenu: Locator;
  private readonly adminMenuItem: Locator;
  private readonly pimMenuItem: Locator;
  private readonly leaveMenuItem: Locator;
  private readonly timeMenuItem: Locator;
  private readonly recruitmentMenuItem: Locator;
  private readonly quickLaunchSection: Locator;
  private readonly timeAtWorkWidget: Locator;
  private readonly breadcrumb: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize page elements
    this.dashboardHeader = page.locator('h6').filter({ hasText: 'Dashboard' }).first();
    this.userProfileIcon = page.locator('.oxd-userdropdown-tab, .oxd-userdropdown');
    this.userDropdown = page.locator('.oxd-userdropdown-menu, [role="menu"]');
    this.logoutOption = page.getByText('Logout');
    this.mainNavigationMenu = page.locator('.oxd-main-menu, nav[role="navigation"]');
    this.adminMenuItem = page.locator('a[href*="admin"]').filter({ hasText: 'Admin' }).first();
    this.pimMenuItem = page.locator('a[href*="pim"]').filter({ hasText: 'PIM' }).first();
    this.leaveMenuItem = page.locator('a[href*="leave"]').filter({ hasText: 'Leave' }).first();
    this.timeMenuItem = page.locator('a[href*="time"]').filter({ hasText: 'Time' }).first();
    this.recruitmentMenuItem = page.locator('a[href*="recruitment"]').filter({ hasText: 'Recruitment' }).first();
    this.quickLaunchSection = page.locator('.oxd-quick-launch, [class*="quick-launch"]');
    this.timeAtWorkWidget = page.locator('.oxd-time-at-work, [class*="time-at-work"]').first();
    this.breadcrumb = page.locator('.oxd-topbar-header-breadcrumb');
  }

  /**
   * Verify dashboard page is loaded
   */
  async verifyDashboardLoaded(): Promise<void> {
    await this.allure.step('Verify dashboard page is loaded', async () => {
      await this.waitForPageLoad();
      await this.verifyElementVisible(this.dashboardHeader, 'Dashboard header');
      await this.verifyUrlContains('dashboard');
    });
  }

  /**
   * Verify dashboard header displays "Dashboard"
   */
  async verifyDashboardHeader(): Promise<void> {
    await this.verifyText(this.dashboardHeader, 'Dashboard');
  }

  /**
   * Verify main navigation menu is visible
   */
  async verifyMainNavigationMenuVisible(): Promise<void> {
    await this.verifyElementVisible(this.mainNavigationMenu, 'Main navigation menu');
  }

  /**
   * Verify user profile icon is visible
   */
  async verifyUserProfileIconVisible(): Promise<void> {
    await this.verifyElementVisible(this.userProfileIcon, 'User profile icon');
  }

  /**
   * Click user profile icon
   */
  async clickUserProfileIcon(): Promise<void> {
    await this.click(this.userProfileIcon, 'User profile icon');
  }

  /**
   * Get logged in user name
   */
  async getLoggedInUserName(): Promise<string> {
    return await this.getText(this.userProfileIcon);
  }

  /**
   * Verify logout option is available
   */
  async verifyLogoutOptionAvailable(): Promise<void> {
    await this.clickUserProfileIcon();
    await this.verifyElementVisible(this.logoutOption, 'Logout option');
  }

  /**
   * Verify all main navigation menu items are visible
   */
  async verifyAllNavigationMenuItems(): Promise<void> {
    await this.allure.step('Verify all main navigation menu items', async () => {
      const menuItems = [
        { locator: this.adminMenuItem, name: 'Admin' },
        { locator: this.pimMenuItem, name: 'PIM' },
        { locator: this.leaveMenuItem, name: 'Leave' },
        { locator: this.timeMenuItem, name: 'Time' },
        { locator: this.recruitmentMenuItem, name: 'Recruitment' },
      ];

      for (const item of menuItems) {
        const isVisible = await this.isVisible(item.locator);
        if (!isVisible) {
          this.logger.warn(`Menu item ${item.name} is not visible`);
        } else {
          this.logger.info(`Menu item ${item.name} is visible`);
        }
      }
    });
  }

  /**
   * Navigate to Admin module
   */
  async navigateToAdmin(): Promise<void> {
    await this.click(this.adminMenuItem, 'Admin menu item');
  }

  /**
   * Navigate to PIM module
   */
  async navigateToPIM(): Promise<void> {
    await this.click(this.pimMenuItem, 'PIM menu item');
  }

  /**
   * Navigate to Leave module
   */
  async navigateToLeave(): Promise<void> {
    await this.click(this.leaveMenuItem, 'Leave menu item');
  }

  /**
   * Navigate to Time module
   */
  async navigateToTime(): Promise<void> {
    await this.click(this.timeMenuItem, 'Time menu item');
  }

  /**
   * Navigate to Recruitment module
   */
  async navigateToRecruitment(): Promise<void> {
    await this.click(this.recruitmentMenuItem, 'Recruitment menu item');
  }

  /**
   * Verify Quick Launch section is displayed
   */
  async verifyQuickLaunchDisplayed(): Promise<void> {
    const isVisible = await this.isVisible(this.quickLaunchSection);
    if (isVisible) {
      await this.verifyElementVisible(this.quickLaunchSection, 'Quick Launch section');
    } else {
      this.logger.warn('Quick Launch section is not visible on this dashboard');
    }
  }

  /**
   * Verify Time at Work widget is displayed
   */
  async verifyTimeAtWorkWidgetDisplayed(): Promise<void> {
    const isVisible = await this.isVisible(this.timeAtWorkWidget);
    if (isVisible) {
      await this.verifyElementVisible(this.timeAtWorkWidget, 'Time at Work widget');
    } else {
      this.logger.warn('Time at Work widget is not visible on this dashboard');
    }
  }

  /**
   * Perform logout
   */
  async logout(): Promise<void> {
    await this.allure.step('Logout from application', async () => {
      await this.clickUserProfileIcon();
      await this.click(this.logoutOption, 'Logout option');
      await this.waitForPageLoad();
    });
  }

  /**
   * Verify dashboard URL
   */
  async verifyDashboardUrl(): Promise<void> {
    await this.verifyUrlContains('dashboard');
  }

  /**
   * Verify no error messages on dashboard
   */
  async verifyNoErrorMessages(): Promise<void> {
    await this.allure.step('Verify no error messages on dashboard', async () => {
      const errorLocator = this.page.locator('.oxd-alert--error, [role="alert"]');
      const isVisible = await this.isVisible(errorLocator);
      if (isVisible) {
        const errorText = await this.getText(errorLocator);
        throw new Error(`Unexpected error message found: ${errorText}`);
      }
    });
  }

  /**
   * Wait for dashboard to fully load
   */
  async waitForDashboardLoad(): Promise<void> {
    await this.allure.step('Wait for dashboard to fully load', async () => {
      await this.waitForPageLoad();
      await this.waitForElement(this.dashboardHeader);
      await this.waitForElement(this.userProfileIcon);
      // Wait for network to be idle
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
        this.logger.warn('Network did not become idle within timeout');
      });
    });
  }
}
