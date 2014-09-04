#!/usr/bin/env node

var fs = require('fs');
var moment = require('moment');
var async = require('async');

// base globals
var username = process.env.USER;	
var writeDir = '/home/' + username + '/Dropbox/_global/_live_lists';
var complete_dir = '/media/media02/downloads/complete';
var watch_folder = '/home/' + username + 'Dropbox/_global/_torrent_watch';

fs.readdir(complete_dir, function(err, files){
	
	if (err) throw err;
	
	var list_name = 'completed.md';
	var ignore_list = [list_name, '.DS_Store','._.DS_Store','downloading.md','movielist.md'];
	var complete_path 	= '/home/' + username + '/Dropbox/_global/_live_lists/' + list_name;
	var markdown = "# Completed Files\n\n";
	markdown = markdown + "---\n\n";

	for (var i = 0; i <= files.length - 1; i++) {
		if (!(ignore_list.indexOf(files[i]) > -1)) markdown = markdown + " - " + files[i] + "\n";
	}
	
	var time_written = moment().format('MMMM Do YYYY, h:mm:ss a');

	markdown = markdown + "\n" + "This file was written on ** " + 
			   time_written + " **";

	fs.writeFile(complete_path, markdown, function(err){ 
		if (err) throw err;
		console.log('Completed list updated.');
	});
});
