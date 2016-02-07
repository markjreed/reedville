#!/usr/bin/sed -e1d
Content-Type: text/html

<html>

 <head>
  <link rel="stylesheet" type="text/css" href="/index.css"/>
  <link rel="stylesheet" type="text/css" href="index.css"/>
  <title>Okaikiar</title>
 </head>

 <body>
  <h1>Okaikiar</h1>

  <div align="left">
  <p>
  Most of my current conlang work is going on in the language
  Okaikiar, described herein.
  </p>
  
  </div>
 
  <ul>
   <li><a href="sounds.rhtml">Sounds</a></li>
   <li>Script
    <ul>
     <li><a href="script.rhtml">Description</a></li>
     <li><a href="orenderer.rhtml">Renderer</a></li>
    </ul>
   </li>
   <li><a href="nouns.rhtml">Nouns</a></li>
   <li><a href="verbs.rhtml">Verbs</a></li>
   <li><!--a href="phrases.rhtml"-->Phrases</a></li>
   <li><!--a href="sentences.rhtml"-->Sentences</a></li>
   <li><a href="lexicon.rhtml">Vocabulary</a></li>
  </ul>
  
<%
   fileName = '/home1/mjnrus/public_html/conlang/okaikiar/index.rhtml'
   fileName.untaint
   begin
	ctime = File.ctime(fileName);
   rescue
   end
   if ctime != nil
%>
  <br /><font size="2"><em>Last modified <%=ctime%></em></font>
<%
  end
%>
  </div>
 </body>
</html>

   
   

 

