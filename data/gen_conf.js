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
		genSomeCats("comp");
		break;
	case 'constraints':
		genConstraints();
		break;
	case 'phoneCats':
		genSomeCats("phone");
		break;
    default:
        console.error(usage);
}

// using console.error so it doesn't end up in stdout
return console.error('done.');

function genTools() {
    var config = [],
        constraint_ids = {};

    // take first row of tools constraints and create constraint_ids lookup
    // object. use column value in the key for easy lookup.
    _.each(tool_to_constraint.cells[1], function(constraint) {
	if (constraint.col > 4)
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
                    //tool[constraint_ids[col_num]] = col.value;
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


function genSomeCats(str) {
	var config = [],
		category_ids = {},
		sheet;

	if (str == "comp")
		sheet = c_to_p;
	if (str == "phone")
		sheet = p_to_c;
	
	_.each(sheet.cells, function(row, row_num) {
	
		// skip first row of spreadsheet
        if (row_num == 1) return;
	
        category_ids[row_num] = row[1].value;


	
    });
	
	var id = 2;
		
	_.each(categories.cells, function(row, row_num) {
        var category = {};
		
		// skip first row of spreadsheet
        if (row_num == 1) return;
		
		_.each(row, function(col, col_num) {
		

            if (col_num == 1) {
				if (category_ids[id] == col.value) {	
					category['categoryID'] = col.value;
					id++;
				} else { return true; }
			} 

            if (col_num == 2)
                category['categoryLabel'] = col.value;

            if (col_num == 3)
                category['guidingQs'] = col.value;
        });
		if (category['categoryID'])
			config.push(category);
		
	});
	
	console.log(JSON.stringify(config, null, 2));	
	
};

function genConstraints() {
	var config = [];

	_.each(constraints.cells, function(row, row_num) {
	
	    var constraint = {};
		
		// skip first row of spreadsheet
        if (row_num == 1) return;
		
		_.each(row, function(col, col_num) {
			
			

			if (col_num == 1)
					constraint['categoryID'] = col.value;
				
			if (col_num == 2)
					constraint['subcategoryID'] = col.value;
					
			if (col_num == 3)
					constraint['subcategoryLabel'] = col.value;
			if (col_num == 4)
					constraint['constraintID'] = col.value;
	
			if (col_num == 5)
					constraint['constraintLabel'] = col.value;
			if (col_num == 6)
					constraint['imageLink'] = "img/constraints/" + col.value;
				
				if (col_num == 7)
					constraint['recommendations'] = col.value
				if (col_num == 8)
					constraint['thingsToThinkAbout'] = col.value;

		});
	
		config.push(constraint);
	
	});

	console.log(JSON.stringify(config, null, 2));	
	
};


function genConfigs() {
    genTools();
	genAllCats();
	genConstraints();
	genSomeCats("comp");
	genSomeCats("phone");
};
