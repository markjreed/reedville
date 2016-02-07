<?php 
  // Letters in the desired sequence
 $order = array('consequence', 'investigation', 'distribution', 'dave1', 
		  'rezoningmeeting', 'rezoneletterda');
 $LETTERS = array();
 $last = null;
 foreach ($order as $letter)
 {
     $file = "$letter.php";
     $matches = array();
     if (preg_match('|<title>Houston County Truth:\s*(.*?)</title>|msi', 
		file_get_contents($file), $matches))
     {
	$title = $matches[1];
     }
     else
     {
 	$title = ucfirst($letter);
     }
     $LETTERS[$letter] = array( 'PREV' => $last,
				'TITLE' => $title,
				'HREF' => $file);
     if (isset($last))
     {
	$LETTERS[$last]['NEXT'] = $letter;
     }
     $last = $letter;
  }
?>
