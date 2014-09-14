#!/bin/bash

# This script fills a directory with a bunch of symlinks from all the media 
# content on my various media drives

# count the number of media drives available. Zero indexed.
count_hdd=$( expr $(ls -l /media | grep "media0*" | wc -l) - 1)
base=".all_media_symlinks"

generate_links () {
	# clean dir
	rm $HOME/$base/$1*
	SAVEIFS=$IFS
	IFS=$(echo -en "\n\b")
	for i in /media/media0[0-$count_hdd]/entertainment/$2$3* ; do
		
		# changing spaces and parenthesis to underscores for symlink
		# as I couldn't get the ln to play nice with spaces
		linkname=$(echo $(basename "$i") | sed -re 's/\s/_/g;s/[(]//g;s/[)]//g')
		linkpath="$HOME/.all_media_symlinks/$1$linkname"
		
		ln -s "$i" $linkpath

	done
	IFS=$SAVEIFS
	# add spaces and parethesis wrapped dates for better media scraping
	cd $HOME/$base/$1
	rename 's/_/ /g;s/(\d\d\d\d$)/\($1\)/' *
}

# symlink dir , base dir , sub dir
generate_links 'movies_anime/' 'films/' 'anime/'
generate_links 'movies_asian/' 'films/' 'asian\ live\ action/'
generate_links 'movies_live_action/' 'films/' 'live\ action/'
generate_links 'music/' 'music/'
generate_links 'tvshows_live_action/' 'tv\ shows/' 'live\ action/'
generate_links 'tvshows_anime/' 'tv\ shows/' 'anime/'
generate_links 'tvshows_asian/' 'tv\ shows/' 'asian\ live\ action/'
