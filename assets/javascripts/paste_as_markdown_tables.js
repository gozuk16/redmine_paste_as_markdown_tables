/*
 * Redmine Paste as Markdown Tables
 *
 * Converts tab separated text (copied from Excel, Numbers, etc.) into a
 * Markdown table when it is pasted into a wiki textarea.
 */
(function (root) {
  'use strict';

  var EVENT_NAME = 'paste.pasteAsMarkdownTables';

  // Split into lines. Only line breaks around the text are removed so that
  // empty cells at the beginning / end (leading or trailing tabs) are kept.
  function splitLines(text) {
    var trimmed = String(text).replace(/^(?:\r\n|\r|\n)+|(?:\r\n|\r|\n)+$/g, '');
    if (trimmed === '') {
      return [];
    }
    return trimmed.split(/\r\n|\r|\n/);
  }

  function isTable(text) {
    var lines = splitLines(text);
    if (lines.length < 2) {
      return false;
    }
    var cellCount = lines[0].split('\t').length;
    for (var i = 1; i < lines.length; i++) {
      if (lines[i].split('\t').length !== cellCount) {
        return false;
      }
    }
    return cellCount > 1;
  }

  function escapeCell(cell) {
    return cell.replace(/\|/g, '\\|');
  }

  function toRow(line) {
    return '| ' + line.split('\t').map(escapeCell).join(' | ') + ' |\n';
  }

  function toTable(text) {
    var lines = splitLines(text);
    if (lines.length === 0) {
      return text;
    }
    var columns = lines[0].split('\t').length;
    var tableText = toRow(lines[0]);
    tableText += '|' + new Array(columns + 1).join('---|') + '\n';
    for (var i = 1; i < lines.length; i++) {
      tableText += toRow(lines[i]);
    }
    return tableText;
  }

  function dispatch(el, type) {
    if (typeof Event === 'function' && el.dispatchEvent) {
      el.dispatchEvent(new Event(type, { bubbles: true }));
    }
  }

  // Replace the current selection (or insert at the cursor) with text.
  // execCommand keeps the browser's undo history (Ctrl+Z) and fires a native
  // input event; setRangeText is the fallback.
  function insertText(el, text, doc) {
    var inserted = false;
    if (doc && typeof doc.execCommand === 'function') {
      try {
        inserted = doc.execCommand('insertText', false, text);
      } catch (ex) {
        inserted = false;
      }
    }
    if (!inserted) {
      el.setRangeText(text, el.selectionStart, el.selectionEnd, 'end');
      dispatch(el, 'input');
    }
    // Redmine's unsaved-changes warning listens to "change" on textareas.
    dispatch(el, 'change');
  }

  var api = {
    splitLines: splitLines,
    isTable: isTable,
    toTable: toTable,
    insertText: insertText
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
    return;
  }
  root.PasteAsMarkdownTables = api;

  var $ = root.jQuery;
  if (!$) {
    return;
  }
  // Re-register instead of adding: this script may be evaluated more than once.
  $(document).off(EVENT_NAME).on(EVENT_NAME, '.wiki-edit', function (e) {
    var clipboardData = e.originalEvent && e.originalEvent.clipboardData;
    if (!clipboardData) {
      return true;
    }
    var text = clipboardData.getData('text/plain');
    if (!isTable(text)) {
      return true;
    }
    e.preventDefault();
    this.focus();
    insertText(this, toTable(text), document);
    return false;
  });
})(this);
