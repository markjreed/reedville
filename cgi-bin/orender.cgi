#!/usr/bin/ruby
require 'cgi'
require 'rubygems'
require 'gd2';
include Math;

q = CGI.new
print q.header('type' => 'image/png')

CELL_WIDTH  = 20
CELL_HEIGHT = CELL_WIDTH * 1.5
ROW_HEIGHT = CELL_HEIGHT * 5
DOT  = CELL_HEIGHT/5.0

rows = q['string'].split(/\s*\n\s*/)
rows.map! do |s| s.split(/\s*:\s*/) end

def thickLine(i, x1, y1, x2, y2, d, img)

    r = d/2
    theta = atan2(y1-y2, x2-x1);
    t1 = theta + Math::PI/2
    t2 = theta - Math::PI/2

    i.arc(x1, y1, d, d, 0, 360, img)
    i.fill(x1, y1, img)
    i.arc(x2, y2, d, d, 0, 360, img)
    i.fill(x2, y2, img)

    p = GD2::Polygon.new
    p.addPt(x1 + r * cos(t1), y1 - r * sin(t1))
    p.addPt(x2 + r * cos(t1), y2 - r * sin(t1))
    p.addPt(x2 + r * cos(t2), y2 - r * sin(t2))
    p.addPt(x1 + r * cos(t2), y1 - r * sin(t2))

    i.filledPolygon(p, img)
end

lines = 
{
    'a' => [[1, 5, 3, 7]],
    'e' => [[1, 3, 5, 7]],
    'i' => [[3, 1, 5, 7]],
    'o' => [[1, 5, 7]],
    'u' => [[1, 3, 7]],
    'y' => [[1, 3, 7, 3, 4]],
    'ø' => [[1, 5, 7, 5, 4]],
    "'" => [[1, 3, 7, 5]],
}

constrokes = [ 2, 1, 0 ];

consonants = %w(l d m r k n z);
    
consonants.length.times do
    |i|
    img = consonants[i]
    keys = [ "^#{img}", "#{img}[^aeiouyø']$|[aeiouyø']#{img}$", "[^aeiouyø']#{img}$" ]
    
    lines[keys[0]] = [[0,2]]
    lines[keys[1]] = [[6,8]];
    lines[keys[2]] = [[6,8]]

    keys.length.times do
   	|j|
	k = keys[j]
	3.times do
	    |n|
	    bit = 1 << n
	    if (i + 1) & bit != 0 then
	 	start = constrokes[n] + j * 3
		lines[k].push([ start, start + 3]);
	    end
        end
    end
end
    
points = []

4.times do
    |i|
    3.times do
	|j|
    	x = (j + 1) * CELL_WIDTH
        y = (i + 1) * CELL_HEIGHT
    	points.push([x,y])
    end
end

width = (3 * rows.map{|s|s.length}.max + 2) * CELL_WIDTH;
height = ROW_HEIGHT * rows.length
img = GD2::Image.new(width, height);
background = GD2::Color[152/255,0,0]
foreground = GD2::Color[1,1,1]
img.fill(0, 0, background)

rows.each_with_index do
    |syllables, row|

    blanks = 0
    syllables.each_with_index do
        |syl, s|
        cell = []
        points.each do
	    |x, y|
            y += row * ROW_HEIGHT
	    cell.push([x + (s - blanks/2.0) * 3 * CELL_WIDTH, y])
        end

        blank = true
        lines.each do
	    |k, v|
	    if syl =~ /#{k}/ then
                blank = false
	        v.each do 
		    |l|
		    last = nil
		    l.each do
		        |p|
		        if last != nil then
			    thickLine(img, 
                                *(last + cell[p] + [DOT, foreground]))
		        end
		        last = cell[p]
		    end
	        end
	    end
        end
        blanks += 1 if blank
    end
end
STDOUT.binmode
img.png STDOUT #File.new("foo.png", "w"); #STDOUT
