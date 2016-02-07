print <<EOF
HTTP/1.0 200 OK
Date: #{Time.now.utc.strftime("%a, %d %b %Y %H:%M:%S GMT")}
Server:
Connection: close
Content-Type: text/plain

#{RUBY_VERSION}
EOF
