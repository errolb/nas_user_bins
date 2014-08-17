#!/usr/bin/env node

var fs = require('fs'),
	moment = require('moment'),
	request = require('request');

// base globals
var username = process.env.USER;	
var watchFolder = '/home/' + username + '/Dropbox/_global/_torrent_watch',
	incompleteDir ='/media/media02/downloads/incomplete';
var	transmissionApiKey = 'f28203358c8d11803afdc2e136414848';	
	transmissionUrl = 'http://localhost:8080/api?mode=qstatus&output=json&apikey=' + 
						transmissionApiKey;
var	realSAB = 'localhost:9091/transmission/web';

function processSites(url1, callback) {
	fs.readdir(watchFolder, function(err, files) {
		if (err) throw err;
		request(url1, function(error, response, body1) {
			if (!error && response.statusCode == 200) {
						fs.readdir(incompleteDir, function(err, files) {
							if (err) throw err;
							callback(body1, files);
						});
			}
		});
	});
}
processSites(transmissionUrl,function(body1, files){
	body1 = JSON.parse(body1);
	var list_name = 'downloading.md';
	var complete_path 	= '/home/' + username + '/Dropbox/_global/_torrent_watch/' + list_name;
	var ignore_list = [list_name, '.DS_Store','._.DS_Store'];
	
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
		if (!(ignore_list.indexOf(files[i]) > -1)) markdown = markdown + 
											files[i] + " | " + i + "\n";
	}

	var time_written = moment().format('MMMM Do YYYY, h:mm:ss a');

	markdown = markdown + "\n\n" + "This file was written on ** " + 
			   time_written + " **";

	fs.writeFile(complete_path, markdown, function(err){ 
		if (err) throw err;
		console.log('Downloading list updated.');
	});
});
