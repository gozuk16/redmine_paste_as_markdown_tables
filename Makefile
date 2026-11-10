.PHONY: all test lint

all: lint test

test:
	node --test test/*.test.js

lint:
	ruby -wc init.rb lib/paste_as_markdown_tables_listener.rb
	node --check assets/javascripts/paste_as_markdown_tables.js
