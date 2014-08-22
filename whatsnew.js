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

// accept stdin
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {
	  process.stdout.write(data);
	  
	  fs.appendFile(completePath, data, function (err) {
		    if (err) throw err;
			  console.log('Sickbeard data appended to: ' + completePath);
	  });
});
