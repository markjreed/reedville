<?php 
if ($path_info = $_SERVER['PATH_INFO'])
{
    $path_info = substr($path_info, 1);
    if (is_numeric($path_info))
    {
	 $file = sprintf("%03d_rfb.mp3", $path_info);
	 if (!file_exists("rfb/$file"))
	 {
	    $url = "http://wilwheaton.typepad.com/files/$file";
	    $ch = curl_init($url);
            $fp = fopen("rfb/$file", "w");
	    curl_setopt($ch, CURLOPT_FILE, $fp);
	    curl_setopt($ch, CURLOPT_HEADER, 0);	
	    curl_exec($ch);
	    curl_close($ch);
	    fclose($fp);
	 }
	 header("Location: ../rfb/$file");
	 exit(0);
    }
}
?>
    <html><head><title>Not Found</title></head><body><h1>Entry not found</h1></body></html>

