#!/usr/bin/ruby
require 'rubygems'
puts "Content-Type: text/plain\n\n"
puts Gem.instance_eval { @gem_path }
