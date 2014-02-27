#!/bin/bash

# This script fills a directory with a bunch of symlinks
# from all the tv shows on my various media drives

rm -f /media/media00/.all_media_symlinks/tvshows_live_action/*

for i in /media/media0[0-3]/entertainment/tv\ shows/live\ action/* ; do
    
    # changing spaces and parenthesis to underscores for symlink
    linkname=$(echo $(basename "$i") | sed -re 's/\s/_/g;s/[(]//g;s/[)]//g')
    linkpath="/media/media00/.all_media_symlinks/tvshows_live_action/$linkname"
    
    ln -s "$i" $linkpath

done
