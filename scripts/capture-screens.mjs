/**
 * Recreate the presentation screenshots from a running Elidune (branch dev).
 *
 * Prerequisites: API and UI already up (UI proxies /api). Demo data only:
 * fictional patrons, public-domain titles, no real personal data.
 *
 *   ELIDUNE_URL=http://127.0.0.1:3000 node scripts/capture-screens.mjs
 *
 * The first run completes first setup and seeds the database. A later run
 * logs in as the same demo administrator and only retakes the pictures.
 * Patron names appear on the desk and on the patron record. They are not
 * opened on a slip, a shelf label, or a deposit-batch report.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const base = process.env.ELIDUNE_URL ?? 'http://127.0.0.1:3000';
const api = `${base}/api/v1`;

const ADMIN = { login: 'demo.admin', password: 'demoadmin1234' };
const ADULT = { login: 'camille.martin', password: 'lecteurdemo1234', barcode: 'CAM-1001' };
const CHILD = { login: 'ines.martin', password: 'lecteurdemo1234', barcode: 'INE-1002' };

const shots = [
  { name: 'desk', path: '/loans', prepare: 'desk' },
  { name: 'record', path: null, prepare: 'record' },
  { name: 'catalogue', path: '/biblios', prepare: 'staff' },
  { name: 'holds', path: '/holds', prepare: 'staff' },
  { name: 'settings', path: '/settings?tab=library', prepare: 'staff' },
  { name: 'opac-loans', path: '/my-loans', prepare: 'patron' },
  { name: 'deposits', path: '/deposits', prepare: 'staff' },
  { name: 'acquisitions', path: '/acquisitions?tab=orders', prepare: 'staff' },
  { name: 'weeding', path: '/weeding', prepare: 'staff' },
  { name: 'inventory', path: '/inventory', prepare: 'staff' },
  { name: 'patrons', path: null, prepare: 'patron-record' },
  { name: 'transits', path: '/transits', prepare: 'staff' },
];

const state = {
  token: '',
  adminId: '',
  adultId: '',
  childId: '',
  recordId: '',
};

async function call(method, urlPath, { token, body } = {}) {
  const response = await fetch(`${api}${urlPath}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!response.ok) {
    throw new Error(`${method} ${urlPath} -> ${response.status} ${text.slice(0, 500)}`);
  }
  return json;
}

function idOf(value) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return String(value.id ?? '');
}

async function login(username, password) {
  const body = await call('POST', '/auth/login', { body: { username, password } });
  return body.token;
}

async function acceptInitialPassword(username, password) {
  const body = await call('POST', '/auth/login', { body: { username, password } });
  if (!body.mustChangePassword) return;
  await call('POST', '/auth/change-password', {
    token: body.token,
    body: { newPassword: password },
  });
}

async function seed() {
  const health = await call('GET', '/health');
  if (health.setup?.needFirstSetup) {
    const setup = await call('POST', '/first_setup', {
      body: {
        admin: {
          login: ADMIN.login,
          password: ADMIN.password,
          firstname: 'Alex',
          lastname: 'Morel',
          email: 'alex.morel@example.invalid',
          sex: 'm',
          birthdate: '1984-05-20',
          language: 'french',
        },
        library: {
          name: 'Médiathèque du Parc',
          addrLine1: '12 place du Parc',
          addrPostcode: '69000',
          addrCity: 'Lyon',
          addrCountry: 'FR',
          email: 'accueil@example.invalid',
          language: 'fr',
        },
      },
    });
    state.token = setup.token;
  } else {
    state.token = await login(ADMIN.login, ADMIN.password);
    const me = await call('GET', '/auth/me', { token: state.token });
    state.adminId = idOf(me.id ?? me.user?.id);
  }

  if (!state.adminId) {
    const me = await call('GET', '/auth/me', { token: state.token });
    state.adminId = idOf(me.id ?? me.user?.id);
  }

  const sites = await call('GET', '/sites', { token: state.token });
  const siteRows = sites.items ?? sites.data ?? sites;
  const main = (Array.isArray(siteRows) ? siteRows : []).find((site) => site.default) ?? siteRows[0];
  const mainId = idOf(main);
  await call('PUT', `/sites/${mainId}`, { token: state.token, body: { name: 'Médiathèque du Parc' } });

  let annex = (Array.isArray(siteRows) ? siteRows : []).find((site) => site.name === 'Annexe du Quai');
  if (!annex) {
    // 001_initial_schema.sql inserts sites.id = 1 without setval. The first
    // nextval still returns 1 (23505). nextval is not rolled back, so retry.
    try {
      annex = await call('POST', '/sites', { token: state.token, body: { name: 'Annexe du Quai' } });
    } catch (error) {
      if (!String(error.message).includes('-> 500')) throw error;
      annex = await call('POST', '/sites', { token: state.token, body: { name: 'Annexe du Quai' } });
    }
  }
  const annexId = idOf(annex);

  const users = await call('GET', '/users?login=camille.martin', { token: state.token });
  const userRows = users.items ?? users.data ?? [];
  const existingAdult = (Array.isArray(userRows) ? userRows : []).find((user) => user.login === ADULT.login);
  if (existingAdult) {
    state.adultId = idOf(existingAdult);
    const childList = await call('GET', '/users?login=ines.martin', { token: state.token });
    const childRows = childList.items ?? childList.data ?? [];
    const existingChild = (Array.isArray(childRows) ? childRows : []).find((user) => user.login === CHILD.login);
    state.childId = idOf(existingChild);
    await acceptInitialPassword(ADULT.login, ADULT.password);
    await acceptInitialPassword(CHILD.login, CHILD.password);
    const biblios = await call('GET', '/biblios?title=Misérables&perPage=5', { token: state.token });
    const rows = biblios.items ?? biblios.data ?? [];
    state.recordId = idOf(rows[0]);
    return;
  }

  const adult = await call('POST', '/users', {
    token: state.token,
    body: {
      login: ADULT.login,
      password: ADULT.password,
      firstname: 'Camille',
      lastname: 'Martin',
      email: 'camille.martin@example.invalid',
      accountType: 'reader',
      sex: 'f',
      birthdate: '1988-03-12',
      language: 'french',
      addrCity: 'Lyon',
      barcode: ADULT.barcode,
    },
  });
  state.adultId = idOf(adult);

  const child = await call('POST', '/users', {
    token: state.token,
    body: {
      login: CHILD.login,
      password: CHILD.password,
      firstname: 'Inès',
      lastname: 'Martin',
      accountType: 'reader',
      sex: 'f',
      birthdate: '2016-04-02',
      language: 'french',
      addrCity: 'Lyon',
      barcode: CHILD.barcode,
      guardianId: state.adultId,
    },
  });
  state.childId = idOf(child);
  await acceptInitialPassword(ADULT.login, ADULT.password);
  await acceptInitialPassword(CHILD.login, CHILD.password);

  const titles = [
    { title: 'Les Misérables', barcode: 'LM-1886-1', callNumber: 'R HUGO m', extra: 'LM-1886-2' },
    { title: 'Orgueil et Préjugés', barcode: 'PP-1813-1', callNumber: 'R AUST o' },
    { title: 'Le Tour du monde en quatre-vingts jours', barcode: 'TM-1873-1', callNumber: 'R VERN t' },
    { title: 'Vingt mille lieues sous les mers', barcode: 'VL-1870-1', callNumber: 'R VERN v' },
    { title: 'Alice au pays des merveilles', barcode: 'AL-1865-1', callNumber: 'R CARR a' },
  ];

  const created = [];
  for (const title of titles) {
    const items = [
      { barcode: title.barcode, callNumber: title.callNumber, siteId: mainId, borrowable: true, price: '0.00' },
    ];
    if (title.extra) {
      items.push({ barcode: title.extra, callNumber: `${title.callNumber} 2`, siteId: mainId, borrowable: true, price: '0.00' });
    }
    const record = await call('POST', '/biblios?allowDuplicateIsbn=false', {
      token: state.token,
      body: { title: title.title, mediaType: 'printedText', lang: 'french', items },
    });
    const biblio = record.biblio ?? record;
    created.push({ ...title, id: idOf(biblio), itemId: idOf(biblio.items?.[0]) });
  }
  state.recordId = created[0].id;

  await call('POST', '/loans', {
    token: state.token,
    body: { userId: state.adultId, itemId: created[0].itemId },
  });

  const hold = await call('POST', '/holds', {
    token: state.token,
    body: {
      userId: state.adultId,
      biblioId: created[2].id,
      pickupSiteId: annexId,
      patronNote: 'Retrait à l’annexe',
    },
  });
  await call('POST', `/holds/${idOf(hold)}/transits`, {
    token: state.token,
    body: { itemId: created[2].itemId, toSiteId: annexId, ship: false },
  });

  await call('POST', `/items/${created[3].itemId}/weeding`, {
    token: state.token,
    body: { status: 'candidate', reason: 'Peu prêté' },
  });

  await call('POST', '/inventory/sessions', {
    token: state.token,
    body: { name: 'Romans, octobre 2026', scopeSiteId: mainId },
  });

  const lender = await call('POST', '/lenders', {
    token: state.token,
    body: { name: 'Bibliothèque de Rivage', contact: 'depots@example.invalid', replacementRateCents: 2500 },
  });
  await call('POST', '/deposit-batches', {
    token: state.token,
    body: {
      lenderId: idOf(lender),
      reference: 'RIVAGE-2026-A',
      siteId: mainId,
      arrivedOn: '2026-10-01',
      returnDueOn: '2027-04-01',
      notes: 'Romans du domaine public',
    },
  });

  const vendor = await call('POST', '/acquisitions/vendors', {
    token: state.token,
    body: { name: 'Atelier du domaine public', code: 'ADDP' },
  });
  const fund = await call('POST', '/acquisitions/funds', {
    token: state.token,
    body: { code: 'FONDS-2026', name: 'Fonds documentaire 2026', fiscalYear: 2026, allocatedAmount: '500.00', currency: 'EUR' },
  });
  await call('POST', '/acquisitions/orders', {
    token: state.token,
    body: {
      vendorId: idOf(vendor),
      fundId: idOf(fund),
      orderNumber: 'CMD-2026-01',
      lines: [{ title: 'Contes de Perrault', quantity: 1, unitPrice: '8.00', currency: 'EUR' }],
    },
  });
}

async function setAccountLanguage(username, password, language) {
  const token = await login(username, password);
  if (username === ADMIN.login) state.token = token;
  // PUT /users/{id} leaves language unchanged. The profile route stores it.
  await call('PUT', '/auth/profile', { token, body: { language } });
}

const markers = {
  desk: 'Camille',
  record: 'Les Misérables',
  catalogue: 'Orgueil',
  holds: 'quatre-vingts',
  settings: 'Médiathèque du Parc',
  'opac-loans': 'Misérables',
  deposits: 'RIVAGE',
  acquisitions: 'CMD-2026-01',
  weeding: 'Vingt mille',
  inventory: 'octobre 2026',
  patrons: 'Inès',
  transits: 'quatre-vingts',
};

async function waitForShot(page, shot, locale) {
  await page.waitForFunction((lang) => document.documentElement.lang === lang, locale, { timeout: 15000 });
  const marker = markers[shot.name];
  await page.waitForFunction((text) => {
    if (document.body.innerText.includes(text)) return true;
    return [...document.querySelectorAll('input, textarea')].some((field) => field.value.includes(text));
  }, marker, { timeout: 15000 });
}

async function shoot(page, file) {
  const png = await page.screenshot({ type: 'png', animations: 'disabled' });
  await sharp(png).webp({ quality: 82 }).toFile(file);
}

async function openAs(page, username, password, languageReady) {
  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
  await page.locator('input[autocomplete="username"]').fill(username);
  await page.locator('input[autocomplete="current-password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL((url) => !url.pathname.endsWith('/') && !url.pathname.endsWith('/login'), { timeout: 20000 });
  if (page.url().includes('change-password')) {
    throw new Error(`Password change required for ${username}`);
  }
  await page.waitForTimeout(languageReady);
}

async function prepare(page, shot, locale) {
  if (shot.prepare === 'desk') {
    await page.goto(`${base}/loans`, { waitUntil: 'domcontentloaded' });
    const field = page.locator('input[name="userBarcode"]');
    await field.waitFor({ timeout: 15000 });
    await field.fill(ADULT.barcode);
    await field.press('Enter');
  } else if (shot.prepare === 'record') {
    await page.goto(`${base}/biblios/${state.recordId}`, { waitUntil: 'domcontentloaded' });
  } else if (shot.prepare === 'patron-record') {
    await page.goto(`${base}/users/${state.childId}`, { waitUntil: 'domcontentloaded' });
  } else {
    await page.goto(`${base}${shot.path}`, { waitUntil: 'domcontentloaded' });
  }
  await waitForShot(page, shot, locale);
}

async function captureLocale(browser, locale) {
  const language = locale === 'en' ? 'english' : 'french';
  await setAccountLanguage(ADMIN.login, ADMIN.password, language);
  await setAccountLanguage(ADULT.login, ADULT.password, language);
  await setAccountLanguage(CHILD.login, CHILD.password, language);

  for (const theme of ['light', 'dark']) {
    for (const viewport of [
      { suffix: '', width: 1440, height: 900, scale: 1 },
      { suffix: '-mobile', width: 390, height: 844, scale: 2 },
    ]) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.scale,
        locale: locale === 'en' ? 'en-GB' : 'fr-FR',
        colorScheme: theme,
      });
      await context.addInitScript((value) => {
        localStorage.setItem('theme', value);
      }, theme);
      const page = await context.newPage();
      const who = (shot) => (shot.prepare === 'patron' ? ADULT : ADMIN);
      let signed = null;
      for (const shot of shots) {
        const account = who(shot);
        const key = account.login;
        if (signed !== key) {
          await context.clearCookies();
          await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
          await page.evaluate(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('auth_token');
            sessionStorage.clear();
          });
          await openAs(page, account.login, account.password, 400);
          signed = key;
        }
        await prepare(page, shot, locale);
        const dir = path.join(root, 'public/screens', locale, theme);
        await mkdir(dir, { recursive: true });
        await shoot(page, path.join(dir, `${shot.name}${viewport.suffix}.webp`));
        console.log(`${locale} ${theme} ${shot.name}${viewport.suffix}`);
      }
      await context.close();
    }
  }
}

const browser = await chromium.launch({ headless: true });
try {
  await seed();
  await captureLocale(browser, 'fr');
  await captureLocale(browser, 'en');
} finally {
  await browser.close();
}
