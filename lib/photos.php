<?php

require_once('phpFlickr/phpFlickr.php');

$username = 'Mark and Jody Reed';
$apiKey = 'c7f9162017db946e75f485b47eb10641';
$apiSecret = '08e1ed973d7fd8f4';
$flickr = new phpFlickr($apiKey, $apiSecret);
$nsid = $flickr->people_findByUsername($username);

function getLatestPhoto($tags,$mode='any')
{
    global $flickr, $nsid;
    $tagList = join(",", $tags);
    $photos = $flickr->photos_search(array('user_id' => $nsid['nsid'], 
                'tags' => $tagList, 'tag_mode' => $mode, 'extras' => 'tags'));
    return $flickr->buildPhotoUrl($photos['photo'][0]);
    return null;
}
?>
