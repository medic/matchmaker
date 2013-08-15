#!/usr/bin/env node

var GoogleSpreadsheets = require("google-spreadsheets"),
    GoogleClientLogin = require("googleclientlogin").GoogleClientLogin;

var usage = "\nUsage: $0 [key] [sheet] [range] \n\nExample: "
    + "$0 '0AvQZcyEe-2VodHZicmpucnM5RVBOazQyTTRaUmVJR0E' 6 'R1C1:R37C10'";

var argv = require('optimist').usage(usage)
    .demand(3)
    .describe('[key]', 'Google Docs/Spreadsheet Key')
    .describe('[sheet]', 'Sheet Number, zero indexed')
    .describe('[range]', 'Cell Range R1C1:R37C10 means Row 1 Column 1 through'
        + ' Row 37 Column 10.\n            '
        + ' You can also specify a single cell like R3C4')
    .argv;

var key = argv._[0],
    sheet = argv._[1],
    range = argv._[2];

var settings = {
    gcl: {
        auth: {
            email: process.env.GCL_AUTH_EMAIL || 'you@medicmobile.org',
            password: process.env.GCL_AUTH_PASS || 'foobar',
            service: process.env.GCL_AUTH_SERVICE || 'spreadsheets',
            accountType: GoogleClientLogin.accountTypes.google
        }
    }
};

if (!settings.gcl || !settings.gcl.auth) {
    return console.error("Could not find auth settings.");
}

// default account type for Google
if (!settings.gcl.auth.accountType) {
    return console.error("Could not find auth settings accountType.");
}

var googleAuth = new GoogleClientLogin(settings.gcl.auth);

googleAuth.on(GoogleClientLogin.events.login, function(){
    GoogleSpreadsheets({
        key: key,
        auth: googleAuth.getAuthId()
    }, function(err, spreadsheet) {

        if (err)
            return console.log(JSON.stringify(err,null,2));

        spreadsheet.worksheets[sheet].cells({
            range: range
        }, function(err, cells) {
            if (err)
                return console.log(JSON.stringify(err,null,2));
            // Cells will contain a 2 dimensional array with all cell data in the
            // range requested.
            console.log(JSON.stringify(cells,null,2));
        });
    });
});

googleAuth.login();
