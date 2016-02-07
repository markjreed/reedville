<?php
//======================================================================
// calculate the current in-game time for Mafia.
// Each game day starts with "sunrise" on Monday, Wednesday, or Friday at
// 1500 UTC.  The day phase for that day ends with "sunset" the next Tuesday,
// Thursday, or Sunday at 2300 UTC.
//----------------------------------------------------------------------

if (!($fh = fopen("access.log", "a")))
{
    die("Unable to open access log");
}
fwrite($fh, $_SERVER['REMOTE_ADDR']."\n");
fclose($fh);


// This game started on Friday, 2008 March 28.
$GAME_START = gmmktime(15,0,0,3,28,2008);

// Math gets easier if we count from Monday.
$GAME_EPOCH = $GAME_START - 4 * 86400;

// OK, find out how far into the game we are
$now = time();

$time_into_game = $now - $GAME_EPOCH;

// Find out how many weeks (= 3 in-world days) that is
$weeks = floor($time_into_game / 604800);

// And how many in-world days we are into the week
// (the max() accounts for the long Friday-Monday day)
$days_into_week = min(floor(($time_into_game % 604800) / 172800), 2);

// find out when the current day started
$last_sunrise = $GAME_EPOCH + $weeks * 604800 + $days_into_week * 172800;

// and when it ends
if ($days_into_week == 2)
{
    $next_sunrise = $GAME_EPOCH + ($weeks + 1) * 604800;
}
else
{
    $next_sunrise = $last_sunrise + 172800;
}
$sunset = $next_sunrise - 57600;

        if ($now < $sunset)
        {
            $hour = 6 + ($now - $last_sunrise) / ($sunset - $last_sunrise) * 12;
        }
        elseif ($now < $midnight)
        {
            $hour = 18 + ($now - $sunset) / ($midnight - $sunset) * 6;
        }
        else
        {
            $hour = ($now - $midnight) / ($next_sunrise - $midnight) * 6;
        }
        $minute = floor(($hour - floor($hour)) * 60);
        $ap = $hour >= 12 ? 'pm' : 'am';
        $frac_hour = $hour - floor($hour);
        $hour = floor($hour) % 12 + $frac_hour;
        $ha = (90 - $hour / 12 * 360) * pi() / 180.0;
        $ma = (90 - $minute / 60 * 360) * pi() / 180.0;
        $time = sprintf("%2d:%02d $ap", $hour, $minute);
  
$noon = ($last_sunrise + $sunset) / 2;
$midnight = ($sunset + $next_sunrise) / 2;
$day = $weeks * 3 + $days_into_week - 1;

$current = 'DAY';
$prev = array('SUNRISE', $last_sunrise);
$next = array('SUNSET', $sunset);
$height = ($now - $last_sunrise) / ($noon - $last_sunrise);
$width = ($now - $last_sunrise) / ($sunset - $last_sunrise);

if ($now >= $noon)
{
    $height = 1 - ($now - $noon) / ($sunset - $noon);
}

$sr = floor($height * 240);
$sg = floor($height * 255);
$sb = floor(128 + $height * 127);

$og = floor(128 + $height * 128);
$ob = floor($height * 255);
$orb = "rgb(255,$og,$ob)";
if ($now >= $sunset)
{
    $orb = "rgb(250,255,255)";
    $color = 'rgb(0,0,80)';
    $current = 'NIGHT';
    $prev = array('SUNSET', $sunset);
    $next = array('SUNRISE', $next_sunrise);
    $height = ($now - $sunset) / ($midnight - $sunset);
    if ($now >= $midnight)
    {
        $height = 1 - ($now - $midnight) / ($next_sunrise - $midnight);
    }
    $width = ($now - $sunset) / ($next_sunrise - $sunset);
    $sr = $sg = 0;
    $sb = floor(128 - $height * 128);
}
$color = "rgb($sr,$sg,$sb)";

$cx = $x + $width * 150;
$cy = $y + 150 - $height * 125;
$hx = $cx + 12 * cos($ha);
$hy = $cy - 12 * sin($ha);
$mx = $cx + 20 * cos($ma);
$my = $cy - 20 * sin($ma);

$delta = $next[1] - $now;
$hours = floor($delta / 3600);
$minutes = floor(($delta / 60) % 60);
$x_10 = $x+10;
$x_20 = $x+20;
$x_24 = $x+24;
$x_32 = $x+32;
$x_28 = $x+28;
$y_32 = $y+32;
$y_64 = $y+64;
$y_105 = $y+105;
$y_125 = $y+125;
$y_143 = $y+143;
$time = sprintf("%2d:%02d %s", $hour, $minute, $ap);
$rt_left = sprintf("%2dh%2dm real time", $hours, $minutes);
$until = sprintf("until %s", $next[0]);
$font = "Times";
$svg = <<<EOF
<svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink" width="150" height="150px">
 <rect x="$x" y="$y" width="150px" height="150px" fill="$color"></rect>
 <ellipse cx="${cx}px" cy="${cy}px" rx="25" ry="25" 
          fill="$orb" stroke-width="0" stroke="$orb"></ellipse>
 <text x="$x_24" y="$y_32" font-family="$font" font-size="32"
       opacity="0.9" fill="red">MAFIA</text>
 <text x="$x_32" y="$y_64" font-family="$font" font-size="32" 
       opacity="0.9" fill="red">TIME</text>
<text x="$x_10" y="$y_125" font-family="Times" font-size="18" 
      opacity="0.9" fill="red">$rt_left</text>
<text x="$x_20" y="$y_143" font-family="Times" font-size="18" 
      opacity="0.9" fill="red">$until</text>
 <line x1="$cx" y1="$cy>" x2="$hx" y2="$hy" stroke="black"  opacity="0.8"
       stroke-width="5"></line>
 <line x1="$cx" y1="$cy" x2="$mx" y2="$my" stroke="black" opacity="0.8"
       stroke-width="5"></line>
 <ellipse cx="$cx${px}" cy="${cy}px" rx="5" ry="5" fill="black"
	opacity="0.8"></ellipse>
</svg>
EOF;
$format = 'svg';
$size = 'small';
$m = array();
if (preg_match('/([^\/]*)\.(\S+)$/', $_SERVER['PATH_INFO'], $m))
{
    $size = $m[1];
    $format = $m[2];
}
if ($format == 'svg')
{
    header('Content-Type: image/svg+xml');
    print($svg);
}
elseif ($format == 'txt')
{
    header('Content-Type: text/plain');
    print("Game started: " . date("r", $GAME_START) . "\n");
    print("Now: " . date("r", $now) . "\n");
    print("Week: $weeks\n");
    print("Nycthemera: $days_into_week\n");
    print("Last sunrise: " . date("r",$last_sunrise) . "\n");
    print("Today's sunset: " . date("r",$sunset) . "\n");
    print("Next sunrise: " . date("r",$next_sunrise) . "\n");
}
else
{
    switch ($size)
    {
      case 'icon':    $dimensions =   '80x80';   break;
      case 'small':   $dimensions =  '160x160';  break;
      case 'medium':  $dimensions =  '320x320';  break;
      case 'large':   $dimensions =  '640x640';  break;
      case 'x-large': $dimensions = '1280x1280'; break;
      default:        $dimensions =  '160x160';  break;
    }
    header("Content-Type: image/$format");
    passthru("convert -resize $dimensions svg:- $format:- <<EOF\n" . $svg . "\nEOF");
}
?>
