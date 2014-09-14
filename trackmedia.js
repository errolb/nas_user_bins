let fs = require('fs'),
	moment = require('moment'),
	async = require('async'),
	request = require('request');

// base globals
const username = process.env.USER;	
const listsDir = '/home/' + username + '/Dropbox/_global/_live_lists/',
	torrentsComplete = '/media/media02/downloads/complete/',
	torrentsIncomplete = '/media/media02/downloads/',
	staticMedia = '/home/' + username + '/.all_media_symlinks/',
	ignorelist = [ '.DS_Store','._.DS_Store', 'complete' ],
	SBUrl = 'http://localhost:8081/api/',
	SBQuery = '?cmd=shows&sort=name',
	sabNzbdUrl = 'http://localhost:8080/api?mode=qstatus&output=json&apikey=',
	keyPath = '/home/' + username + '/bin/';

/****************
 * EXISTING MEDIA
 ****************/

function crawlDirs(rootDir, listName) {
	fs.readdir(rootDir, function(err, folders) {
		if (err) throw err;
		let	md = '',
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
					fs.readdir(rootDir + folder + '/', function(err, files) {
						// only print stuff out if folder has files
						if (files.length) {
							md = '';
							md = md +
								'\n## ' + folder + '\n\n' +
								'~ | Title\n' +
								'- | -----\n';

							for (let i in files) {
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

}

// complete torrent downloads
crawlDirs(torrentsComplete, 'torrents_complete.md');

// all stored media
crawlDirs(staticMedia, 'all_media.md');

/**********
 * TV STATS
***********/

function processSB(listName, callback) {
	fs.readFile(keyPath + 'secretSickBeardKey', 'utf8', function(err, apiKey) {
		if (err) throw err;
		let fullUrl = SBUrl + apiKey + '/' + SBQuery;
		fullUrl =  fullUrl.replace(/(\r\n|\n|\r)/gm,'');
		request(fullUrl, function(error, response, shows) {
			if (!error && response.statusCode == 200) {
				callback(listName, shows);
			}
		});
	});
}

processSB('show_stats.md', function(listName, shows){
	shows = JSON.parse(shows);
	let md = '',
	title = '# Shows Stats List\n\n',
	timeUpdated = 'Updated: __' + moment().format('MMMM Do YYYY, h:mm:ss a') + '__\n\n',
	tableHeadings = '~ | Name | Quality | N | Status | Next Ep\n',
	tableSeperators = '- | ---- | ------- | - | ------ | --------\n',
	count = 0;

	md = md + title + timeUpdated + tableHeadings + tableSeperators;

	for (let i in shows.data) {
		md = md + 
			count + ' | ' +
			shows.data[i].show_name + ' | ' +
			shows.data[i].quality + ' | ' +
			shows.data[i].network + ' | ' +
			shows.data[i].status + ' | ' +
			shows.data[i].next_ep_airdate + '\n';
		count++;
	}	

	fs.writeFile(listsDir + listName, md, function(err) {
		if (err) throw err;
	});
});

/* ********
 * DOWNLOADS
 * ********/

// torrents incomplete
crawlDirs(torrentsIncomplete, 'torrents_incomplete.md');

function processSABnzdb(listName, callback) {
	fs.readFile(keyPath + 'secretSabnzbdKey', 'utf8', function(err, apiKey) {
		if (err) throw err;
		let fullUrl = sabNzbdUrl + apiKey;
		fullUrl =  fullUrl.replace(/(\r\n|\n|\r)/gm,'');
		request(fullUrl, function(error, response, sabData) {
			if (!error && response.statusCode == 200) {
				callback(listName, sabData);
			}
		});
	});
}

processSABnzdb('sabnzdb_incomplete.md', function(listName, sabData){
	sabData = JSON.parse(sabData);
	
	// write to SABnzbd
	let md = "# Downloading\n\n" + "## SABnzbd `( " + sabData.jobs.length + " )`\n\n" + 
					"~ | Filename | MB left | MB | Time left\n" + 
					"- | -------- | ------- | -- | ---------\n";

	for (let x in sabData.jobs) {
		md = md + 
				x + " | " +
				sabData.jobs[x].filename + " | " +
				Math.round(sabData.jobs[x].mbleft) + " | " +
				Math.round(sabData.jobs[x].mb) + " | " +
				sabData.jobs[x].timeleft + "\n";
	}

	fs.writeFile(listsDir + '/' + listName, md, function(err){ 
		if (err) throw err;
	});
});
