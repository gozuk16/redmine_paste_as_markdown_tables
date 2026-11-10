'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../assets/javascripts/paste_as_markdown_tables.js');

test('splitLines: CRLF / LF / CR を扱い、末尾の改行だけを除く', () => {
  assert.deepEqual(P.splitLines('a\tb\r\nc\td\r\n'), ['a\tb', 'c\td']);
  assert.deepEqual(P.splitLines('a\tb\nc\td\n'), ['a\tb', 'c\td']);
  assert.deepEqual(P.splitLines('a\tb\rc\td'), ['a\tb', 'c\td']);
});

test('isTable: 2行以上かつ全行の列数が同じ 2列以上なら true', () => {
  assert.equal(P.isTable('a\tb\nc\td'), true);
  assert.equal(P.isTable('a\tb'), false);
  assert.equal(P.isTable('a\nb'), false);
  assert.equal(P.isTable('a\tb\nc'), false);
  assert.equal(P.isTable(''), false);
});

test('isTable: 先頭・末尾の空セルを失わない', () => {
  assert.equal(P.isTable('a\tb\nc\t\n'), true);
  assert.equal(P.isTable('\ta\nb\tc'), true);
});

test('toTable: Markdown の表に変換する', () => {
  assert.equal(
    P.toTable('h1\th2\r\nv1\tv2\r\n'),
    '| h1 | h2 |\n|---|---|\n| v1 | v2 |\n'
  );
});

test('toTable: 空セルを保持する', () => {
  assert.equal(P.toTable('a\tb\nc\t\n'), '| a | b |\n|---|---|\n| c |  |\n');
});

test('toTable: セル内の | をエスケープする', () => {
  assert.equal(P.toTable('a|b\tc\nd\te'), '| a\\|b | c |\n|---|---|\n| d | e |\n');
});

function fakeTextarea(value, start, end) {
  return {
    value,
    selectionStart: start,
    selectionEnd: end,
    setRangeText(text, s, e, mode) {
      this.value = this.value.slice(0, s) + text + this.value.slice(e);
      if (mode === 'end') this.selectionStart = this.selectionEnd = s + text.length;
    },
  };
}

test('insertText: カーソル以降の文字列を消さない', () => {
  const el = fakeTextarea('before|after', 7, 7);
  P.insertText(el, 'XYZ');
  assert.equal(el.value, 'before|XYZafter');
  assert.equal(el.selectionStart, 10);
});

test('insertText: 選択範囲を置き換える', () => {
  const el = fakeTextarea('abcdef', 1, 4);
  P.insertText(el, 'X');
  assert.equal(el.value, 'aXef');
  assert.equal(el.selectionStart, 2);
});

test('insertText: execCommand が成功したら setRangeText を使わない', () => {
  const el = fakeTextarea('abc', 1, 1);
  const calls = [];
  const doc = { execCommand: (...args) => { calls.push(args); return true; } };
  P.insertText(el, 'X', doc);
  assert.deepEqual(calls, [['insertText', false, 'X']]);
  assert.equal(el.value, 'abc');
});

test('insertText: execCommand が失敗したら setRangeText にフォールバックする', () => {
  const el = fakeTextarea('abc', 1, 1);
  P.insertText(el, 'X', { execCommand: () => false });
  assert.equal(el.value, 'aXbc');
});

test('insertText: input / change イベントを発火する', () => {
  const el = fakeTextarea('abc', 0, 0);
  const events = [];
  el.dispatchEvent = (e) => { events.push(e.type); return true; };
  P.insertText(el, 'X', { execCommand: () => false });
  assert.deepEqual(events, ['input', 'change']);
});
