#!/usr/bin/env node

import { chromium } from 'playwright';

const PERFORMANCE_THRESHOLDS = {
  TASK_UPDATE_MAX_TIME: 200, // milliseconds
  PAGE_LOAD_MAX_TIME: 3000,  // milliseconds
  DRAG_FPS_MIN: 55,          // fps (allowing some margin from 60fps)
};

async function measureTaskUpdatePerformance(page) {
  console.log('🔍 Testing task update performance...');

  // Navigate to application
  await page.goto('http://localhost:3001');
  await page.locator('[data-testid="user-card"]').first().click();
  await page.locator('[data-testid="project-card"]').first().click();

  // Wait for kanban board to load
  await page.locator('[data-testid="task-card"]').first().waitFor();

  // Measure task click to modal open time
  const startTime = performance.now();
  await page.locator('[data-testid="task-card"]').first().click();
  await page.locator('[data-testid="task-modal"]').waitFor({ timeout: 5000 }).catch(() => {
    console.log('⚠️  Task modal not found - may need to add data-testid');
  });
  const endTime = performance.now();

  const responseTime = endTime - startTime;
  console.log(`   Task update response time: ${responseTime.toFixed(2)}ms`);

  return {
    name: 'Task Update Response Time',
    value: responseTime,
    threshold: PERFORMANCE_THRESHOLDS.TASK_UPDATE_MAX_TIME,
    passed: responseTime <= PERFORMANCE_THRESHOLDS.TASK_UPDATE_MAX_TIME,
    unit: 'ms'
  };
}

async function measurePageLoadPerformance(page) {
  console.log('🔍 Testing page load performance...');

  const startTime = performance.now();
  await page.goto('http://localhost:3001');
  await page.locator('[data-testid="user-card"]').first().waitFor();
  const endTime = performance.now();

  const loadTime = endTime - startTime;
  console.log(`   Page load time: ${loadTime.toFixed(2)}ms`);

  return {
    name: 'Page Load Time',
    value: loadTime,
    threshold: PERFORMANCE_THRESHOLDS.PAGE_LOAD_MAX_TIME,
    passed: loadTime <= PERFORMANCE_THRESHOLDS.PAGE_LOAD_MAX_TIME,
    unit: 'ms'
  };
}

async function measureDragPerformance(page) {
  console.log('🔍 Testing drag-and-drop performance...');

  // Navigate to kanban board
  await page.goto('http://localhost:3001');
  await page.locator('[data-testid="user-card"]').first().click();
  await page.locator('[data-testid="project-card"]').first().click();
  await page.locator('[data-testid="task-card"]').first().waitFor();

  // Enable performance metrics
  await page.evaluate(() => {
    window.performanceMetrics = {
      frameCount: 0,
      startTime: 0,
      endTime: 0
    };

    // Monitor requestAnimationFrame to count frames
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
      window.performanceMetrics.frameCount++;
      return originalRAF.call(window, callback);
    };
  });

  // Start performance monitoring
  await page.evaluate(() => {
    window.performanceMetrics.startTime = performance.now();
    window.performanceMetrics.frameCount = 0;
  });

  // Simulate drag operation
  const taskCard = page.locator('[data-testid="task-card"]').first();
  const targetColumn = page.locator('[data-testid="column-IN_PROGRESS"]');

  await taskCard.hover();
  await page.mouse.down();
  await targetColumn.hover();
  await page.waitForTimeout(100); // Give time for animation
  await page.mouse.up();

  // End performance monitoring
  const metrics = await page.evaluate(() => {
    window.performanceMetrics.endTime = performance.now();
    return window.performanceMetrics;
  });

  const duration = (metrics.endTime - metrics.startTime) / 1000; // Convert to seconds
  const fps = metrics.frameCount / duration;

  console.log(`   Drag operation duration: ${duration.toFixed(2)}s`);
  console.log(`   Frame count: ${metrics.frameCount}`);
  console.log(`   Average FPS: ${fps.toFixed(2)}`);

  return {
    name: 'Drag-and-Drop FPS',
    value: fps,
    threshold: PERFORMANCE_THRESHOLDS.DRAG_FPS_MIN,
    passed: fps >= PERFORMANCE_THRESHOLDS.DRAG_FPS_MIN,
    unit: 'fps'
  };
}

async function runPerformanceTests() {
  console.log('🚀 Starting Performance Validation Tests\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    // Simulate a typical user environment
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const results = [];

  try {
    // Test 1: Page Load Performance
    results.push(await measurePageLoadPerformance(page));

    // Test 2: Task Update Performance
    results.push(await measureTaskUpdatePerformance(page));

    // Test 3: Drag-and-Drop Performance
    results.push(await measureDragPerformance(page));

  } catch (error) {
    console.error('❌ Performance test failed:', error);
  } finally {
    await browser.close();
  }

  // Print results
  console.log('\n📊 Performance Test Results:');
  console.log('=====================================');

  let allPassed = true;

  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name}`);
    console.log(`     Value: ${result.value.toFixed(2)}${result.unit}`);
    console.log(`     Threshold: ${result.threshold}${result.unit}`);
    console.log('');

    if (!result.passed) {
      allPassed = false;
    }
  });

  console.log('=====================================');
  if (allPassed) {
    console.log('🎉 All performance tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some performance tests failed. Please optimize the application.');
    process.exit(1);
  }
}

// Check if running directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runPerformanceTests().catch(console.error);
}