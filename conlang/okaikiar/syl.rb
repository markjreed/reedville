#!/usr/bin/env ruby

def syllabify(text)
    syllables = []
    foo = []
    bar = []
    
    text.downcase!
    text.tr!('gst', 'kzd');
    if (text =~ /[^dklmnrzaeiou' ]/)
	return nil
    end

    text.split(' ').each do
	|a|
        while (a.sub!(/^(.*?[^aeiou'][^aeiou'])([^aeiou'].*)$/, '\2')) do
	    foo.push($1)
        end
        foo.push(a) if a.length > 0
    end
    
    foo.each do
    	|f|
    	while (f.sub!(/^(.*?[^aeiou'])([^aeiou'][aeiou'].*)$/, '\2')) do 
    	    bar.push($1)
    	end
    	bar.push(f) if f.length > 0
    end
    
    bar.each do
    	|b|
    	while (b.sub!(/^([^aeiou']?[aeiou']([^aeiou]+$)?)(.*)$/, '\3')) do
    	    syllables.push($1)
     	end
    	syllables.push(b) if b.length > 0
    end
    return syllables
end

text = ARGV[0]

syllables = syllabify(text)
result = nil
if syllables == nil
    STDERR.puts("The text must contain only legal Okaikiar phonemes.")
else
   puts syllables.join(':')
end
