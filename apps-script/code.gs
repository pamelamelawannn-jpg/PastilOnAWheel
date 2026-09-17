/**
 * Pastil Tracker - Google Apps Script backend
 *
 * Setup:
 * 1. Create or open the Google Sheet that should hold your records.
 * 2. Open Extensions > Apps Script.
 * 3. Add this file as code.gs and add index.html beside it.
 * 4. If this is a bound script, leave SPREADSHEET_ID blank.
 *    If this is a standalone script, paste the spreadsheet ID below.
 * 5. Deploy > New deployment > Web app.
 *    Execute as: Me
 *    Who has access: Anyone with the link (or your preferred access setting)
 */

const SPREADSHEET_ID = '';

const PRODUCT_SEEDS = [
  { id: 'rice', name: 'Pastil rice', shortLabel: 'Rice', price: 50, accent: 'saffron' },
  { id: 'jar', name: 'Pastil jar', shortLabel: 'Jar', price: 200, accent: 'chili' },
  { id: 'retail', name: 'Pastil jar retail', shortLabel: 'Retail', price: 170, accent: 'teal' },
];

const EXPENSE_CATEGORIES = [
  'chicken',
  'cooking oil',
  'soy sauce',
  'vinegar',
  'vegetables',
  'sporks',
  'cups and lids',
  'paperbag',
  'tissue',
  'rent',
  'apartment rent',
  'remittance',
  'utilities',
];

const SHEET_HEADERS = {
  Sales: ['id', 'productId', 'productName', 'unitPrice', 'timestamp', 'source'],
  Expenses: ['id', 'category', 'amount', 'note', 'timestamp'],
  Products: ['id', 'name', 'shortLabel', 'price', 'accent'],
  Settings: ['key', 'value'],
};

function doGet() {
  setupSheets_();
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Pastil Tracker')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getAppData() {
  setupSheets_();
  return {
    products: readObjects_('Products'),
    sales: readObjects_('Sales'),
    expenses: readObjects_('Expenses'),
    settings: readSettings_(),
    expenseCategories: EXPENSE_CATEGORIES,
  };
}

function addSale(sale) {
  const productId = String(sale.productId || '');
  const product = readObjects_('Products').find((item) => item.id === productId);
  if (!product) throw new Error('Please choose a valid product.');

  const source = sale.source === 'manual' ? 'manual' : 'clicker';
  const timestamp = validTimestamp_(sale.timestamp);
  const row = [
    makeId_('sale'),
    product.id,
    product.name,
    Number(product.price),
    timestamp,
    source,
  ];
  getSheet_('Sales').appendRow(row);
  return getAppData();
}

function addExpense(expense) {
  const category = String(expense.category || '').trim().toLowerCase();
  const amount = Number(expense.amount);
  const note = String(expense.note || '').trim();
  const date = String(expense.date || '');

  if (!EXPENSE_CATEGORIES.includes(category)) {
    throw new Error('Please choose a valid expense category.');
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Expense amount must be greater than zero.');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Please choose a valid expense date.');
  }

  const timestamp = `${date}T${new Date().toTimeString().slice(0, 8)}`;
  getSheet_('Expenses').appendRow([
    makeId_('expense'),
    category,
    amount,
    note,
    timestamp,
  ]);
  return getAppData();
}

function deleteSale(id) {
  deleteById_('Sales', id);
  return getAppData();
}

function deleteExpense(id) {
  deleteById_('Expenses', id);
  return getAppData();
}

function updateProduct(productId, price) {
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    throw new Error('Product price must be greater than zero.');
  }

  const sheet = getSheet_('Products');
  const values = sheet.getDataRange().getValues();
  for (let row = 1; row < values.length; row += 1) {
    if (String(values[row][0]) === String(productId)) {
      sheet.getRange(row + 1, 4).setValue(numericPrice);
      return getAppData();
    }
  }
  throw new Error('Product not found.');
}

function updateSettings(settings) {
  const businessName = String(settings.businessName || '').trim() || 'Pastil on a Wheel';
  const sheet = getSheet_('Settings');
  const values = sheet.getDataRange().getValues();
  let updated = false;

  for (let row = 1; row < values.length; row += 1) {
    if (String(values[row][0]) === 'businessName') {
      sheet.getRange(row + 1, 2).setValue(businessName);
      updated = true;
      break;
    }
  }

  if (!updated) sheet.appendRow(['businessName', businessName]);
  return getAppData();
}

function setupSheets_() {
  const spreadsheet = getSpreadsheet_();
  Object.keys(SHEET_HEADERS).forEach((name) => {
    let sheet = spreadsheet.getSheetByName(name);
    if (!sheet) sheet = spreadsheet.insertSheet(name);

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, SHEET_HEADERS[name].length).setValues([SHEET_HEADERS[name]]);
      sheet.setFrozenRows(1);
    }
  });

  const products = getSheet_('Products');
  if (products.getLastRow() <= 1) {
    products
      .getRange(2, 1, PRODUCT_SEEDS.length, SHEET_HEADERS.Products.length)
      .setValues(PRODUCT_SEEDS.map((product) => [
        product.id,
        product.name,
        product.shortLabel,
        product.price,
        product.accent,
      ]));
  }

  const settings = getSheet_('Settings');
  if (settings.getLastRow() <= 1) {
    settings.appendRow(['businessName', 'Pastil on a Wheel']);
  }
}

function getSpreadsheet_() {
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error(
      'No spreadsheet found. Bind this script to a Google Sheet or set SPREADSHEET_ID in code.gs.',
    );
  }
  return active;
}

function getSheet_(name) {
  const sheet = getSpreadsheet_().getSheetByName(name);
  if (!sheet) throw new Error(`Missing ${name} sheet. Reload the app to create it.`);
  return sheet;
}

function readObjects_(name) {
  const sheet = getSheet_(name);
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const headers = values[0].map(String);
  return values.slice(1).map((row) => {
    const object = {};
    headers.forEach((header, index) => {
      object[header] = row[index];
    });
    if (object.unitPrice !== undefined) object.unitPrice = Number(object.unitPrice);
    if (object.amount !== undefined) object.amount = Number(object.amount);
    if (object.price !== undefined) object.price = Number(object.price);
    return object;
  });
}

function readSettings_() {
  const settings = { businessName: 'Pastil on a Wheel' };
  readObjects_('Settings').forEach((row) => {
    if (row.key) settings[row.key] = String(row.value || '');
  });
  return settings;
}

function deleteById_(sheetName, id) {
  const sheet = getSheet_(sheetName);
  const values = sheet.getDataRange().getValues();
  for (let row = values.length - 1; row >= 1; row -= 1) {
    if (String(values[row][0]) === String(id)) {
      sheet.deleteRow(row + 1);
      return;
    }
  }
  throw new Error('Entry not found. Refresh the app and try again.');
}

function validTimestamp_(value) {
  const timestamp = value ? new Date(value) : new Date();
  if (Number.isNaN(timestamp.getTime())) return new Date().toISOString();
  return timestamp.toISOString();
}

function makeId_(prefix) {
  return `${prefix}-${new Date().getTime()}-${Math.random().toString(36).slice(2, 8)}`;
}