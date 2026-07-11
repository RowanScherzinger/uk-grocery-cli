import type { LaunchOptions } from 'playwright';

/**
 * Build Playwright Chromium launch options from a base config plus environment
 * overrides, so the same code runs on a Windows desktop and a headless
 * Raspberry Pi.
 *
 * Environment overrides:
 *  - SAINSBURYS_HEADLESS: 'false'/'0' forces headed, 'true'/'1' forces headless.
 *    When unset, the caller's `base.headless` is used (defaulting to true).
 *  - GROC_BROWSER_PATH: absolute path to a Chromium executable
 *    (e.g. /usr/bin/chromium). Preferred on ARM/Raspberry Pi, where Playwright's
 *    bundled Chromium isn't available.
 *  - PLAYWRIGHT_CHROMIUM_CHANNEL / GROC_BROWSER_CHANNEL: a Playwright browser
 *    channel (e.g. 'chromium', 'chrome') to use instead of the bundled browser.
 *
 * `executablePath` (if provided) takes precedence over `channel`; setting both
 * is not meaningful to Playwright.
 */
export function resolveChromiumLaunchOptions(base: LaunchOptions = {}): LaunchOptions {
  const options: LaunchOptions = { ...base };

  const headlessEnv = (process.env.SAINSBURYS_HEADLESS || '').trim().toLowerCase();
  if (headlessEnv === 'false' || headlessEnv === '0') {
    options.headless = false;
  } else if (headlessEnv === 'true' || headlessEnv === '1') {
    options.headless = true;
  } else if (options.headless === undefined) {
    options.headless = true;
  }

  const executablePath = (process.env.GROC_BROWSER_PATH || '').trim();
  if (executablePath) {
    options.executablePath = executablePath;
  } else {
    const channel = (
      process.env.PLAYWRIGHT_CHROMIUM_CHANNEL ||
      process.env.GROC_BROWSER_CHANNEL ||
      ''
    ).trim();
    if (channel) {
      options.channel = channel;
    }
  }

  return options;
}
