#
# Usage: make <target>
# 
# Escaping $ with $ in the password for the makefile.
# 

PACKAGE = medic-toolshed-data
GKEY := 0AqmNwQgVwOrSdEZWWUs1djNsb1hYNkQ5dXhsRUIxNEE

all:  spreadsheets configs

spreadsheets:
	./utils/spreadsheets.js '$(GKEY)' \
		1 'R1C1:R25C4' > json/spreadsheets/categories.json
	./utils/spreadsheets.js '$(GKEY)' \
		2 'R1C1:R80C9' > json/spreadsheets/all_constraints.json
	./utils/spreadsheets.js '$(GKEY)' \
		3 'R1C1:R25C1' > json/spreadsheets/phone_to_computer.json
	./utils/spreadsheets.js '$(GKEY)' \
		4 'R1C1:R20C1' > json/spreadsheets/computer_to_phone.json
	./utils/spreadsheets.js '$(GKEY)' \
		5 'R1C1:R25C76' > json/spreadsheets/tool_to_constraint.json

json/tools.json: json/spreadsheets/tool_to_constraint.json
	./gen_conf.js tools > json/tools.json

json/allCats.json: json/spreadsheets/categories.json
	./gen_conf.js allCats > json/allCats.json
	
configs: json/tools.json json/allCats.json
