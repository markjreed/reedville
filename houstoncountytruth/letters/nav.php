<?php 
require("inc.php"); 
if (preg_match('|letters/(.*?)\.php|', $_SERVER['PHP_SELF'], $matches))
{
    $keys = array_keys($LETTERS);
    $first_key = $keys[0];
    $last_key = $keys[count($keys)-1];
    $key = $matches[1];
    $first = $LETTERS[$first_key];
    $self = $LETTERS[$key];
    $prev  = $LETTERS[$self['PREV']];
    $next  = $LETTERS[$self['NEXT']];
    $last = $LETTERS[$last_key];
?>
<div align="center">
<table width="290" cellspacing="1" cellpadding="1">
 <tr>
<?php if (!$self['PREV']) { ?>
  <td bgcolor="#c0c0c0" width="58"><img class="plain"
    alt="First Letter" src="../first_inactive.png"/></td>
  <td bgcolor="#c0c0c0" width="58"><img class="plain" alt="Previous Letter" 
   src="../back_inactive.png" /></td>
<?php } else { ?>
  <td bgcolor="#0080c0" width="58"><a href="<?=$first['HREF']?>"><img 
	class="plain" alt="First Letter" src="../first.png" 
	onmouseover="swap(this,'../first_active.png')" onmouseout="unswap(this)"
	/></a></td>
  <td bgcolor="#0080c0" width="58"><a href="<?=$prev['HREF']?>"><img 
	class="plain" alt="Previous Letter" src="../back.png"
	onmouseover="swap(this,'../back_active.png')" onmouseout="unswap(this)"
/></a></td>
<?php } ?>
  <td bgcolor="#0080c0" width="58"><a href="."><img class="plain"
    alt="Letters List" src="../up.png" onmouseover="swap(this,'../up_active.png')" onmouseout="unswap(this)"/></a></td>
<?php if (!$self['NEXT']) { ?>
  <td bgcolor="#c0c0c0" width="58"><img class="plain"
    alt="Next Letter" src="../forward_inactive.png"/></td>
  <td bgcolor="#c0c0c0" width="58"><img class="plain" alt="Last Letter" 
   src="../last_inactive.png" /></td>
<?php } else { ?>
  <td bgcolor="#0080c0" width="58"><a href="<?=$next['HREF']?>"><img 
	class="plain" alt="Next Letter" src="../forward.png"
	onmouseover="swap(this,'../forward_active.png')" onmouseout="unswap(this)"
/></a></td>

  <td bgcolor="#0080c0" width="58"><a href="<?=$last['HREF']?>"><img 
	class="plain" alt="Last Letter" src="../last.png"
	onmouseover="swap(this,'../last_active.png')" onmouseout="unswap(this)"
/></a></td>
<?php } ?>
 </tr>
</table>
</div>
<?php } ?>
