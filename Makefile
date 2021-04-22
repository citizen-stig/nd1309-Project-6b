.PHONY: test
init:
	npm install && truffle compile

dev:
	truffle deploy
	npm run dev

test:
	truffle test

run-ganache:
	ganache-cli -m "spirit supply whale amount human item harsh scare congress discover talent hamster"
