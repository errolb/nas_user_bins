#!/usr/bin/env node

var fs = require('fs');
var moment = require('moment');
var request = require('request');

//base globals
var username = process.env.USER;	
var	url = 'http://localhost:5050/api/'; 
var query = '/media.list';
var secretKeyPath = '/home/' + username + '/bin/';

function processSites(callback) {
	fs.readFile(secretKeyPath + 'secretCouchPotatoKey', 'utf8', function(err, data){
		if (err) throw err;
		var fullUrl = (url + data + query);
		fullUrl =  fullUrl.replace(/(\r\n|\n|\r)/gm,'');
		request(fullUrl, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				callback(JSON.parse(body));
			}
		});
	});
}

processSites(function(body) {
	var fileToWrite = 'movielist.md';
	var fullWritePath = '/home/' + username + '/Dropbox/_global/_torrent_watch/' +
					fileToWrite;
	var timeWritten = moment().format('MMMM Do YYYY, h:mm:ss a');
	var pageTitle = '# Live Movie List';
	var columnHeadings = '~ | Title | IMDB | Genres | Year';
	var columnSeperators = '- | ----- | ---- | ------ | ----';
	var markdown;

	markdown = pageTitle + '\n\n' + 
			   'Updated: ' + timeWritten + '\n\n' +
			   columnHeadings + '\n' +
			   columnSeperators + '\n';

	for (var i in body.movies) {
		if (body.movies[i].status === 'done') {
			markdown = markdown + i + ' | ' +
					body.movies[i].info.original_title + ' | ' +
					( body.movies[i].info.rating ? body.movies[i].info.rating.imdb[0] + '/' + 
					  body.movies[i].info.rating.imdb[1]  : '') + ' | ' +
					body.movies[i].info.genres.toString().replace(/,/g,', ') + ' | ' +
					body.movies[i].info.year + '\n';
		}
	}

	fs.writeFile(fullWritePath, markdown, function(err){ 
		if (err) throw err;
		console.log('Live Movie List updated.');
	});

});
