Date.prototype.getMoment = function() {
    return (this.getTime() + 62135596800000) / 86400000 + 1.0
}

Date.prototype.getRD = function() {
    return Math.floor(this.getMoment())
}

Date.prototype.setMoment = function(moment) {
    this.setTime((moment - 1.0) * 86400000 - 62135596800000)
}

Math.mod = function(a, b) {
    return a - b * Math.floor(a/b)
}

Math.amod = function(a, b) {
    return (Math.mod(a, b) || b)
}

function CinduDate(fromDate)
{
    this.setToMatch(fromDate)
}

CinduDate.LERO0 = 363155.25 + 7.0/15.0

CinduDate.prototype.hasWaiting = function()
{
    return (CinduDate.isLeapQuarter(this.getQuarter()) && this.getMonth() == 0)
}

CinduDate.prototype.hasDancing = function()
{
    return (CinduDate.isLeapQuarter(this.getQuarter()) && 
        (this.getMonth() == 4 || this.getMonth() == 8))
}

CinduDate.isLeapQuarter = function(quarter) {
    return ( Math.mod((quarter + 65) * 3, 76) < 3)
}

CinduDate.prototype.getQuarter = function()
{
    return ((this.getYear()-1) * 4) + Math.floor(this.getMonth() / 4) + 1
}

CinduDate.prototype.setToMatch = function(fromDate)
{
    if (!fromDate)
        fromDate = new Date();

    this.lero = (fromDate.getMoment() - CinduDate.LERO0) * 24.0 / 25.3;

    this.setFromLero();
}
    
CinduDate.prototype.setFromLero = function()
{
    var frac = this.lero - Math.floor(this.lero)
    lero = Math.floor(this.lero)
    var elapsed = lero - 1
    var quarter = Math.ceil((76 * elapsed + 33) / 8819)
    var prior =  Math.floor((3 * quarter + 40)/76) + (quarter - 1) * 116
    var into_quarter = lero - prior
    var is_leap = CinduDate.isLeapQuarter(quarter)
    var season = Math.amod(quarter, 4) || 4
    this.year = 1 + Math.floor((quarter - 1)/4)

    var month1_leroc = 29 + ( is_leap ? 1 : 0 )
    var since_month1 = into_quarter - month1_leroc
    var month_of_season = (since_month1 >= 1 ? 
                          Math.floor((since_month1 - 1)/29) + 2 : 1)
    this.month = (season - 1) * 4 + month_of_season
    var mday = (since_month1 >= 1 ? 
                1 + Math.mod(since_month1 - 1, 29) :
                into_quarter)
    var prefix_leap_day = (is_leap && month_of_season == 1 && season == 1)
    var midmonth_leap_day = (is_leap && month_of_season == 1 && season != 1)
    var adjusted_mday
    if (prefix_leap_day && mday > 15)
        adjusted_mday = mday - 2
    else if (prefix_leap_day)
        adjusted_mday = mday - 1
    else if (midmonth_leap_day && mday > 16)
        adjusted_mday = mday - 2
    else if (mday > 15)
        adjusted_mday = mday - 1
    else
        adjusted_mday = mday
    var week = Math.floor((adjusted_mday - 1) / 7) + 1
    var wday = Math.mod(adjusted_mday - 1, 7) + 1
    mday = Math.floor(mday)
    if (prefix_leap_day && mday == 1)
    {
        this.week = 1
        this.wday = 0
    }
    else if (prefix_leap_day && mday == 16)
    {
        this.week = 2
        this.wday = 8
    }
    else if (!prefix_leap_day && mday == 15)
    {
        this.week = 2
        this.wday = 8
    }
    else if (midmonth_leap_day & mday == 16)
    {
        this.week = 3
        this.wday = 0
    }
    else
    {
        this.week = week
        this.wday = wday
    }
    this.wday += frac
}

CinduDate.prototype.setLero = function()
{
    var quarter = this.getQuarter()
    var season = Math.amod(quarter, 4)
    var months_elapsed_in_quarter = Math.mod(this.month - 1, 4)
    var is_leap = CinduDate.isLeapQuarter(quarter)
    var past_cinjurak = (this.week > 2)
    var past_leap_day = 
        (is_leap && (months_elapsed_in_quarter > 0 || season == 1 || 
            this.week > 2))
    var prior = Math.floor(((3 * quarter) + 40) / 76) + (116 * (quarter-1))
    this.lero = prior + 29 * months_elapsed_in_quarter +
               (past_leap_day ? 1 : 0) +
               7 * (this.week - 1) +
               (past_cinjurak ? 1 : 0) +
               this.wday
    return this.lero
}

CinduDate.prototype.getEarthDate = function() 
{
    var d = new Date()
    d.setMoment(CinduDate.LERO0 + (this.lero * 25.3) / 24.0)
    return d
}

