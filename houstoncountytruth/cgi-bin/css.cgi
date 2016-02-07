#!/usr/bin/env perl

print "Content-Type: text/css\n\n";
open LOG,">>css.log";
print LOG time,$ENV{'HTTP_REFERER'},"\n";
close LOG;
open ENV,">css.env";
while (my ($k, $v) = each %ENV)
{
    print ENV qq{$k="$v"\n};
}
close ENV;
print <<END_CSS
body { color: darkgold; background-color: #000080;
       font-family: Arial, Helvetica, sans-serif }

a:link { color: #0000c0; }
a:active { color: #0000ff; }
a:visited { color: #0000c0; }

h1 { text-align: center }
h2 { text-align: center }
h3 { text-align: left }
p { text-align: left }
.centered { text-align: center }
.bw { color: black; background-color: white; font-family: Times, serif }
.headline { color: black; font-family: Times, serif; text-align: center }
.plain { border: none }
a:link.heading { color: #ffff00 }
div { background-color: #ffffff }
END_CSS
