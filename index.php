<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<!-- <?= phpversion(); ?> -->
<?php 
  include_once('ages.php');
  include_once('photos.php');
  include_once('magpierss/rss_fetch.inc');

  $tags = array('chase', 'connor');
  global $urls;
  foreach ($tags as $tag)
  {
      $tags = array($tag, 'only');
      $urls[$tag] = getLatestPhoto($tags, 'all');
  }

  $row_keys = array('year', 'month', 'day', 'hour', 'minute', 'second');

  function age_td($id, $css_class, $value)
  {
      global $webTV;
      if ($webTV)
      {
        echo("<td class=\"$css_class\"><input nohighlight name=\"$id\" " .
             "bgcolor=\"#c0ffc0\" border=\"0\" id=\"$id\" size=\"2\" " .
             "value=\"$value\"></td>\n");
      }
      else
      {
        echo("<td class=\"$css_class\" id=\"$id\">$value</td>\n");
      }
  }
  function print_row($row_number)
  {
      global $row_keys, $ages;
      $row_key = $row_keys[$row_number];
      echo("<tr id=\"${row_key}_row\">\n");
      age_td('csr_' . $row_key . 's', 'connor', $ages[0][$row_number]);
      echo("<td class=\"units\">${row_key}s</td>\n");
      age_td('car_' . $row_key . 's', 'chase', $ages[1][$row_number]);
      echo("</tr>\n");
  }

  $ua = $_ENV['HTTP_USER_AGENT'];
  if (!$ua)
  {
      $req = apache_request_headers();
      $ua  = $req['User-Agent'];
  }
  $webTV = preg_match('/WebTV/', $ua);

  $left  = $webTV  ? '&lt;' : '&#x25c0;';
  $right = $webTV  ? '&gt;' : '&#x25b6;';
  $link  = $webTV  ? ''     : $right;
  $nbh   = $webTV  ? '-'    : '&#x2011;';
  $end   = $webTV  ? ''     : '/';
?>
 <head>
  <title>Reedville.US: WWW Home of Mark, Jody, Connor, and Chase Reed</title>
  <link href="http://farm5.static.flickr.com/4146/5027337551_8860db241a_s.jpg" 
        rel="apple-touch-icon" />
  <meta http-equiv="content-type" content="text/html; charset=utf-8" <?php echo $end ?>>
  <link href="index.css" rel="stylesheet" type="text/css" <?php echo $end ?>>
<?php if ($webTV) { ?>
  <link href="webtv.css" rel="stylesheet" type="text/css" <?php echo $end ?>>
<?php } ?>
  <script src="lib/Age.js" type="text/javascript"></script>
  <script src="lib/ages.js" type="text/javascript"></script>
 </head>
 <body onload="startClock()"> 
   <div id="age_div">
<?php if ($webTV) { ?><div id="h1_div"><?php } ?>
    <h1>Welcome to Reedville!</h1>
<?php if ($webTV) { ?></div><?php } ?>
<?php if ($webTV) { ?><div id="links"><table><tr><td bgcolor="white" align="left"><p><?php } ?>
<?php if ($webTV) { ?></p></td></tr></table></div><?php } ?>
    <table id="age_table">

        <tr class="heading"
<?php if ($webTV) { ?>bgcolor="#60c060" border="1"<?php } ?>
        >
         <td>CONNOR<br/><?php echo $left ?></td>
         <td>Age <br/>
<?php if (!$webTV) { ?><span class="note"><?php } ?>
(&#177; 30 sec<?php if (!$webTV) { ?>onds)</span><?php } else { ?>) <?php } ?>
         </td>
         <td>CHASE<br/><?php echo $right ?></td>
        </tr>
<?php
    for ($i=0; $i<6; ++$i)
    {
        print_row($i);
    }
?>
      </table>
     </div>
   <div id="csr_photo">
    <a style="background: url(<?php echo $urls['connor'] ?>) 50% 50%;
              background-repeat: no-repeat"
        href="http://www.flickr.com/photos/reedville/tags/connor">&nbsp;</a>
   </div>
   <div id="car_photo">
    <a style="background: url(<?php echo $urls['chase'] ?>) 50% 50%;
              background-repeat: no-repeat"
        href="http://www.flickr.com/photos/reedville/tags/chase">&nbsp;</a>
   </div>
<br clear="both">
<div class="rss_feed">
<h2 style="text-align: center">Latest Posts</h2>
<dl>
<?php
  $feeds = array('MightyBear' => 'http://mightybear.livejournal.com/data/rss',
		 'Zeekar'     => 'http://zeekar.livejournal.com/data/rss',
		 'Flickr'     => 'http://api.flickr.com/services/feeds/photos_public.gne?id=86181133@N00&format=rss2');
  $data = array();
  foreach ($feeds as $title => $url) {
    $data[$title] = fetch_rss($url)->items;
  }
  $items = array();
  for ($i=0; $i<10; ++$i) {
    $source = null;
    foreach ($data as $title => $feed) {
      if (count($feed) > 0 and (is_null($source) or 
          $feed[0]['date_timestamp'] > $data[$source][0]['date_timestamp'])) {
        # Work around stupid Flickr bug
        if ($title == 'Flickr') {
          $matches = array();
          if (preg_match('/<img src="([^"]*)"/', 
              $feed[0]['description'], $matches)) {
  	    $ch = curl_init($matches[1]);
	    curl_setopt_array($ch, array(CURLOPT_HEADER => true, 
                                         CURLOPT_NOBODY => true,
	                                 CURLOPT_FOLLOWLOCATION => false,
 	                                 CURLOPT_RETURNTRANSFER => true));
	    $result = curl_exec($ch);
	    if (preg_match('/Location:.*photo_unavailable/', $result)) {
		array_shift($data[$title]);
		continue;
	    }
	  } 
	}
 	$source = $title;
      }
    }
    $item = array_shift($data[$source]);
	
?><dt><a class="entry_title" href="<?=$item['link']?>"><?= $source ?>: <?= $item['title'] ?> ( <?= date('Y-m-d', $item['date_timestamp']) ?> )</a></dt>
<dd><?= $item['description'] ?></dd>
<?php  } ?>
</div>
 </body></html>
