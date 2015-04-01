#!/bin/bash

cd $HOME/.all_media_symlinks/tvshows_live_action/
ls ./*/Season*/ | grep -v nfo | grep -v jpg > $HOME/Dropbox/_global/_live_lists/show_episode_list.txt
