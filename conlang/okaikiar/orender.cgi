#!/bin/sh
GEM_HOME=/home1/mjnrus/.gem/ruby/1.8
GEM_PATH=$GEM_HOME:/usr/lib/ruby/gems/1.8
GEM_CACHE=$GEM_HOME/cache
export GEM_HOME GEM_PATH GEM_CACHE
exec ./`basename "$0" .cgi`.rb
