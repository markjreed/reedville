<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <?php include("head.txt")?>
  <title>Houston County Truth: Letters Index</title>
</head>

<body onload="setCurrent('letters')">
  <?php include("header.txt")?>
<?php require("inc.php"); ?>
   <p>
    These are letters written by me and others about SPLOST and
    other topics.
   </p>
   <ul>
<?php
   foreach ($LETTERS as $key => $letter)
   { ?>
    <li><a href="<?=$letter['HREF']?>"><?=htmlentities($letter['TITLE'])?></a></li>
<?php } ?>
</ul>
<?php include("../footer.txt")?>
</body>
</html>
