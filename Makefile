init:
	npm install
	npm install --prefix project-6/

dev:
	truffle deploy
	npm run dev --prefix project-6/

test:
	truffle test
