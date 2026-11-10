if Rails.respond_to?(:autoloaders) && Rails.autoloaders.zeitwerk_enabled?
  # Redmine 5.0 or later: the plugin's lib directory is managed by Zeitwerk and
  # is not in $LOAD_PATH, so require_dependency raises LoadError. Referencing
  # the constant autoloads it and registers the hook listener.
  PasteAsMarkdownTablesListener
else
  require_dependency 'paste_as_markdown_tables_listener'
end

Redmine::Plugin.register :redmine_paste_as_markdown_tables do
  name 'Redmine Paste As Markdown Tables plugin'
  author 'suer'
  description 'Paste as Markdown-style tables from Excel format text'
  version '0.1.0'
  url 'https://github.com/suer/redmine_paste_as_markdown_tables'
  author_url 'http://d.hatena.ne.jp/suer'
end
