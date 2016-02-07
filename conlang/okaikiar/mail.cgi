#!/usr/bin/perl
# Accept a mail message from a form
use strict;
use CGI;

my $query = CGI::->new();
my $from = $query->param('from');
my $subject = $query->param('subject');
my $text = $query->param('text');

open(MAIL,"|/usr/sbin/sendmail -t");
print MAIL "From: $from\n";
print MAIL "To: mreed\n";
print MAIL "Subject: $subject\n\n";
print MAIL "$text\n.\n";
close(MAIL);

print <<END_HTML;
Content-Type: text/html

<html>
 <head>
  <title>Mail sent</title>
 </head>
 <body>
  Your message has been sent.  Thank you!
 </body>
</html>
END_HTML

exit(0);
