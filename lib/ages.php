<?php

function gmtime()
{
    $args = func_get_args();
    $tz = getenv("TZ");
    putenv("TZ=GMT");
    $result = call_user_func_array('localtime', $args);
    putenv("TZ=$tz");
    return $result;
}    

function subtract($time1, $time2)
{
    $years   = $time2[0] - $time1[0];
    $months  = $time2[1] - $time1[1];
    $days    = $time2[2] - $time1[2];
    $hours   = $time2[3] - $time1[3];
    $minutes = $time2[4] - $time1[4];
    $seconds = $time2[5] - $time1[5];

    if ($seconds < 0)
    {
        $seconds += 60;
        $minutes -= 1;
    }
    if ($minutes < 0)
    {
        $minutes += 60;
        $hours -= 1;
    }
    if ($hours < 0)
    {
        $hours += 24;
        $days -=1;
    }
    if ($days < 0)
    {
        $months -= 1;
    }
    if ($months < 0)
    {
        $months += 12;
        $years -= 1;
    }

    if ($days < 0)
    {
        $date = localtime(mktime(12,0,0,$time2[1],31,$time2[0]));
        $days_in_month = (31 - $date[3]) ? 31 - $date[3] : 31;
        $days += $days_in_month;
    }
    return array($years, $months, $days, $hours, $minutes, $seconds);
}

putenv("TZ=EST5EDT");

$bdays = array(
    array(103, 11, 11,  8, 24, 30), 
    array(106,  1,  7, 19, 10, 30)
);

$ages = array();

foreach ($bdays as $i => $bday) 
{
    $now = array_reverse(array_slice(gmtime(), 0, 6));
    $ages[$i] = subtract($bday, $now); 
}
?>

