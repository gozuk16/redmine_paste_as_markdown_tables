# TODO

## Redmine 5 / 6 対応（ブランチ: fix/redmine5-6-support）

対象: Redmine 4.x〜6.x（7.0 以降はコアに表貼り付け機能があるため対象外）

- [x] Makefile を作成（test / lint）
- [x] JS ロジックを `assets/javascripts/paste_as_markdown_tables.js` に分離し、Node でテストできるようにする
- [x] JS のテストを追加（変換・判定・挿入）
- [x] init.rb: `require_dependency` が Zeitwerk 環境（Redmine 5.0 以降）で LoadError になる問題を修正
- [x] フックを `view_layouts_base_html_head` に変更し、チケットフォーム以外（注記・Wiki など）でも動くようにする
- [x] AJAX でフォームが再描画されるたびに paste ハンドラが多重登録される問題を修正
- [x] insert(): カーソル以降の文字列が上書きされる・選択範囲が無視される問題を修正
- [x] 先頭・末尾の空セルが trim で消えて表と判定されない問題を修正
- [x] セル内の `|` をエスケープ
- [x] README / CHANGELOG を更新
- [x] コードレビュー（サブエージェント）
- [x] レビュー指摘対応（Textile では無効化 / undo 対応 / Redmine 7 ガード / スクリプト読み込みのメモ化）
- [x] PR 作成

## 手動確認（未実施）

- [ ] Redmine 4.2 / 5.x / 6.x で起動し、管理 > プラグイン に表示されること
- [ ] チケット説明・注記・Wiki に Excel / Numbers のセルを貼り付け、表が 1 回だけ挿入されること
- [ ] トラッカー変更などでフォーム再描画後に貼り付けても重複しないこと
- [ ] 貼り付け後に Ctrl+Z で元に戻せること
