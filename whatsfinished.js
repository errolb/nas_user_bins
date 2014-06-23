#!/usr/bin/env node

var fs = require('fs');
var moment = require('moment');

var complete_dir = '/media/media02/downloads/complete';
fs.readdir(complete_dir, function(err, files){
	
	if (err) throw err;
	
	var write_name = 'completed.md';
	var complete_path 	= '/media/media02/downloads/complete/' + write_name;
	var markdown = "# Completed Files\n\n";
	var markdown = markdown + "---\n\n";

	for (var i = 0; i <= files.length - 1; i++) {
		if (files[i] != write_name) {
			markdown = markdown + " - " + files[i] + "\n";
		}	
	}
	
	var time_written = moment().format('MMMM Do YYYY, h:mm:ss a');

	markdown = markdown + "\n" + "This file was written on ** " + 
			   time_written + " **";

	fs.writeFile(complete_path, markdown, function(err){ 
		if (err) throw err;
		console.log('Files written!');
	});
});
