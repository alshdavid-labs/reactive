.PHONY: build clean

default: clean build

clean:
	rm -r -f dist

build:
	npx rollup -c ./rollup.config.js
	cp package.json dist
	cp README.md dist

publish:
	cd dist && npm publish --access public

test:
	npx jest --passWithNoTests  --coverage

test\:watch:
	npx jest --passWithNoTests  --watch