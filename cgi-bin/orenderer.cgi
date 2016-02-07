#!/usr/bin/env ruby
require 'cgi'

def syllabify(text)
    syllables = []
    foo = []
    bar = []
    
    text.downcase!
    text.tr!('bBcCfFgGjJpPsSqQtTvVwWøØ', 
             'ddkkzzkkzzddzzkkddzzuu00');
    text.gsub!('o/', '0');
    text.gsub!('x', 'kz');

    File.open("/tmp/orenderer.log", "a") do 
	|log|
    	if (rc = (text =~ /([^dklmnrzaeiou'y0 \n\r])/))
	    log.puts("`#{text}' contains Illegal character #{$1.nil? ? "nil" : $1[0]} at position #{rc}");
    	end
    end

   text.gsub!(/([^dklmnrzaeiou'y0 \n\r])/,'');

    text.split(/ /).each do
	|a|
	foo.push('+') if foo.length > 0
        while (a.sub!(/^(.*?[^aeiou'y0][^aeiou'y0])([^aeiou'y0].*)$/, '\2')) do
	    foo.push($1)
        end
        foo.push(a) if a.length > 0
    end
    
    foo.each do
    	|f|
    	while (f.sub!(/^(.*?[^aeiou'y0])([^aeiou'y0][aeiou'y0].*)$/, '\2')) do 
    	    bar.push($1)
    	end
    	bar.push(f) if f.length > 0
    end
    
    bar.each do
    	|b|
    	while (b.sub!(/^([^aeiou'y0]?[aeiou'y0]([^aeiou'y0]+$)?)(.*)$/, '\3')) do
    	    syllables.push($1)
     	end
    	syllables.push(b) if b.length > 0
    end
    
    return syllables.map do |s| s.gsub(/0/,'ø') end
end

q = CGI.new
puts q.header("text/html; charset=ISO-8859-1")
text = q['string']

syllables = syllabify(text)
result = nil
if syllables == nil
   result = %|<h2>The text must contain only <a href="sounds.rhtml">legal Okaikiar phonemes.</a></h2>|
   syllables = []
else
   query = syllables.join(':').gsub(/[\r\n]+/, '%0a').gsub(/%0a:%0a/,':%0a').gsub(/:%0a:/,':%0a')
   result = %|<img src="orender.cgi?string=#{query}"/><br/>|
end

puts <<EOF
<html>
<head>
 <title>Orendiar Output</title>
 <link rel="stylesheet" type="text/css" href="/index.css"/>
 <link rel="stylesheet" type="text/css" href="index.css"/>
</head>
<body>
 <h1>Orendiar</h1>
 <div align="center">
  #{result}
  #{syllables.join('&nbsp;')}
 </div>
   <hr/> 
    <a target="_top" href="/">Home</a>
    <a target="_top" href="/~mark">Mark's Page</a>
    <a target="_top" href="/~mark/conlang">Mark's Conlangs</a>
    <a target="_top" href="/~mark/conlang/okaikiar">Okaikiar</a>
    <a target="_top" href="/~mark/conlang/okaikiar/script.rhtml">Orendiar Description</a>
   <hr/> 

</body>
</html>
EOF
