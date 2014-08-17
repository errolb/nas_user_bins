#!/bin/bash

# This script fills a directory with a bunch of symlinks
# from all the media content on my various media drives

# count the number of media drives available. Zero indexed.
count_hdd=$( expr $(ls -l /media | grep "media0*" | wc -l) - 1)

# ******************** TV SHOWS ********************* #

# clean dir
rm -f $HOME/.all_media_symlinks/tvshows_live_action/*

for i in /media/media0[0-$count_hdd]/entertainment/tv\ shows/live\ action/* ; do
    
    # changing spaces and parenthesis to underscores for symlink
    linkname=$(echo $(basename "$i") | sed -re 's/\s/_/g;s/[(]//g;s/[)]//g')
    linkpath="$HOME/.all_media_symlinks/tvshows_live_action/$linkname"
    
    ln -s "$i" $linkpath

done

# ******************** TV SHOWS ASIAN ********************* #

# clean dir
rm -f $HOME/.all_media_symlinks/tvshows_asian/*

for i in /media/media0[0-$count_hdd]/entertainment/tv\ shows/asian\ live\ action/* ; do
    
    # changing spaces and parenthesis to underscores for symlink
    linkname=$(echo $(basename "$i") | sed -re 's/\s/_/g;s/[(]//g;s/[)]//g')
    linkpath="$HOME/.all_media_symlinks/tvshows_asian/$linkname"
    
    ln -s "$i" $linkpath

done

# ******************** MOVIES ********************* #

# clean dir
rm -f $HOME/.all_media_symlinks/movies_live_action/*

for i in /media/media0[0-$count_hdd]/entertainment/films/live\ action/* ; do
    
    # changing spaces and parenthesis to underscores for symlink
	# as I couldn't get the ln to play nice with spaces
    linkname=$(echo $(basename "$i") | sed -re 's/\s/_/g;s/[(]//g;s/[)]//g')
    linkpath="$HOME/.all_media_symlinks/movies_live_action/$linkname"
    
    ln -s "$i" $linkpath

done

# add spaces and parethesis wrapped dates for better media scraping
cd $HOME/.all_media_symlinks/movies_live_action
rename 's/_/ /g;s/(\d\d\d\d$)/\($1\)/' *

# ******************** MOVIES ASIAN********************* #

# clean dir
rm -f $HOME/.all_media_symlinks/movies_asian/*

for i in /media/media0[0-$count_hdd]/entertainment/films/asian\ live\ action/* ; do
    
    # changing spaces and parenthesis to underscores for symlink
	# as I couldn't get the ln to play nice with spaces
    linkname=$(echo $(basename "$i") | sed -re 's/\s/_/g;s/[(]//g;s/[)]//g')
    linkpath="$HOME/.all_media_symlinks/movies_asian/$linkname"
    
    ln -s "$i" $linkpath

done

# add spaces and parethesis wrapped dates for better media scraping
cd $HOME/.all_media_symlinks/movies_asian
rename 's/_/ /g;s/(\d\d\d\d$)/\($1\)/' *


# ******************** ANIME ********************* #

# clean dir
rm -f $HOME/.all_media_symlinks/tvshows_anime/*

for i in /media/media0[0-$count_hdd]/entertainment/tv\ shows/anime/* ; do
    
    # changing spaces and parenthesis to underscores for symlink
	# as I couldn't get the ln to play nice with spaces
    linkname=$(echo $(basename "$i") | sed -re 's/\s/_/g;s/[(]//g;s/[)]//g')
    linkpath="$HOME/.all_media_symlinks/tvshows_anime/$linkname"
    
    ln -s "$i" $linkpath

done

# add spaces and parethesis wrapped dates for better media scraping
cd $HOME/.all_media_symlinks/tvshows_anime
rename 's/_/ /g;s/(\d\d\d\d$)/\($1\)/' *
