#!/usr/bin/env node
var categories = require('./json/spreadsheets/categories.json'),
    constraints = require('./json/spreadsheets/all_constraints.json'),
    c_to_p = require('./json/spreadsheets/computer_to_phone.json'),
    p_to_c = require('./json/spreadsheets/phone_to_computer.json'),
    tool_to_constraint = require('./json/spreadsheets/tool_to_constraint.json'),
    argv = require('optimist').argv,
    _ = require('underscore');

// supported arguments
var args = ['all', 'tools', 'allCats', 'compCats', 'constraints', 'phoneCats'];

var usage = "\nUsage: " + argv.$0 + " <arg>\n\n"
    + "<arg> is one of: " + args.join(', ') + ".\n\n";

if (args.indexOf(argv._[0]) === -1)
    return console.error(usage);

switch (argv._[0]) {
    case 'all':
        genConfigs();
        break;
    case 'tools':
        genTools();
        break;
	case 'allCats':
		genAllCats();
		break;
	case 'compCats':
		break;
	case 'constraints':
		break;
	case 'phoneCats':
		break;
    default:
        console.error(usage);
}

// using console.error so it doesn't end up in stdout
return console.error('done.');

function genTools() {
    var config = [],
        constraint_ids = {};

    // take second row of tools constraints and create constraint_ids lookup
    // object. use column value in the key for easy lookup.
    _.each(tool_to_constraint.cells[1], function(constraint) {
        constraint_ids[constraint.col] = constraint.value;
    });

    _.each(tool_to_constraint.cells, function(row, row_num) {
        var tool = {};

        // skip first row of spreadsheet
        if (row_num == 1) return;

        _.each(row, function(col, col_num) {
            if (col_num == 1)
                tool['productID'] = col.value;

            if (col_num == 2)
                tool['productName'] = col.value;

            if (col_num == 3)
                tool['productLink'] = col.value;

            if (col_num == 4)
                tool['description'] = col.value;

            // resolve constraint id and value based on column number
            if (constraint_ids[col_num])
                //convert true/false strings to boolean
                var isTrue, isFalse;
                if (typeof col.value === 'string') {
                    isTrue = RegExp('^\s*true\s*$','i').test(col.value);
                    isFalse = RegExp('^\s*false\s*$','i').test(col.value);
                }
                if (isTrue) {
                    tool[constraint_ids[col_num]] = true;
                } else if (isFalse) {
                    tool[constraint_ids[col_num]] = false;
                } else {
                    tool[constraint_ids[col_num]] = col.value;
                }
        });

        config.push(tool);
    });

    console.log(JSON.stringify(config, null, 2));
};


function genAllCats() {
    var config = [];

	_.each(categories.cells, function(row, row_num) {
        var category = {};
		
		// skip first row of spreadsheet
        if (row_num == 1) return;
		
		_.each(row, function(col, col_num) {
            if (col_num == 1)
                category['categoryID'] = col.value;

            if (col_num == 2)
                category['categoryLabel'] = col.value;

            if (col_num == 3)
                category['guidingQs'] = col.value;
        });
		
		config.push(category);
		
	});
	
	console.log(JSON.stringify(config, null, 2));
		
};


function genConfigs() {
    genTools();
	genAllCats();
};
