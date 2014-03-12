#!/bin/bash

# This script fills a directory with a bunch of symlinks
# from all the tv shows on my various media drives

# clean dir
rm -f $HOME/.all_media_symlinks/tvshows_live_action/*

# count the number of media drives available. Zero indexed.
count_hdd=$( expr $(ls -l /media | grep "media0*" | wc -l) - 1)

for i in /media/media0[0-$count_hdd]/entertainment/tv\ shows/live\ action/* ; do
    
    # changing spaces and parenthesis to underscores for symlink
    linkname=$(echo $(basename "$i") | sed -re 's/\s/_/g;s/[(]//g;s/[)]//g')
    linkpath="$HOME/.all_media_symlinks/tvshows_live_action/$linkname"
    
    ln -s "$i" $linkpath

done
