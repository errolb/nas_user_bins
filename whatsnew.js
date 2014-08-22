#!/usr/bin/env node

var fs = require('fs'),
	moment = require('moment'),
	request = require('request');

// base globals
var args = process.argv.slice(2);
var username = process.env.USER;	
var writeFolder = '/home/' + username + '/Dropbox/_global/_torrent_watch';
var listName = 'whatsnew.md';
var completePath = writeFolder + '/' + listName;
var newLine = args[0] + ' ' +args[1] + ' ' +args[2] + ' ' +args[3] + ' ' +
			args[4] + ' ' +args[5]; 

fs.appendFile(completePath, newLine, function (err) {
	if (err) throw err;
		console.log('Sickbeard data appended to: ' + completePath);
});

