# Changelog

## [0.1.0] - 2026-11-10

### Fixed
- Redmine 5.0 以降（Zeitwerk）で `init.rb` の `require_dependency` が LoadError となり、プラグインが読み込まれない問題を修正
- チケットフォームが AJAX で再描画されるたびに paste ハンドラが多重登録され、表が複数回挿入される問題を修正
- 貼り付け時にカーソル以降の文字列が貼り付けた長さ分だけ上書きされる問題を修正
- 選択範囲がある状態で貼り付けた場合に、選択範囲が置き換えられない問題を修正
- 先頭・末尾の空セルが削除され、表として判定されない／列がずれる問題を修正
- セル内の `|` がエスケープされず表が崩れる問題を修正
- 貼り付け後に Ctrl+Z（元に戻す）が効かない問題を修正（`execCommand('insertText')` を優先し、使えない場合は `setRangeText`）

### Changed
- スクリプトをページの `<head>` に出力するよう変更し、チケットの注記・Wiki・ニュース・フォーラムなどすべての `.wiki-edit` テキストエリアで動作するようにした
- JavaScript を `assets/javascripts/paste_as_markdown_tables.js` に分離
- テキスト書式が Markdown / CommonMark Markdown の場合のみ有効にした（Textile では何もしない）
- Redmine 7.0 以降では何もしないようにした
- 対応バージョンを Redmine 4.x〜6.x と明記（7.0 以降はコア機能と重複するため非対応）

### Added
- JavaScript のユニットテスト（`test/`）と Makefile（`make lint` / `make test`）
