(function() {
    var $ = (function() 
      {
        var cache = {};
        return function(key) 
        {
            if (!cache[key])
                cache[key] = document.getElementById(key);
            return cache[key];
        }
     })();

    var earth = new Date();
    var cindu = new CinduDate();
    var interval_handle = null;

    function stop_clock()
    {
        window.clearInterval(interval_handle)
        interval_handle = null;
    }
        
    function start_clock()
    {
        interval_handle = window.setInterval(goto_now, 500)
        goto_now()
    }

    function toggle_clock()
    {
        if (interval_handle)
        {
            stop_clock()
        }
        else
        {
            start_clock()
        }
    }

    var saved_value = null;
    function pause_clock()
    {
        saved_value = this.value
        if (interval_handle)
            window.clearInterval(interval_handle)
    }

    function resume_clock()
    {
        if (interval_handle && this.value == saved_value)
            start_clock()
    }

    function changed_earth()
    {
        if ($('auto_cal').checked)
        {
            var cutoff = $('rules').value
            if (earth.getMoment() < cutoff)
            {
                $('earth_cal').selectedIndex = 1
                convert_earth_cal()
            }
            else
            {
                $('earth_cal').selectedIndex = 0
                convert_earth_cal()
            }
        }
        cindu.setToMatch(earth)
        updateDate()
    }
        
    function changed_earth_cal()
    {
	alert('into changed_earth_cal');
        pause_clock();
        $('auto_cal').checked = false
        convert_earth_cal()
    }

    function convert_earth_cal()
    {
        if ($('earth_cal').selectedIndex)
        {
            e = new Julian()
            e.setToMatch(earth)
        }
        else
        {
            e = new Date(earth.getTime())
        }
        earth = e
        updateDate()
    }
        
    function changed_earth_year()
    {
       stop_clock()
       var year = $('earth_year').value - 0;
       if (year <= 0)
       {
           year = -year + 1;
           $('earth_year').value = year
           $('earth_era').selectedIndex = 1 - $('earth_era').selectedIndex
        }
        if ($('earth_era').selectedIndex)
            year = -year + 1;
        if ($('earth_zone').selectedIndex)
            earth.setUTCFullYear(year)
        else
            earth.setFullYear(year)
        changed_earth();
    }

    function changed_earth_month()
    {
        stop_clock()
        if ($('earth_zone').selectedIndex)
            earth.setUTCMonth($('earth_month').selectedIndex)
        else
            earth.setMonth($('earth_month').selectedIndex)
        changed_earth()
    }

    function changed_earth_mday()
    {
        stop_clock();
        if ($('earth_zone').selectedIndex)
            earth.setUTCDate($('earth_mday').selectedIndex+1)
        else
            earth.setDate($('earth_mday').selectedIndex+1)
        changed_earth()
    }

    function changed_earth_hour()
    {
        stop_clock()
        var hour = $('earth_hour').selectedIndex + 1
        var ampm = $('earth_ampm').selectedIndex 
        if (hour == 12)
            ampm = 1 - ampm
        if (ampm)
            hour = Math.mod(hour + 12, 24)
        if ($('earth_zone').selectedIndex)
            earth.setUTCHours(hour)
        else
            earth.setHours(hour)
        changed_earth()
    }

    function changed_earth_minute()
    {
        stop_clock()
        if ($('earth_zone').selectedIndex)
            earth.setUTCMinutes($('earth_minute').selectedIndex)
        else
            earth.setMinutes($('earth_minute').selectedIndex)
        changed_earth()
    }

    function changed_earth_second()
    {
        stop_clock()
        if ($('earth_zone').selectedIndex)
            earth.setUTCSeconds($('earth_second').selectedIndex)
        else
            earth.setSeconds($('earth_second').selectedIndex)
        changed_earth()
    }

    function changed_cindu()
    {
        stop_clock()
        earth = cindu.getEarthDate()
        updateDate()
    }
        
    function changed_cindu_year()
    {
        stop_clock()
        if ($('cindu_year').value <= 0 && $('cindu_era').selectedIndex == 0)
        {
           $('cindu_year').value += 2703 
           $('cindu_era').selectedIndex = 1
        }
        else if ($('cindu_year').value > 2703 && 
            $('cindu_era').selectedIndex == 1)
        {
           $('cindu_year').value -= 2703 
           $('cindu_era').selectedIndex = 0
        }
        var year = $('cindu_year').value - 0;
        if ($('cindu_era').selectedIndex)
            year -= 2703
        cindu.setFullYear(year)
        changed_cindu();
    }

    function changed_cindu_month()
    {
        stop_clock()
        cindu.setMonth($('cindu_month').selectedIndex)
        changed_cindu()
    }

    function changed_cindu_mday()
    {
        stop_clock()
        cindu.setDate($('cindu_mday').value - 0)
        changed_cindu()
    }

    function changed_cindu_hour()
    {
        stop_clock()
        cindu.setHours($('cindu_hour').selectedIndex + 1)
        changed_cindu()
    }

    function changed_cindu_minute()
    {
        stop_clock()
        cindu.setMinutes($('cindu_minute').selectedIndex)
        changed_cindu()
    }

    window.onload = function() 
    {
        $('nojs').style.display = "none"
        var earth_months = ['January',   'February', 'March',    'April', 
                            'May',       'June',     'July',     'August', 
                            'September', 'October',  'November', 'December'];

        var cindu_months = ['açumbrés', 'açuró',   'açusit', 'açukrá', 
                            'açundrím', 'açukrét', 'açusót', 'açuprán',
                            'açusán',   'açuprót', 'çupromés', 'çuporó', 
                            'çurosit',  'çuprohá', 'çuproním', 'açulús' ];

        with ($('earth_month'))
        {
            for (var i=0; i<12; ++i)
            {
                options[options.length] = new Option(earth_months[i], i);
            }
        }

        with ($('cindu_month'))
        {
            for (var i=0; i<16; ++i)
            {
                options[options.length] = new Option(cindu_months[i], i);
            }
        }

        with ($('earth_mday'))
        {
            for (i=0; i<31; ++i)
            {
                var d = i + 1
                options[options.length] = new Option(d, d);
            }
        }

        with ($('cindu_mday'))
        {
            for (i=0; i<32; ++i)
            {
                v = i
                if (i == 0)
                {
                    v = CinduDate.WAITING
                    d = "Waiting"
                }
                else if (i == 15)
                {
                    v = CinduDate.CINJURAK
                    d = "Cinjurak"
                }
                else if (i == 16)
                {
                    v = CinduDate.DANCING
                    d = "Dancing"
                }
                else if (i > 16)
                {
                    v = i - 2
                    d = "" + v
                }
                else
                {
                    d = "" + i
                }
                options[options.length] = new Option(d, v);
            }
        }

        with ($('earth_hour'))
        {
            for (var i=1; i<=12; ++i)
            {
                options[options.length] = new Option(i,i);
            }
        }

        with ($('cindu_hour'))
        {
            for (var i=1; i<=20; ++i)
            {
                options[options.length] = new Option(i,i);
            }
        }

        with ($('earth_minute'))
        {
            for (var i=0; i<10; ++i)
            {
                options[options.length] = new Option("0"+i, i);
            }
            for (var i=10; i<60; ++i)
            {
                options[options.length] = new Option(i,i);
            }
        }

        with ($('cindu_minute'))
        {
            for (var i=0; i<10; ++i)
            {
                options[options.length] = new Option("0"+i, i);
            }
            for (var i=10; i<50; ++i)
            {
                options[options.length] = new Option(i,i);
            }
        }

        with ($('earth_second'))
        {
            for (var i=0; i<10; ++i)
            {
                options[options.length] = new Option("0"+i, i);
            }
            for (var i=10; i<60; ++i)
            {
                options[options.length] = new Option(i,i);
            }
        }

        with ($('cindu_second'))
        {
            for (var i=0; i<10; ++i)
            {
                options[options.length] = new Option("0"+i, i);
            }
            for (var i=10; i<50; ++i)
            {
                options[options.length] = new Option(i,i);
            }
        }

        $('earth_cal').onchange = changed_earth_cal
        $('earth_era').onchange = changed_earth_year
        $('earth_year').onchange = changed_earth_year
        $('earth_year').onblur = resume_clock
        $('earth_year').onfocus = pause_clock
        $('earth_month').onchange = changed_earth_month
        $('earth_mday').onchange = changed_earth_mday
        $('earth_hour').onchange = changed_earth_hour
        $('earth_minute').onchange = changed_earth_minute
        $('earth_second').onchange = changed_earth_second
        $('earth_ampm').onchange = changed_earth_hour
        $('earth_zone').onchange = changed_earth
        $('now').onclick = start_clock
        $('earth_back').onclick = function() { 
            stop_clock()
            earth.setTime(earth.getTime()-86400000)
            changed_earth()
        }
        $('earth_forward').onclick = function() { 
            stop_clock()
            earth.setTime(earth.getTime()+86400000)
            changed_earth()
        }
        $('earth_noon').onclick = function() {
            stop_clock()
            if ($('earth_zone').selectedIndex)
            {
                earth.setUTCHours(12);
                earth.setUTCMinutes(0);
                earth.setUTCSeconds(0);
            }
            else
            {
                earth.setHours(12);
                earth.setMinutes(0);
                earth.setSeconds(0);
            }
            changed_earth();
        }

        $('cindu_era').onchange = changed_cindu_year
        $('cindu_year').onblur = resume_clock
        $('cindu_year').onfocus = pause_clock
        $('cindu_year').onchange = changed_cindu_year
        $('cindu_month').onchange = changed_cindu_month
        $('cindu_mday').onchange = changed_cindu_mday
        $('cindu_hour').onchange = changed_cindu_hour
        $('cindu_minute').onchange = changed_cindu_minute
        $('cindu_back').onclick = function() { 
            stop_clock()
            cindu.yesterday()
            changed_cindu()
        }
        $('cindu_forward').onclick = function() { 
            stop_clock()
            cindu.tomorrow()
            changed_cindu()
        }
        $('cindu_noon').onclick = function() {
            stop_clock()
            cindu.setHours(11);
            cindu.setMinutes(0);
            cindu.setSeconds(0);
            changed_cindu();
        }
        start_clock()
    }

    function goto_now()
    {
        if ($('earth_cal').selectedIndex)
            earth = new Julian();
        else
            earth = new Date();
        changed_earth();
    }

    function updateDate()
    {
        updateEarth()
        updateCindu()
    }

    function updateEarth()
    {
        var weekdays  = ['Sunday',   'Monday', 'Tuesday', 'Wednesday', 
                         'Thursday', 'Friday', 'Saturday'];

        var useUTC = $('earth_zone').selectedIndex
        var wday   = useUTC ? earth.getUTCDay()      : earth.getDay();
        var year   = useUTC ? earth.getUTCFullYear() : earth.getFullYear();
        var month  = useUTC ? earth.getUTCMonth()    : earth.getMonth();
        var mday   = useUTC ? earth.getUTCDate()     : earth.getDate();
        var hour   = useUTC ? earth.getUTCHours()    : earth.getHours();
        var minute = useUTC ? earth.getUTCMinutes()  : earth.getMinutes();
        var second = useUTC ? earth.getUTCSeconds()  : earth.getSeconds();

        $('earth_wday').innerHTML = weekdays[wday]
        $('earth_utc').innerHTML = earth.toUTCString()
        if (year <= 0)
        {
            $('earth_era').selectedIndex = 1;
            year = -year + 1;
        }
        else
        {
            $('earth_era').selectedIndex = 0
        }
        $('earth_year').value = year
        $('earth_month').selectedIndex = month

        with ($('earth_mday'))
        {
            var check = new Date(year, month, mday)
            options.length = 0
            for (i=0; i<31; ++i)
            {
                var d = i + 1
                check.setDate(d)
                if (check.getMonth() != month)
                    break;
                options[options.length] = new Option(d, d);
                if (d == mday)
                    selectedIndex = i
            }
        }

        if (hour < 12)
        {
            $('earth_ampm').selectedIndex = 0;
            if (!hour)
                hour = 12;
        }
        else
        {
            $('earth_ampm').selectedIndex = 1;
            if (hour > 12) 
                hour = hour - 12;
        }

        $('earth_hour').selectedIndex = hour - 1
        $('earth_minute').selectedIndex = minute
        $('earth_second').selectedIndex = second
    }

    function updateCindu()
    {
        var weekdays  = ['lembrim', 'uwam', 'kayiñ', 'vuruna',
                         'imbar', 'turat', 'lalap'];

        var week   = cindu.week
        var wday   = cindu.getDay()
        var year   = cindu.getYear()
        var month  = cindu.getMonth()
        var mday   = cindu.getDate()
        var hour   = cindu.getHours()
        var minute = cindu.getMinutes()
        var second = cindu.getSeconds()

        if (weekdays[wday])
        {
            $('cindu_wday').innerHTML = weekdays[wday] + " of week " + week
        }
        else
        {
            $('cindu_wday').innerHTML = 'blank'
        }
        
        if (year <= 0)
        {
            $('cindu_era').selectedIndex = 1;
            year = year + 2703
        }
        else
        {
            $('cindu_era').selectedIndex = 0
        }
        $('cindu_year').value = year
        $('cindu_month').selectedIndex = month

        with ($('cindu_mday'))
        {
            options.length = 0

            if (cindu.hasWaiting())
            {
                options[options.length] = new Option("Waiting", 
                                                     CinduDate.WAITING)
                if (mday == CinduDate.WAITING)
                {
                    selectedIndex = options.length - 1
                }
            }

            for (i=1; i<10; ++i)
            {
                options[options.length] = new Option("0" + i, i)
                if (mday == i)
                {
                    selectedIndex = options.length - 1
                }
            }
            for (i=10; i<15; ++i)
            {
                options[options.length] = new Option(i, i)
                if (mday == i)
                {
                    selectedIndex = options.length - 1
                }
            }
            options[options.length] = new Option("Cinjurak", 
                                                     CinduDate.CINJURAK)
            if (mday == CinduDate.CINJURAK)
            {
                selectedIndex = options.length - 1
            }
            if (cindu.hasDancing())
            {
                options[options.length] = new Option("Dancing", 
                                                     CinduDate.DANCING)
                if (mday == CinduDate.DANCING)
                {
                    selectedIndex = options.length - 1
                }
            }
            for (i=15; i<29; ++i)
            {
                options[options.length] = new Option(i, i)
                if (mday == i)
                {
                    selectedIndex = options.length - 1
                }
            }
        }
        $('cindu_hour').selectedIndex = hour - 1
        $('cindu_minute').selectedIndex = minute
        $('cindu_second').selectedIndex = second
    }
})();
