demo:
	mkdir -p bin/printerdemo
	rm -r -f bin/printerdemo/*
	cd printer && zip -r -D ../bin/printerdemo/demo.zip *

test:
	@echo test