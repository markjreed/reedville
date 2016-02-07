function Age(birthday, with_frac)
{
    this.year    = birthday.getUTCFullYear();
    this.month   = birthday.getUTCMonth();
    this.day     = birthday.getUTCDate();
    this.hour    = birthday.getUTCHours()   || 0;
    this.minute  = birthday.getUTCMinutes() || 0;
    this.second  = birthday.getUTCSeconds() || 0;
    this.with_frac = with_frac;
}

Age.COMPONENTS = [ 'years', 'months', 'days', 'hours', 'minutes', 'seconds' ];

Age.prototype.current = function() 
{
    return this.on(new Date());
}

Age.prototype.on = function(date) 
{
    var years   = date.getUTCFullYear() - this.year
    var months  = date.getUTCMonth()    - this.month
    var days    = date.getUTCDate()     - this.day
    var hours   = date.getUTCHours()    - this.hour
    var minutes = date.getUTCMinutes()  - this.minute
    var seconds = date.getUTCSeconds()  - this.second

    if (seconds < 0)
    {
        seconds += 60;
        minutes -= 1;
    }
    if (minutes < 0)
    {
        minutes += 60;
        hours -= 1;
    }
    if (this.with_frac)
    {
	minutes += seconds/60.0;
    }
    if (hours < 0)
    {
        hours += 24;
        days -= 1;
    }
    if (this.with_frac)
    {
	hours += minutes/60.0;
    }
    if (days < 0)
    {
        months -= 1;
    }
    if (months < 0)
    {
        months += 12;
        years -= 1;
    }
    var date = new Date(date.getUTCFullYear(), date.getUTCMonth(), 31);
    var days_in_month = (31 - date.getUTCDate()) || 31;
    if (days < 0)
    {
        days += days_in_month;
    }
    if (this.with_frac)
    {
	days += hours/24.0;
	months += days/days_in_month;
	years += months/12.0;
	years = new Number(years).toFixed(8);
	months = new Number(months).toFixed(7);
	days = new Number(days).toFixed(5);
	hours = new Number(hours).toFixed(4);
	minutes = new Number(minutes).toFixed(2);
	seconds = new Number(seconds).toFixed(0);
    }
    return [years, months, days, hours, minutes, seconds]
}

