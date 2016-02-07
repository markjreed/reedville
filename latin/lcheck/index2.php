<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<?php
  $VALID = array(
    'EXII' => true
    'EXI'  => true
    'EX'   => true
    'GM'   => true
    'PR'   => true
    'SA'   => true
    'TR'   => true
  );
  $assignment = $_REQUEST['assignment'];

   function check($string)
   {
        global $VALID;
	$result = '';
	$initials = null; $last_type = null; $last_n = null;
	$end_seen = false; $valid_seen = false;
        
        $lines = split("\n", $string);
        foreach ($lines as $i => $line)
        {
            $num = $i + 1;
            if (preg_match('/^#/', $line) || preg_match('/^\s*$/', $line))
            {
                continue;
            }
            $line = rtrim($line);
            $fields = split(' ', $line, 4);
            $ltype = $fields[0];
            $n = $fields[1];
            $who = $fields[2];
            $answer = $fields[3];
	    if ($ltype == 'END')
            {
		$end_seen = true;
		break;
	    }
	    if (!$VALID[$ltype])
            {
		if (!$valid_seen)
                {
		    $result .= "Line $num (type '$ltype') does not match format: <br/><pre>$line</pre>";
		}
		continue;
 	    }
	    $valid_seen = true;
            if (!$VALID[$ltype])
            {
                continue;
            }
	    if (!preg_match('/^[a-zA-Z0-9]{2,3}$/', $who))
            {
		$result .= "Invalid initials on line $num: <tt>$line</tt>" .
		"<br />" ;
	    }
            else
            {
                if ($initials == null)
                        $initials = $who;
		if ($who != $initials)
                {
		    $result .= "Missing initials on line $num: " .
		 	"<tt>$line</tt><br />" ;
                }
	    }
	    if (!preg_match('/^\d+$/', $n))
            {
		$result .= "Invalid number $n on line #{num}: " .
		  "<tt>$line</tt><br />" ;
	    }
	    if ($ltype == $last_type && $n != ($last_n + 1))
            {
		if ($n == $last_n)
                {
		    $result .= "$ltype number $n duplicated" .
			" at line $num: <tt>$line</tt><br />";
		} 
                else if ($n < $last_n)
                {
		    $result .= "$ltype number goes backwards" .
			" from $last_n to $n at line $n:" .
			"<tt>$line</tt><br />";
		}
                else if ($n == $last_n + 2)
                {
		    $result .=  "Skipped $ltype number " . ($last_n + 1) .
			" at line $num: <tt>$line</tt><br />";
		}
                else
                {
		    $result .= "Skipped $ltype numbers " . ($last_n + 1) .
			" through " . ($n - 1) . "at line $num: " .
			"<tt>$line</tt><br />";
		}
	    }
	    $last_type = $ltype;
            $last_n = $n;
	}
        if (!$end_seen)
        {
	        $result .= "No END line<br />";
        }
	if ($result == '')
        {
	    $result = '<font color="#00ff00">SYNTAX OK!</font>';
	}
        else
        {
	    $result = '<font color="#ff0000">' . $result . '</font>';
	}
        return $result;
   }
?>
<html>
 <head>
  <link rel="stylesheet" type="text/css" href="index.css" />
  <title>LatinStudy Collation Syntax Check</title>
 </head>
 <body onload="var a = document.latinstudy.assignment; a.select(); a.focus()">
  <h1>Check Syntax of LatinStudy Assignment</h1>

<?php   if ($_REQUEST['check'] && strlen($_REQUEST['check']) > 0) { ?>
   <h2>Results of Previous Check</h2>
   <div class="results">
<?php echo check($_REQUEST['assignment']) ?>
   </div>
	
<?php  } ?>

  <p>
   Avoid giving headaches to Meredith (or Kirk or Lori or Gary or whoever
   is collating your work)!  Copy and paste your entire assignment below
   and click either <span class="button">Check</span> button to make sure
   the format's acceptable to the collation script.
  </p>

  <form id="latinstudy" method="post" action="<?php 
        echo $_SERVER['PHP_SELF'] ?>?>">
   <table>
    <tr><td><input type="submit" name="check" value="Check" /></td></tr>
    <tr valign="top"><td><textarea name="assignment" cols="80" 
	rows="50"><?php echo $_REQUEST['assignment'] ?></textarea></td></tr>
    <tr><td><input type="submit" name="check" value="Check" /></td></tr>
   </table>
  </form>
 </body>
</html>

