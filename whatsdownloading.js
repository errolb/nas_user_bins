#!/usr/bin/env node

var fs = require('fs'),
	moment = require('moment'),
	request = require('request');

// base globals
var username = process.env.USER;	
var watchFolder = '/home/' + username + '/Dropbox/_global/_torrent_watch';
var	incompleteDir ='/media/media02/downloads/incomplete';
var sabNzbdUrl = 'http://localhost:8080/api?mode=qstatus&output=json&apikey='; 
var listName = 'downloading.md';
var completePath 	= watchFolder + '/' + listName;
var ignoreList = ['.DS_Store','._.DS_Store'];

function processSites(callback) {
	fs.readFile('secretSabnzbdKey', 'utf8', function(err, data) {
		if (err) throw err;
		fs.readdir(watchFolder, function(err, files) {
			if (err) throw err;
			var fullUrl = sabNzbdUrl + data;
			fullUrl =  fullUrl.replace(/(\r\n|\n|\r)/gm,'');
			console.log(fullUrl);
			request(fullUrl, function(error, response, body1) {
				if (!error && response.statusCode == 200) {
					fs.readdir(incompleteDir, function(err, files) {
						if (err) throw err;
						callback(body1, files);
					});
				}
			});
		});
	});
}
processSites(function(body1, files){
	body1 = JSON.parse(body1);
	console.log(body1);
	
	// write to SABnzbd
	var markdown = "# Downloading\n\n" + "## SABnzbd `( " + body1.jobs.length + " )`\n\n" + 
					"Filename | MB left | MB | Time left\n" + 
					"--- | --- | --- | ---\n";

	for (var x in body1.jobs) {
		markdown = markdown + body1.jobs[x].filename + " | " +
				Math.round(body1.jobs[x].mbleft) + " | " +
				Math.round(body1.jobs[x].mb) + " | " +
				body1.jobs[x].timeleft + "\n";
	}

	// write incomplete transmission files	
	markdown = markdown + "\n## Transmission `( " + files.length + " )`\n\n" + 
					"Filename | n \n" + 
					"--- | --- \n";

	for (var i = 0; i <= files.length - 1; i++) {
		if (!(ignoreList.indexOf(files[i]) > -1)) markdown = markdown + 
											files[i] + " | " + i + "\n";
	}

	var time_written = moment().format('MMMM Do YYYY, h:mm:ss a');

	markdown = markdown + "\n\n" + "This file was written on ** " + 
			   time_written + " **";

	fs.writeFile(completePath, markdown, function(err){ 
		if (err) throw err;
		console.log('Downloading list updated.');
	});
});
