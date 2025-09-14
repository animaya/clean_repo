#!/usr/bin/env node

import { chromium } from 'playwright';

async function testKeyboardNavigation(page) {
  console.log('🔍 Testing keyboard navigation...');

  await page.goto('http://localhost:3000');

  // Test tab navigation
  const results = [];

  // Start tabbing from the first user card
  await page.keyboard.press('Tab');
  let focusedElement = await page.locator(':focus').first();

  // Should be able to focus on user cards
  const isUserCardFocused = await focusedElement.getAttribute('data-testid') === 'user-card';
  results.push({
    test: 'User Card Keyboard Focus',
    passed: isUserCardFocused,
    details: isUserCardFocused ? 'User card can be focused with Tab' : 'User card cannot be focused with Tab'
  });

  // Test Enter key activation
  await page.keyboard.press('Enter');
  await page.waitForURL(/\/projects/, { timeout: 5000 }).catch(() => {
    results.push({
      test: 'User Card Enter Activation',
      passed: false,
      details: 'Enter key did not activate user selection'
    });
    return;
  });

  results.push({
    test: 'User Card Enter Activation',
    passed: true,
    details: 'Enter key successfully activated user selection'
  });

  return results;
}

async function testAriaLabels(page) {
  console.log('🔍 Testing ARIA labels and roles...');

  await page.goto('http://localhost:3000');

  const results = [];

  // Test user cards have proper ARIA attributes
  const userCards = await page.locator('[data-testid="user-card"]').all();
  let hasAriaAttributes = true;

  for (const card of userCards) {
    const role = await card.getAttribute('role');
    const ariaLabel = await card.getAttribute('aria-label');
    const ariaDescribedBy = await card.getAttribute('aria-describedby');

    if (!role && !ariaLabel) {
      hasAriaAttributes = false;
      break;
    }
  }

  results.push({
    test: 'User Cards ARIA Attributes',
    passed: hasAriaAttributes,
    details: hasAriaAttributes ? 'User cards have proper ARIA attributes' : 'User cards missing ARIA attributes'
  });

  // Test for proper heading structure
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
  const hasProperHeadings = headings.length > 0;

  results.push({
    test: 'Heading Structure',
    passed: hasProperHeadings,
    details: hasProperHeadings ? `Found ${headings.length} headings` : 'No headings found'
  });

  return results;
}

async function testScreenReaderCompatibility(page) {
  console.log('🔍 Testing screen reader compatibility...');

  await page.goto('http://localhost:3000');

  const results = [];

  // Check for alt text on images
  const images = await page.locator('img').all();
  let allImagesHaveAlt = true;

  for (const img of images) {
    const alt = await img.getAttribute('alt');
    if (!alt && alt !== '') {
      allImagesHaveAlt = false;
      break;
    }
  }

  results.push({
    test: 'Image Alt Text',
    passed: allImagesHaveAlt,
    details: allImagesHaveAlt ? 'All images have alt text' : 'Some images missing alt text'
  });

  // Check for form labels
  const inputs = await page.locator('input, textarea, select').all();
  let allInputsHaveLabels = true;

  for (const input of inputs) {
    const id = await input.getAttribute('id');
    const ariaLabel = await input.getAttribute('aria-label');
    const ariaLabelledBy = await input.getAttribute('aria-labelledby');

    if (id) {
      const label = await page.locator(`label[for="${id}"]`).count();
      if (label === 0 && !ariaLabel && !ariaLabelledBy) {
        allInputsHaveLabels = false;
        break;
      }
    } else if (!ariaLabel && !ariaLabelledBy) {
      allInputsHaveLabels = false;
      break;
    }
  }

  results.push({
    test: 'Form Labels',
    passed: allInputsHaveLabels,
    details: allInputsHaveLabels ? 'All form inputs have labels' : 'Some form inputs missing labels'
  });

  return results;
}

async function testDragDropAccessibility(page) {
  console.log('🔍 Testing drag-and-drop accessibility...');

  // Navigate to kanban board
  await page.goto('http://localhost:3000');
  await page.locator('[data-testid="user-card"]').first().click();
  await page.locator('[data-testid="project-card"]').first().click();
  await page.locator('[data-testid="task-card"]').first().waitFor();

  const results = [];

  // Test if task cards are focusable
  const taskCard = page.locator('[data-testid="task-card"]').first();
  await taskCard.focus();
  const isFocused = await page.evaluate(() => document.activeElement.getAttribute('data-testid') === 'task-card');

  results.push({
    test: 'Task Card Keyboard Focus',
    passed: isFocused,
    details: isFocused ? 'Task cards can be focused with keyboard' : 'Task cards cannot be focused with keyboard'
  });

  // Test keyboard alternatives for drag-and-drop
  // This would typically involve testing arrow keys or other keyboard shortcuts
  // For now, we'll test that the task can be activated with Enter/Space
  await page.keyboard.press('Enter');
  const modalVisible = await page.locator('[data-testid="task-modal"]').isVisible().catch(() => false);

  results.push({
    test: 'Task Activation with Keyboard',
    passed: modalVisible,
    details: modalVisible ? 'Tasks can be activated with keyboard' : 'Tasks cannot be activated with keyboard'
  });

  return results;
}

async function testColorContrast(page) {
  console.log('🔍 Testing color contrast...');

  await page.goto('http://localhost:3000');

  const results = [];

  // This is a basic check - in a real scenario, you'd use axe-core or similar
  const hasGoodContrast = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    let contrastIssues = 0;

    for (const element of elements) {
      const styles = window.getComputedStyle(element);
      const bgColor = styles.backgroundColor;
      const textColor = styles.color;

      // Very basic check - in practice, you'd calculate actual contrast ratios
      if (bgColor === 'rgb(255, 255, 255)' && textColor === 'rgb(255, 255, 255)') {
        contrastIssues++;
      }
    }

    return contrastIssues === 0;
  });

  results.push({
    test: 'Color Contrast (Basic)',
    passed: hasGoodContrast,
    details: hasGoodContrast ? 'No obvious contrast issues found' : 'Potential contrast issues detected'
  });

  return results;
}

async function runAccessibilityTests() {
  console.log('♿ Starting Accessibility Tests\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  const allResults = [];

  try {
    // Run all accessibility tests
    const keyboardResults = await testKeyboardNavigation(page);
    const ariaResults = await testAriaLabels(page);
    const screenReaderResults = await testScreenReaderCompatibility(page);
    const dragDropResults = await testDragDropAccessibility(page);
    const contrastResults = await testColorContrast(page);

    allResults.push(...keyboardResults, ...ariaResults, ...screenReaderResults, ...dragDropResults, ...contrastResults);

  } catch (error) {
    console.error('❌ Accessibility test failed:', error);
  } finally {
    await browser.close();
  }

  // Print results
  console.log('\n♿ Accessibility Test Results:');
  console.log('=====================================');

  let allPassed = true;

  allResults.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.test}`);
    console.log(`     ${result.details}`);
    console.log('');

    if (!result.passed) {
      allPassed = false;
    }
  });

  console.log('=====================================');
  if (allPassed) {
    console.log('🎉 All accessibility tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some accessibility tests failed. Please improve accessibility.');
    process.exit(1);
  }
}

// Check if running directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runAccessibilityTests().catch(console.error);
}