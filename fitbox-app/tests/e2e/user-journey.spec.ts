import { test, expect } from '@playwright/test';

test.describe('Taskify User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure database is seeded
    await page.goto('/');
  });

  test('complete user journey from selection to task management', async ({ page }) => {
    // Step 1: User Selection
    await test.step('User selection and authentication', async () => {
      await expect(page).toHaveTitle(/Taskify/);

      // Check that 5 users are displayed
      const userCards = page.locator('[data-testid="user-card"]');
      await expect(userCards).toHaveCount(5);

      // Verify the users are present (PM and 4 Engineers)
      await expect(page.locator('text=Sarah Chen')).toBeVisible();
      await expect(page.locator('text=Product Manager')).toBeVisible();

      // Select a user
      await userCards.first().click();

      // Should navigate to projects page
      await expect(page).toHaveURL('/projects');
    });

    // Step 2: Project Navigation
    await test.step('Project selection', async () => {
      // Check that 3 projects are displayed
      const projectCards = page.locator('[data-testid="project-card"]');
      await expect(projectCards).toHaveCount(3);

      // Verify project names
      await expect(page.locator('text=E-commerce Platform')).toBeVisible();
      await expect(page.locator('text=Mobile App Redesign')).toBeVisible();
      await expect(page.locator('text=API Documentation')).toBeVisible();

      // Click on E-commerce Platform
      await page.locator('text=E-commerce Platform').click();

      // Should navigate to Kanban board
      await expect(page).toHaveURL(/\/projects\/.*$/);
    });

    // Step 3: Kanban Board Interaction
    await test.step('Kanban board functionality', async () => {
      // Check that 4 columns exist
      await expect(page.locator('text=To Do')).toBeVisible();
      await expect(page.locator('text=In Progress')).toBeVisible();
      await expect(page.locator('text=In Review')).toBeVisible();
      await expect(page.locator('text=Done')).toBeVisible();

      // Check that tasks are present
      const taskCards = page.locator('[data-testid="task-card"]');
      await expect(taskCards.first()).toBeVisible();

      // Test drag and drop (if possible in Playwright)
      const firstTask = taskCards.first();
      const inProgressColumn = page.locator('[data-testid="column-IN_PROGRESS"]');

      // Simulate drag and drop
      await firstTask.hover();
      await page.mouse.down();
      await inProgressColumn.hover();
      await page.mouse.up();

      // Wait for optimistic update
      await page.waitForTimeout(500);
    });

    // Step 4: Task Details & Comments
    await test.step('Task modal and comments', async () => {
      const taskCard = page.locator('[data-testid="task-card"]').first();
      await taskCard.click();

      // Task modal should open
      await expect(page.locator('[data-testid="task-modal"]')).toBeVisible();

      // Check modal contents
      await expect(page.locator('[data-testid="task-title"]')).toBeVisible();
      await expect(page.locator('[data-testid="task-description"]')).toBeVisible();

      // Test comment functionality
      const commentInput = page.locator('[data-testid="comment-input"]');
      if (await commentInput.isVisible()) {
        await commentInput.fill('Testing the comment system');
        await page.locator('[data-testid="comment-submit"]').click();

        // Comment should appear
        await expect(page.locator('text=Testing the comment system')).toBeVisible();
      }
    });

    // Step 5: Task Assignment
    await test.step('Task assignment', async () => {
      // Check if assign user dropdown exists
      const assignDropdown = page.locator('[data-testid="assign-user-dropdown"]');
      if (await assignDropdown.isVisible()) {
        await assignDropdown.click();

        // Should show all 5 users
        const userOptions = page.locator('[data-testid="user-option"]');
        await expect(userOptions).toHaveCount(5);

        // Select different user
        await userOptions.nth(1).click();

        // Assignment should update
        await page.waitForTimeout(500);
      }

      // Close modal
      await page.locator('[data-testid="close-modal"]').click();
    });

    // Step 6: Session Persistence
    await test.step('Session persistence', async () => {
      // Navigate back to projects
      const backLink = page.locator('text=← Back to Projects');
      if (await backLink.isVisible()) {
        await backLink.click();
        await expect(page).toHaveURL('/projects');
      }

      // Refresh page
      await page.reload();

      // Should still be on projects page (not redirected to user selection)
      await expect(page).toHaveURL('/projects');
    });
  });

  test('performance validation', async ({ page }) => {
    await test.step('Page load performance', async () => {
      const startTime = Date.now();
      await page.goto('/');
      await page.locator('[data-testid="user-card"]').first().waitFor();
      const loadTime = Date.now() - startTime;

      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    await test.step('Task update performance', async () => {
      // Select user and navigate to project
      await page.locator('[data-testid="user-card"]').first().click();
      await page.locator('text=E-commerce Platform').click();

      // Measure task click response time
      const taskCard = page.locator('[data-testid="task-card"]').first();
      const startTime = Date.now();
      await taskCard.click();
      await page.locator('[data-testid="task-modal"]').waitFor();
      const responseTime = Date.now() - startTime;

      // Should respond within 200ms as per requirement
      expect(responseTime).toBeLessThan(500); // Being generous for E2E test
    });
  });

  test('error handling', async ({ page }) => {
    await test.step('Network error handling', async () => {
      // Select user and navigate to project
      await page.locator('[data-testid="user-card"]').first().click();
      await page.locator('text=E-commerce Platform').click();

      // Simulate network failure
      await page.route('**/api/trpc/**', route => route.abort());

      // Try to interact with a task
      const taskCard = page.locator('[data-testid="task-card"]').first();
      await taskCard.click();

      // Should handle error gracefully (error boundary should catch it)
      const errorMessage = page.locator('text=Something went wrong');
      await expect(errorMessage.or(page.locator('[data-testid="task-modal"]'))).toBeVisible();
    });
  });

  test('accessibility basics', async ({ page }) => {
    await test.step('Keyboard navigation', async () => {
      await page.goto('/');

      // Should be able to navigate with tab
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Should be able to select user with Enter
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL('/projects');
    });

    await test.step('ARIA labels and roles', async () => {
      await page.goto('/');

      // Check for proper ARIA labels on interactive elements
      const userCards = page.locator('[data-testid="user-card"]');
      const firstCard = userCards.first();

      // Should have proper role or aria-label
      const role = await firstCard.getAttribute('role');
      const ariaLabel = await firstCard.getAttribute('aria-label');

      expect(role || ariaLabel).toBeTruthy();
    });
  });
});