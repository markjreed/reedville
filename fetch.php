<?php 
  include_once('magpierss/rss_fetch.inc');
  $feeds = array('MightyBear' => 'http://mightybear.livejournal.com/data/rss',
		 'Zeekar'     => 'http://zeekar.livejournal.com/data/rss',
		 'Flickr'     => 'http://api.flickr.com/services/feeds/photos_public.gne?id=86181133@N00&format=rss2');
$data = fetch_rss($feeds['Flickr']);
foreach ($data->items as $item) {
  foreach ($item as $key => $value) {
     ?><?="$key: $value\n"?><?php
  }
}
?>
