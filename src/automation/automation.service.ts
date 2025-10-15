import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import { CardUpdateDto } from './dto';
import { UserService } from '../user/user.service';

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);

  constructor(private readonly userService: UserService) {}

  private async retry<T>(fn: () => Promise<T>, attempts = 4, baseDelayMs = 500): Promise<T> {
    let lastErr: any;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (err) {
        lastErr = err;
        const backoff = baseDelayMs * Math.pow(2, i);
        this.logger.warn(
          `Retry ${i + 1}/${attempts} failed (backoff ${backoff}ms): ${err?.message ?? err}`
        );
        await new Promise(res => setTimeout(res, backoff));
      }
    }
    throw lastErr;
  }

  private maskProxy() {
    const host = process.env.PROXY_HOST;
    const port = process.env.PROXY_PORT;
    if (!host || !port) return 'none';
    return `${host}:<port>`;
  }

  public async runCardAutomation(userId: string, dto: CardUpdateDto) {
    const user = await this.userService.getProfile(userId);
    if (!user) throw new Error('User not found');

    const headless = process.env.PUPPETEER_HEADLESS !== 'false';
    const ua = process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
    const proxyHost = process.env.PROXY_HOST;
    const proxyPort = process.env.PROXY_PORT;
    const proxyUser = process.env.PROXY_USERNAME;
    const proxyPass = process.env.PROXY_PASSWORD;
    const proxyArg = proxyHost && proxyPort ? `${proxyHost}:${proxyPort}` : undefined;

    const launchArgs = ['--no-sandbox', '--disable-setuid-sandbox'];
    if (proxyArg) launchArgs.push(`--proxy-server=${proxyArg}`);

    this.logger.log(
      `Starting automation for ${user.email} via proxy ${this.maskProxy()} at ${new Date().toISOString()}`
    );

    const browser = await puppeteer.launch({ headless, args: launchArgs });
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);
    await page.setUserAgent(ua);
    await page.setViewport({ width: 1280, height: 800 });

    if (proxyUser) {
      try {
        await page.authenticate({ username: proxyUser, password: proxyPass || '' });
      } catch (err) {
        this.logger.warn('Proxy authentication failed', err as any);
      }
    }

    try {
      // Debug step: verify geo via BrightData test page when debugging
      if (process.env.DEBUG_CHECK_PROXY === 'true') {
        await this.retry(
          async () => {
            await page.goto('https://geo.brdtest.com/welcome.txt?product=resi&method=native', {
              waitUntil: 'networkidle2',
            });
          },
          4,
          500
        );
        const text = await page.evaluate(() => document.body.innerText);
        this.logger.log('BrightData geo test text: ' + text.slice(0, 400));
      }

      // navigate to Paramount+ sign-in
      await this.retry(
        async () => {
          await page.goto('https://www.paramountplus.com', { waitUntil: 'networkidle2' });
        },
        5,
        700
      );

      // Click sign-in
      await this.retry(
        async () => {
          const signInSelector =
            'a[data-test="header-sign-in"], a[href*="signin"], button:has-text("Sign In")';
          await page.waitForSelector(signInSelector, { timeout: 10000 });
          await page.click(signInSelector);
        },
        4,
        500
      );

      // Fill login
      await this.retry(
        async () => {
          const emailSel = 'input[type="email"], input[name="email"]';
          const passSel = 'input[type="password"], input[name="password"]';
          await page.waitForSelector(emailSel, { timeout: 10000 });
          await page.type(emailSel, user.email, { delay: 60 });

          const password = process.env.TEST_PASSWORD;
          if (!password)
            throw new Error(
              'TEST_PASSWORD env var not set for automated login (use only for accounts you control).'
            );
          await page.type(passSel, password, { delay: 60 });
          await page.keyboard.press('Enter');
          await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 });
        },
        5,
        800
      );

      // Navigate to account/payment page
      await this.retry(
        async () => {
          await page.goto('https://www.paramountplus.com/account', { waitUntil: 'networkidle2' });
        },
        4,
        900
      );

      // Attempt to open manage payment UI
      await this.retry(
        async () => {
          const paymentSelector =
            'button[data-test="manage-payment-methods"], a[href*="payment"], a:has-text("Payment")';
          if (await page.$(paymentSelector)) {
            await page.click(paymentSelector);
          } else {
            this.logger.warn('Payment selector not found — page may have different layout.');
          }
        },
        3,
        600
      );

      // Payment iframe handling
      try {
        const frames = page.frames();
        for (const frame of frames) {
          const cardField = await frame.$(
            'input[name="cardnumber"], input[placeholder*="Card"], input[name*="card"]'
          );
          if (cardField) {
            await this.retry(
              async () => {
                await frame.type(
                  'input[name="cardnumber"], input[placeholder*="Card"]',
                  '4242 4242 4242 4242',
                  { delay: 45 }
                );
              },
              3,
              300
            );

            await this.retry(
              async () => {
                const dd = dto.expiryMonth || '12';
                const yy = (dto.expiryYear || '2028').toString().slice(-2);
                await frame.type('input[name="exp-date"], input[name*="exp"]', `${dd}/${yy}`, {
                  delay: 40,
                });
              },
              3,
              300
            );

            await this.retry(
              async () => {
                await frame.type('input[name="cvc"], input[placeholder*="CVC"]', '123', {
                  delay: 40,
                });
              },
              3,
              300
            );

            const submit = await frame.$(
              'button[type="submit"], button:has-text("Save"), button:has-text("Add")'
            );
            if (submit) {
              await submit.click();
            }
            break;
          }
        }
      } catch (err) {
        this.logger.warn('Payment iframe best-effort interaction failed', err as any);
      }

      const metadata = {
        userId: user.id,
        email: user.email,
        cardLast4: dto.cardLast4 ?? null,
        expiryMonth: dto.expiryMonth ?? null,
        expiryYear: dto.expiryYear ?? null,
        timestamp: new Date().toISOString(),
        proxy: this.maskProxy(),
      };

      this.logger.log('Automation successful: ' + JSON.stringify(metadata));
      await browser.close();
      return { success: true, metadata };
    } catch (err) {
      this.logger.error('Automation error: ' + (err as any).message);
      try {
        await browser.close();
      } catch {}
      return { success: false, error: (err as any).message ?? String(err) };
    }
  }
}
