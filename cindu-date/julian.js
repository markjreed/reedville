function Julian(year, month, mday)
{
    if (year === undefined)
    {
        this.setToMatch()
    }
    else
    {
        this.year = year
        this.month = month
        this.mday = mday
        this.setRD()
    }
}

Julian.DAYS   = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
Julian.MONTHS = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
Julian.EPOCH = -1

Julian.prototype.setRD = function() {
    this.rd = Julian.EPOCH - 1 + (this.year - 1) * 365 + 
              Math.floor((this.year - 1)/4) + 
              Math.floor((367 * (this.month + 1) - 362) / 12) + 
              this.mday
    if (this.month > 2)
        this.rd -= 2 - Julian.leapYear(this.year)
}

Julian.leapYear = function(year) { return (Math.mod(year, 4) == 0 ? 1 : 0) }

Julian.prototype.setToMatch = function(fromDate)
{
    if (!fromDate)
        fromDate = new Date();

    this.rd = fromDate.getMoment() 
    this.setFromRD();
}
    
Julian.prototype.setFromRD = function()
{
    var rd = Math.floor(this.rd)
    var frac = this.rd - rd
    var elapsed = rd - Julian.EPOCH
    var year = Math.floor((elapsed * 4 + 1464)/1461)
    var jan1 = new Julian(year, 0, 1).rd
    var mar1 = new Julian(year, 2, 1).rd
    var priorDays = rd - jan1
    if (rd >= mar1)
    {
        priorDays += 2 - Julian.leapYear(year)
    }
    var month = Math.floor(((12 * priorDays) + 373) / 367) - 1
    var first = new Julian(year,month,1).rd
    var mday = rd - first + 1
    this.year = year
    this.month = month
    this.mday = mday + frac
}

Julian.prototype.getYear  = function() { return this.year - 1900 }
Julian.prototype.getFullYear  = function() { return this.year }
Julian.prototype.getMonth = function() { return this.month }
Julian.prototype.getDate  = function() { return Math.floor(this.mday) }
Julian.prototype.getDay   = function() { 
    return Math.floor(Math.mod(this.rd, 7)) }
Julian.prototype.getHours = function() { 
    return Math.floor((this.mday - Math.floor(this.mday)) * 24)
}
Julian.prototype.getMinutes = function() { 
    return Math.mod(Math.floor((this.mday - Math.floor(this.mday)) * 1440),60)
}
Julian.prototype.getSeconds = function() { 
    return Math.mod((this.mday - Math.floor(this.mday)) * 86400,60)
}
Julian.prototype.getMoment = function() { return this.rd }

Julian.prototype.setFullYear  = function(year) { this.year = year; this.setRD()}
Julian.prototype.setYear  = function(year) { this.year = year + 1900; this.setRD()}
Julian.prototype.setMonth = function(month) { this.month = month; this.setRD()}
Julian.prototype.setDate  = function(mday) { 
    frac = this.mday - Math.floor(this.mday)
    this.mday = mday + frac
    this.setRD()
}
Julian.prototype.setHours = function(hour) { 
    var min = this.getMinutes()
    var sec = this.getSeconds()
    this.mday = Math.floor(this.mday) + 
        hour / 24.0 + min / 1440.0 + sec / 86400.0
    this.setRD()
}
Julian.prototype.setMinutes = function(min) { 
    var hour = this.getHours()
    var sec = this.getSeconds()
    this.mday = Math.floor(this.mday) + 
        hour / 24.0 + min / 1440.0 + sec / 86400.0
    this.setRD()
}
Julian.prototype.setSeconds = function(sec) { 
    var hour = this.getHours()
    var min = this.getMinutes()
    this.mday = Math.floor(this.mday) + 
        hour / 24.0 + min / 1440.0 + sec / 86400.0
    this.setRD()
}
Julian.prototype.setMoment = function(rd) { this.rd = rd; this.setFromRD()}
Julian.prototype.toUTCString = function() { 
    var wstr = Julian.DAYS[this.getDay()]
    var mstr = Julian.MONTHS[this.getMonth()]
    var dstr = (this.mday < 10 ? "0" : "") + Math.floor(this.mday)
    var hstr = (this.getHours() < 10 ? "0" : "") + this.getHours()
    var istr = (this.getMinutes() < 10 ? "0" : "") + this.getMinutes()
    var sstr = (this.getSeconds() < 10 ? "0" : "") + 
        Math.floor(this.getSeconds())
    return wstr + ", " + dstr + " " + mstr + " " + this.year + " " +
           hstr + ":" + istr + ":" + sstr + " GMT"
}
Julian.prototype.getTime = function() {
    return (this.rd - 1.0) * 86400000 - 62135596800000
}
Julian.prototype.setTime = function(time) {
    this.rd = (time + 62135596800000) / 86400000 + 1.0
}
