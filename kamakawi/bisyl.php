<?php
$vowels = array('a','e','i','o','u');
$onsets = array('', 'p', 't', 'k', 'm', 'n', 'l', 'f', 'h');
$syllables = array();
foreach ($onsets as $o)
{
  foreach ($vowels as $v)
  {
    $syllables[] = $o . $v;
  }
}
?>
<html>
 <head>
  <style type="text/css">
    .filled         { background-color: green;   }
    table           { border-collapse: collapse; }
    table *         { border: solid 1px green;   } 
    th              { font-style: italic; color: green; font-weight: normal; }
    td              { background-image: url(bisyl.png); 
                      width: 20px; height: 30px; padding: 0; margin: 0; } 
    td a            { position: relative; color: black; border: none;  }
    td a span       { display: none; }
    td:hover        { background: none; }
    td:hover a span { display: block; border: none; position: relative; 
                      left: 0; top: 8px;  width: 20px; height: 30px;
                      font-size: xx-small; overflow: hidden }
<?php
    $rows = array_reverse($syllables);
    $columns =& $syllables;
    foreach ($rows as $i => $row) 
    {
      $y = ($i + 1) * 30 + 1;
      foreach ($columns as $j => $col) 
      {
        $x = ($j + 1) * 20;
?>
     td.<?=$row?><?=$col?> { background-position: -<?=$x?> -<?=$y?> } 
<?php
      }
    }
?>
  </style>
  <title>Kamakawi Glyph Chart</title>
 </head>
 <body>
  <h1>Kamakawi Glyph Chart</h1>
  <table>
   <tr>
    <th class="filled"></th>
<?php foreach ($columns as $j => $col) { ?>
    <th><?=$col?></th>
<?php } ?>
    <th class="filled"></th>
   </tr>
<?php foreach ($rows as $i => $row) { ?>
   <tr>
    <th><?=$row?></th>
<?php   foreach ($columns as $j => $col) { $glyph = $row . $col;?>
    <td class="<?=$glyph?>"><a href="glossary.php?search=<?=$glyph?>"><span><?=$glyph?></span></a></td>
<?php   } ?>
    <th><?=$row?></th>
   </tr>
<?php } ?>
   <tr>
    <th class="filled"></th>
<?php foreach ($columns as $j => $col) { ?>
    <th><?=$col?></th>
<?php } ?>
    <th class="filled"></th>
   </tr>
  </table>
 </body>
</html>
