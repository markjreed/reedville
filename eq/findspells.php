<?php
//======================================================================
// Search for EQ spells by keyword and display the ingredients needed
// to create them 
//======================================================================
// CONFIGURATION PARAMETERS
//----------------------------------------------------------------------
// Where to search 
$BASE_URL      = 'http://www.eqtraders.com';
$SEARCH_URI    = '/search/search.php';

// How to search.  Our search term goes in place of the %s; other
// required parameters ganked from the form on the site.
$QUERY_FORMAT  = 
  'min=0&hits=0&Submit=Find&menustr=035000000000&data[item]=%s';
//----------------------------------------------------------------------
// END CONFIGURATION PARAMETERS
//======================================================================

// Usage: findspells.php?q=search+term
$q = $_REQUEST['q'];

// Get a version of the search term we can display safely in HTML 
// as feedback
$html_q = htmlentities($q);

// And one we can stick in the query string we send to eqtraders
$url_q = urlencode($q);

// Perform the top-level search
$query_string = sprintf($QUERY_FORMAT, $url_q);
$results_page = POST("$BASE_URL/$SEARCH_URI", $query_string);

// Convert the result into XML
$results_as_xml = tidyToXml($results_page);

// Create a DOM tree representation of the XML
$doc = DOMDocument::loadXML($results_as_xml);

// And an XPath query engine to search it
$xpath = new DOMXPath($doc);

// The XHTML output by Tidy has an explicit namespace (<html
// xmlns="blah">), so we need to tell the query engine to use the same
// one.  The prefix ('h' here) can be anything, but we need to stick
// it in front of the names of any elements we search for (e.g. "h:td"
// to find <td> elements).
$html_element = $doc->documentElement;
$namespace = $html_element->getAttribute('xmlns');
$xpath->registerNamespace('h', $namespace);

// XPath query to find result items, based on manually examining the
// HTML output: find all the bold hyperlinks contained in table cells
// with class "intable2"
$nodeList = $xpath->query('//h:td[@class="intable2"]/h:b/h:a');

// That's all items; now we'll whittle it down to just the spells
$count = $nodeList->length;
$spells = array();
for ($i=0; $i < $count; ++$i)
{
  $a = $nodeList->item($i);

  // We want to examine the text of the link, which is the value
  // of the first child node (a Text node)
  $children = $a->childNodes;
  if ($children)
  { 
    $name = $children->item(0)->nodeValue;
    if (strstr($name, 'Spell:'))
    {
       // If it's a spell, add it to the list - but chop the
       // redundant "Spell: " off the name first.
       $spells[] = array(
	 'name' => preg_replace('/Spell:\s*/', '', $name),
	 'href' =>  $a->getAttribute('href'));
    }
  }
}

// Now we have an array of spells, with their name and a link to their
// page on eqtraders.com.  Go through and fetch those pages, repeating
// the HTML screen-scraping rigamarole to get their ingredients lists.
foreach ($spells as $i => $spell)
{
  // Do the whole GET->HTML->Tidy->XML->DOM chain at once
  $doc = DOMDocument::loadXML(tidyToXML(GET("$BASE_URL/$spell[href]")));
  $xpath = new DOMXPath($doc);
  $xpath->registerNamespace('h',$doc->documentElement->getAttribute('xmlns'));

  // This time we're looking for a list item <li> of an unordered list
  // <ul> where the item text starts with "Spell Research Components:"
  $nodeList = $xpath->query(
    '//h:ul/h:li/text()[starts-with(.,"Spell Research Components:")]');

  $components = array();
  if ($nodeList->length > 0)
  {
    // Unfortunately, the ingredients are mixed in with other stuff
    // within one big HTML <li> element.  But each one is a hyperlink
    // (<a>, to the ingredient's page), and there's a line break
    // (<br>) between the ingredients list and the rest of the text
    // there.  So we step through the sibling nodes, collecting the
    // links, until we see the break.
    for ($node = $nodeList->item(0); 
          $node && ($node->nodeName != 'br');
           $node = $node->nextSibling)
    {
      if ($node->nodeName == 'a')
      {
        // If this node is an <a> element, assume we've found an
        // ingredient, and grab its url and name just like we did for
        // the spells
	$href = $node->getAttribute('href');
	$text = $node->childNodes->item(0)->nodeValue;
	$components[] = array('name' => $text, 'href' => $href);
      }
    }
  }

  // Add the components list to the spell's entry in the array
  $spells[$i]['components'] = $components;
}

// Now we're finally ready to output some HTML of our own.
$count = count($spells);
echo("<?xml version='1.0' encoding='UTF-8'?>\n");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
  <title>EQ Spell Components</title>
 </head>
 <body>
  <h1>EQ Spell Components</h1>
  <h2>Searched for: <tt><?=$html_q?></tt></h2>
  <h3>Results: <?= $count ?> Spell<?= $count != 1 ? 's' : '' ?></h3>
  <?php if ($spells) { ?><ul>
  <?php   foreach ($spells as $spell) { ?>
   <li><a
   href="<?=$BASE_URL?>/<?=urlencode($spell['href'])?>"><?=htmlentities($spell['name'])?></a>
    <?php   if ($spell['components']) { ?>
    <ul>
    <?php     foreach ($spell['components'] as $comp) { ?>
     <li><a href="<?=htmlentities($comp['href'])?>"><?=$comp['name']?></a></li>
    <?php     } ?>
    </ul>
    <?php   } ?>
   </li>
<?php   } ?>
  </ul>
<?php } ?>
 </body>
</html><?php

//======================================================================
// UTILITY FUNCTIONS
//----------------------------------------------------------------------

// Handle the cURL stuff to GET the contents of a URL back as a string
function GET($url)
{
  // Create the cURL request object
  $ch = curl_init($url);

  // Return the result as a string instead
  // of sending it to the browser
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  // And make the request
  return curl_exec($ch);
}


// Handle the cURL stuff to POST some form parameters to a URL and get
// the resulting page as a string
function POST($url, $fields)
{
  // Create the cURL request object
  $ch = curl_init($url);

  // Set the HTTP request method to POST
  curl_setopt($ch, CURLOPT_POST, true);

  // Set the contents of the POST to the supplied form fields
  curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);

  // Return the result as a string
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  // And make the request
  return curl_exec($ch);
}

// Given a typical tag-soupy HTML page, try to convert it to
// well-formed XHTML 
function tidyToXml($htmlTagSoup)
{
  // Create the Tidy object
  $tidy = new Tidy; 

  // Parse the HTML into memory, turning on the option to convert to
  // XHTML as part of the tidying process
  $tidy->parseString($htmlTagSoup, array('output-xhtml' => true));

  // Do the tidying
  $tidy->cleanRepair();

  // And get the tidied version as a string
  $tidied_xml = tidy_get_output($tidy);

  // Opinions seem to differ as to whether the non-breaking space
  // entity '&nbsp;' is predeclared as part of XHTML.  Tidy thinks it
  // is, and so leaves it alone, while the XML parser we're about to
  // use on this string thinks otherwise.  So replace any occurrences
  // of it with its numeric equivalent (which doesn't need to be
  // declared).
  return str_replace('&nbsp;', '&#160;', $tidied_xml);
}
?>
