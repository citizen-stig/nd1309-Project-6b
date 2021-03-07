init:
	cd project-6 && npm install && truffle compile

dev:
	truffle deploy
	npm run dev --prefix project-6/

test:
	truffle test

run-ganache:
	ganache-cli -m "spirit supply whale amount human item harsh scare congress discover talent hamster"
