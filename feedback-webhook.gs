/**
 * Google Apps Script — HCC Prototype Feedback Webhook
 *
 * Writes feedback entries into an existing table in the Google Doc.
 * The table must already exist with a header row (row 0).
 * New rows are inserted at row index 1 so the most recent entries
 * appear first, right below the header.
 *
 * Deployment steps:
 * 1. Open https://script.google.com and create a new project.
 * 2. Paste this entire file into Code.gs (replace any existing code).
 * 3. Click Deploy → New deployment.
 * 4. Choose type: "Web app".
 * 5. Set "Execute as" → Me, "Who has access" → Anyone.
 * 6. Click Deploy and copy the Web app URL.
 * 7. Paste that URL into src/app/FeedbackOverlay/FeedbackOverlay.tsx
 *    replacing YOUR_WEBHOOK_URL_HERE.
 */

var DOC_ID = '1HMGAW6fX3Rl3ausA6uvCX3F4nLh-nIderV87B9RM05M';

/**
 * Finds the first table in the document body.
 * Expects the table to already exist with a header row.
 */
function getFeedbackTable(body) {
  var tables = body.getTables();
  if (tables.length === 0) {
    throw new Error('No table found in document. Please create one with header columns first.');
  }
  return tables[0];
}

/**
 * Reads the header row of the table and returns a map of
 * field-key → column-index using fuzzy matching against known aliases.
 */
function getColumnMap(table) {
  var headerRow = table.getRow(0);

  var aliases = {
    'timestamp':    ['timestamp', 'date', 'time', 'date/time', 'date & time', 'submitted'],
    'author':       ['author', 'name', 'reviewer', 'user', 'submitted by', 'who'],
    'page':         ['page', 'route', 'url', 'path', 'location', 'page & component'],
    'component':    ['component', 'ui element', 'element', 'widget'],
    'search prompt':['search prompt', 'search', 'prompt', 'query', 'search query'],
    'comment':      ['comment', 'feedback', 'description', 'note', 'notes', 'details'],
    'status':       ['status', 'state', 'resolution', 'status / response']
  };

  var map = {};
  for (var c = 0; c < headerRow.getNumCells(); c++) {
    var raw = headerRow.getCell(c).getText().trim().toLowerCase();
    for (var field in aliases) {
      if (map.hasOwnProperty(field)) continue;
      var list = aliases[field];
      for (var a = 0; a < list.length; a++) {
        if (raw === list[a] || raw.indexOf(list[a]) !== -1) {
          map[field] = c;
          break;
        }
      }
    }
  }
  return map;
}

/**
 * Parses the incoming payload from either POST body or GET query params.
 */
function parsePayload(e) {
  if (e.postData) {
    var raw = e.postData.contents;
    if (e.postData.type === 'application/json') {
      return JSON.parse(raw);
    }
    var params = e.parameter;
    return params.payload ? JSON.parse(params.payload) : JSON.parse(raw);
  }
  return e.parameter || {};
}

/**
 * Formats a timestamp string into a human-readable date.
 */
function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });
}

/**
 * Core handler: inserts a new row into the existing feedback table.
 * Reads the header row to determine column positions, then maps
 * each feedback field to the correct cell.
 */
function handleFeedback(payload) {
  var timestamp   = payload.timestamp   || new Date().toISOString();
  var author      = payload.author      || 'Anonymous';
  var page        = payload.page        || '/';
  var component   = payload.component   || 'Unknown';
  var searchQuery = payload.searchQuery || '';
  var comment     = payload.comment     || '(no comment)';

  var prettyDate = formatTimestamp(timestamp);

  var doc  = DocumentApp.openById(DOC_ID);
  var body = doc.getBody();
  var table = getFeedbackTable(body);
  var cols  = getColumnMap(table);

  var numCols = table.getRow(0).getNumCells();
  var newRow  = table.insertTableRow(1);

  for (var i = 0; i < numCols; i++) {
    newRow.appendTableCell('');
  }

  var fieldMap = {
    'timestamp':     prettyDate,
    'author':        author,
    'page':          cols.hasOwnProperty('component') ? page : page + '  |  ' + component,
    'component':     component,
    'search prompt': searchQuery,
    'comment':       comment,
    'status':        '⚪ Open'
  };

  for (var field in fieldMap) {
    if (cols.hasOwnProperty(field)) {
      newRow.getCell(cols[field]).setText(fieldMap[field]);
    }
  }

  // Fill any unmapped cells with empty string to keep table clean
  for (var j = 0; j < numCols; j++) {
    if (newRow.getCell(j).getText() === '') {
      newRow.getCell(j).setText('');
    }
  }

  doc.saveAndClose();
}

/**
 * Handles HTTP POST requests from the feedback overlay.
 */
function doPost(e) {
  try {
    var payload = parsePayload(e);
    handleFeedback(payload);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles HTTP GET requests — used for health checks
 * or quick test submissions via query params.
 */
function doGet(e) {
  var params = e.parameter || {};

  if (params.comment) {
    try {
      handleFeedback(params);
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok' }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ready', doc: DOC_ID }))
    .setMimeType(ContentService.MimeType.JSON);
}