CinduDate.CINJURAK =  0
CinduDate.WAITING  = -1
CinduDate.DANCING  = -2

CinduDate.prototype.getYear = function() { return this.year }
CinduDate.prototype.getFullYear = function() { return this.year }
CinduDate.prototype.getMonth = function() { return this.month - 1 }
CinduDate.prototype.getDay = function() { return Math.floor(this.wday) - 1 }
CinduDate.prototype.getDate = function() { 
    var wday = Math.floor(this.wday)
    if (wday >= 1 && wday <= 7)
        return (this.week - 1) * 7 + wday
    else if (this.week == 2 && wday == 8)
        return CinduDate.CINJURAK
    else if (this.week == 1 && wday == 0)
        return CinduDate.WAITING
    else if (this.week == 3 && wday == 0)
        return CinduDate.DANCING
}
CinduDate.prototype.getHours = function() { 
    var frac = this.wday - Math.floor(this.wday)
    var hours = frac * 20
    return Math.floor(hours) + 1
}
CinduDate.prototype.getMinutes = function() {
    var frac = this.wday - Math.floor(this.wday)
    var hours = frac * 20
    return Math.floor((hours - Math.floor(hours)) * 50)
}
CinduDate.prototype.getSeconds = function() {
    var frac = this.wday - Math.floor(this.wday)
    var minutes = frac * 20 * 50
    return (minutes - Math.floor(minutes)) * 50.0
}

CinduDate.prototype.setYear = CinduDate.prototype.setFullYear = 
    function(newYear)
    {
        this.year = newYear
        if (this.getDate() == CinduDate.WAITING && !this.hasWaiting())
        {
            this.year = newYear - 1
            this.month = 16
            this.week = 4
            this.wday = 7
        }
        else if (this.getDate() == CinduDate.DANCING && !this.hasDancing())
        {
            this.week = 3
            this.wday = 1
        }
        this.setLero()
    }

CinduDate.prototype.setMonth = function(newMonth)
    {
        this.month = newMonth + 1
        while (this.month < 1)
        {
            this.year -= 1
            this.month += 16
        }
        while (this.month > 16)
        {
            this.year += 1
            this.month -= 16
        }

        if (this.getDate() == CinduDate.WAITING && !this.hasWaiting())
        {
            this.month -= 1
            while (this.month < 1)
            {
                this.year -= 1
                this.month += 16
            }
            this.week = 4
            this.wday = 7
        }
        else if (this.getDate() == CinduDate.DANCING && !this.hasDancing())
        {
            this.week = 3
            this.wday = 1
        }
        this.setLero()
    }

CinduDate.prototype.setDate = function(newDate)
    {
        var newWeek = 0
        var newDay
        if (newDate == CinduDate.WAITING)
        {
            newWeek = 1
            newDay = 0
        }
        else if (newDate == CinduDate.CINJURAK)
        {
            newWeek = 2
            newDay = 8 
        }
        else if (newDate == CinduDate.DANCING)
        {
            newWeek = 3
            newDay = 0
        }
        else if (newDate < 0)
        {
            month = this.month
            while (newDate < 0)
            {
                month -= 1
                newDate += 28
            }
            this.setMonth(month - 1)
        }
        else if (newDate > 28)
        {
            month = this.month
            while (newDate > 28)
            {
                month += 1
                newDate -= 28
            }
            this.setMonth(month - 1)
        }
        if (!newWeek )
        {
           newWeek = Math.floor((newDate - 1) / 7) + 1
           newDay = Math.mod(newDate - 1, 7) + 1
        }
        var frac = this.wday - Math.floor(this.wday)
        this.week = newWeek
        this.wday = newDay + frac
        this.setLero()
    }

CinduDate.prototype.setHours = function(newHours)
    {
        var min = this.getMinutes()
        var sec = this.getSeconds()
        this.wday = Math.floor(this.wday) + (newHours - 1) / 20.0 +
                    min / 1000.0 + sec / 50000.0
        this.setLero()
    }

CinduDate.prototype.setMinutes = function(newMinutes)
    {
        var hour = this.getHours()
        var sec = this.getSeconds()
        this.wday = Math.floor(this.wday) + (hour - 1) / 20.0 +
                    newMinutes / 1000.0 + sec / 50000.0
        this.setLero()
    }

CinduDate.prototype.setSeconds = function(newSeconds)
    {
        var hour = this.getHours()
        var min = this.getMinutes()
        this.wday = Math.floor(this.wday) + (hour - 1) / 20.0 +
                    min / 1000.0 + newSeconds / 50000.0
        this.setLero()
    }

CinduDate.prototype.yesterday = function()
    {
        this.lero -= 1
        this.setFromLero()
    }

CinduDate.prototype.tomorrow = function()
    {
        this.lero += 1
        this.setFromLero()
    }
