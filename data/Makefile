#
# Usage: make <target>
# 
# Escaping $ with $ in the password for the makefile.
# 

PACKAGE = medic-matchmaker-data
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
		5 'R1C1:R20C73' > json/spreadsheets/tool_to_constraint.json

json/tools.json: json/spreadsheets/tool_to_constraint.json
	./gen_conf.js tools > json/tools.json

json/allCats.json: json/spreadsheets/categories.json
	./gen_conf.js allCats > json/allCats.json
	
json/phoneCats.json: json/spreadsheets/phone_to_computer.json
	./gen_conf.js phoneCats > json/phoneCats.json

json/compCats.json: json/spreadsheets/computer_to_phone.json
	./gen_conf.js compCats > json/compCats.json

json/constraints.json: json/spreadsheets/all_constraints.json
	./gen_conf.js constraints > json/constraints.json
	
configs: json/tools.json json/allCats.json json/phoneCats.json json/compCats.json json/constraints.json 
