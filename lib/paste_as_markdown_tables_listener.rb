class PasteAsMarkdownTablesListener < Redmine::Hook::ViewListener
  SCRIPT_PATH = File.expand_path('../assets/javascripts/paste_as_markdown_tables.js', __dir__)
  MARKDOWN_FORMATS = %w(markdown common_mark).freeze

  # Render in <head> of every page so that every wiki textarea (issue
  # description, notes, wiki, news, forums...) is covered. The issue form is
  # re-rendered by AJAX, so rendering the script there registered the paste
  # handler again and again.
  render_on :view_layouts_base_html_head, :partial => 'paste_as_markdown_tables/script'

  # The script inserts Markdown tables, so it is useless with Textile.
  # Redmine 7.0 or later converts pasted tables by itself (unsupported).
  def self.enabled?
    Redmine::VERSION::MAJOR < 7 && MARKDOWN_FORMATS.include?(Setting.text_formatting.to_s)
  end

  def self.script_source
    return File.read(SCRIPT_PATH, :encoding => 'UTF-8') if Rails.env.development?

    @script_source ||= File.read(SCRIPT_PATH, :encoding => 'UTF-8')
  end
end
