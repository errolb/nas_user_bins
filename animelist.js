#!/usr/bin/env node

var fs = require('fs'),
	moment = require('moment'),
	request = require('request');

// globals
var username = process.env.USER;	
var lookUpDir ='/home/' + username + '/.all_media_symlinks/tvshows_anime';
var writeFolder = '/home/' + username + '/Dropbox/_global/_live_lists';
var listName = 'animelist.md';
var completePath 	= writeFolder + '/' + listName;

function processDir(callback) {
	fs.readdir(lookUpDir, function(err, files) {
		if (err) throw err;
		callback(files);
	});
}

processDir(function(files) {
	var md = '';
	var title = '# Live Anime List';
	var timeWritten = 'Updated: __' + moment().format('MMMM Do YYYY, h:mm:ss a') + '__';

	md = md +
		title + '\n\n' +
		timeWritten + '\n\n' +
		'~ | Title\n' +
		'- | -----\n';

	for (var i in files) {
		md = md +
			i + ' | ' +
			files[i] + '\n';
	}

	fs.writeFile(completePath, md, function(err){ 
		if (err) throw err;
		console.log('Anime list updated.');
	});

});
