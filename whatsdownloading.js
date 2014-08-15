#!/usr/bin/env node

var fs = require('fs'),
	moment = require('moment'),
	async = require('async'),
	request = require('request'),
	cheerio = require('cheerio');

// base globals
var username = process.env.USER;	
var watchFolder = '/home/' + username + '/Dropbox/_global/_torrent_watch',
	completeDir = '/media/media02/downloads/complete';
var	transmissionApiKey = 'f28203358c8d11803afdc2e136414848';	
	transmissionUrl = 'http://localhost:8080/api?mode=qstatus&output=json&apikey=' 
					+ transmissionApiKey,
	sabNzbdUrl = 'http://localhost:8080/';

function TransmissionEntry(filename, completed, size, peers){
	this.filename = filename;
	this.completed = completed;
	this.size = size;
	this.peers = peers; 	
}
function processSites(url1, url2, callback) {
	fs.readdir(watchFolder, function(err, files) {
		if (err) throw err;
		request(url1, function(error, response, body1) {
			if (!error && response.statusCode == 200) {
				request(url2, function(error, response, body2) {
					if (!error && response.statusCode == 200) {
						callback(body1, body2)
					}
				});
			}
		});
	});
}
processSites(transmissionUrl,sabNzbdUrl, function(body1, body2){
	// write SABnzbd
	//console.log(body1);
	body1 = JSON.parse(body1);
	var list_name = 'downloading.md';
	//var ignore_list = [list_name, '.DS_Store','._.DS_Store'];
	var complete_path 	= '/home/' + username + '/Dropbox/_global/_torrent_watch/' + list_name;
	var markdown = "# Downloading\n\n" + "## SABnzbd `( " + body1.jobs.length + " )`\n\n" + 
					"Filename | MB left | MB | Time left\n" + 
					"--- | --- | --- | ---\n";

	for (i in body1.jobs) {
		//markdown = markdown + 
		//console.log(i);
		markdown = markdown + body1.jobs[i].filename + " | " +
				Math.round(body1.jobs[i].mbleft) + " | " +
				Math.round(body1.jobs[i].mb) + " | " +
				body1.jobs[i].timeleft + "\n";
	}
	
	var time_written = moment().format('MMMM Do YYYY, h:mm:ss a');

	markdown = markdown + "\n\n" + "This file was written on ** " + 
			   time_written + " **";

	fs.writeFile(complete_path, markdown, function(err){ 
		if (err) throw err;
		console.log('Downloading list updated.');
	});
});
