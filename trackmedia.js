#!/usr/bin/env node

var fs = require('fs'),
	moment = require('moment'),
	async = require('async');

// base globals
var username = process.env.USER;	
var listsDir = '/home/' + username + '/Dropbox/_global/_live_lists/',
	torrentsComplete = '/media/media02/downloads/complete/',
	ignorelist = [ '.DS_Store','._.DS_Store' ];

/****************
 * EXISTING MEDIA
 ****************/

// rtorrent downloads
fs.readdir(torrentsComplete, function(err, folders) {
	if (err) throw err;
	var listName = 'completed.md',
		md = '',
		title = '# Live Complete List',
		timeWritten = 'Updated: __' + moment().format('MMMM Do YYYY, h:mm:ss a') + '__';

	md = md +
		title + '\n\n' +
		timeWritten + '\n\n';

	fs.writeFile(listsDir + listName, md, function(err) {
		if (err) throw err;
		async.each(folders, function(folder, callback) {
			// do not use ignored files
			if (!( ignorelist.indexOf(folder) > -1 )) {
				fs.readdir(torrentsComplete + folder + '/', function(err, files) {
					// only print stuff out if folder has files
					if (files.length) {
						md = '';
						md = md +
							'\n## ' + folder + '\n\n' +
							'~ | Title\n' +
							'- | -----\n';

						for (var i in files) {
							md = md +
								i + ' | ' +
								files[i] + '\n';
						}
						fs.appendFile(listsDir + listName, md, function(err) {
							if (err) throw err;
							callback();
						});
					}					
				});
			}
		}, function(err) {
			if (err) throw err;	
		});
	});
});

