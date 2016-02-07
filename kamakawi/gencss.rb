#!/usr/bin/ruby
onsets = [''] + %w(p t k m n l f h);
nuclei = %w(a e i o u)
syllables = onsets.collect { |o| nuclei.collect { |n| "#{o}#{n}" } }.flatten
columns = syllables
rows = syllables.reverse
rows.each_with_index do
    |row, i|
    y = (i + 1) * 30 + 1
    columns.each_with_index do
	|col, j|
	x = (j + 1) * 20
	puts "td.#{row}#{col} { background-position: -#{x} -#{y} }"
    end
end
