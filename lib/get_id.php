<?php

require_once('../phpFlickr/phpFlickr.php');

$username = 'Mark and Jody Reed';
$apiKey = 'c7f9162017db946e75f485b47eb10641';
$apiSecret = '08e1ed973d7fd8f4';
$flickr = new phpFlickr($apiKey, $apiSecret);
$nsid = $flickr->people_findByUsername($username);
?><?=$nsid['nsid']?>


