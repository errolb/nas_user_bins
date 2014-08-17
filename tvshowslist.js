#!/usr/bin/env node

var fs = require('fs'),
	moment = require('moment'),
	request = require('request');

// base globals
var username = process.env.USER;	
var writeDir = '/home/' + username + '/Dropbox/_global/_torrent_watch';
var sickBeardUrl = 'http://localhost:8081/api/';
var query = '?cmd=shows&sort=name';
var listName = 'tvshowslist.md';
var completePath 	= writeDir + '/' + listName;

function processSites(callback) {
	fs.readFile('secretSickBeardKey', 'utf8', function(err, apiKey) {
		if (err) throw err;
		var fullUrl = sickBeardUrl + apiKey + '/' + query;
		fullUrl =  fullUrl.replace(/(\r\n|\n|\r)/gm,'');
		request(fullUrl, function(error, response, shows) {
			if (!error && response.statusCode == 200) {
				callback(shows);
			}
		});
	});
}

processSites(function(shows){
	shows = JSON.parse(shows);
	var md = '';
	var title = '# Live TV Shows List\n\n';
	var timeUpdated = 'Updated: __' + moment().format('MMMM Do YYYY, h:mm:ss a') + '__\n\n';
	var tableHeadings = '~ | Show Name | Quality | Network | Status | Next Ep Airdate\n';
	var tableSeperators = '- | --------- | ------- | ------- | ------ | ---------------\n';
	var count = 0;

	md = md + title + timeUpdated + tableHeadings + tableSeperators;

	for (var i in shows.data) {
		md = md + 
			count + ' | ' +
			shows.data[i].show_name + ' | ' +
			shows.data[i].quality + ' | ' +
			shows.data[i].network + ' | ' +
			shows.data[i].status + ' | ' +
			shows.data[i].next_ep_airdate + '\n';
		count++;
	}	

	fs.writeFile(completePath, md, function(err) {
		if (err) throw err;
		console.log('Live TV Shows list updated');
	});
});
