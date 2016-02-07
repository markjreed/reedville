<!-- Start of TheCounter.com Code -->
s="na";c="na";j="na";f=""+escape(document.referrer)
s=screen.width;v=navigator.appName
if (v != "Netscape") 
{
    c=screen.colorDepth
}
else 
{
    c=screen.pixelDepth
}
j=navigator.javaEnabled()

function pr(n) { document.write(n,"\n"); }
NS2Ch=0
if (navigator.appName == "Netscape" && navigator.appVersion.charAt(0) == "2") 
{
    NS2Ch=1
}
if (NS2Ch == 0) 
{
    r="&size="+s+"&colors="+c+"&referer="+f+"&java="+j+""
    pr( '<A HREF="http://www.TheCounter.com" TARGET="_top"><IMG' +
	' BORDER="0" WIDTH="0" HEIGHT="0"' +
	' SRC="http://c3.thecounter.com/id=2551875'+r+'"><\/A>')
}
<!-- End of TheCounter.com Code -->
