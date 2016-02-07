function $(id)
{
    return document.getElementById(id);
}

function Calendar(year, month, day, element_ids)
{
    var now = new Date();
    if (!day)
    {
        day = now.getUTCDate();
    }
    if (!month && month != "0")
    {
        month = now.getUTCMonth();
    }
    if (!year)
    {
        year = now.getUTCFullYear();
    }
    if (!element_ids)
    {
        element_ids = { table: 'days',
                        monthHeader: 'page_header',
                        monthName: 'month_name', 
                        weekdayHeader: 'weekday_header' }
    }

    this.elements = {};
    for (var key in element_ids)
    {
        if (!(this.elements[key] = $(element_ids[key])))
        {
            alert("Element '" + key + "' not found.");
            return;
        }
    }
    alert("month = " + month);
    this.day = day;
    this.month = month;
    this.year = year;
}

Calendar.MONTHS = [ 'January',   'February', 'March',    'April',
                    'May',       'June',     'July',     'August',
                    'September', 'October',  'November', 'December' ];

Calendar.WEEKDAYS = [ 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
                      'Thursday', 'Friday' ];

Calendar.prototype =
{
    display: function()
    {
        this.elements.monthName.innerHTML = 
                Calendar.MONTHS[this.month] + ' ' + this.year;
        var now = new Date();
        var cur = new Date(this.year, this.month, 1);
        var next = new Date(this.year, this.month+1, 1);
        var daysInMonth = (next.getTime() - cur.getTime()) / 86400000;

        while (cur.getUTCMonth() == this.month)
        {
            var tr = document.createElement('tr');
            this.elements.table.appendChild(tr);
            for (var i=0; i < (cur.getUTCDay() + 8)%7; ++i)
            {
                var td = document.createElement('td');
                td.innerHTML = String.fromCharCode(160);
                td.className = "blank";
                tr.appendChild(td);
            }

            do
            {
                var td = document.createElement('td');
                if (cur.getUTCMonth() == this.month)
                {
                    td.className = "day";
                    td.innerHTML = cur.getUTCDate();
                    if (cur.getUTCDate() < this.day)
                    {
                        td.className += " past";
                    }
                }
                else
                {
                    td.className = "blank";
                }
                tr.appendChild(td);
                cur = new Date(cur.getTime() + 86400000);
            }
            while ((cur.getUTCDay()+8)%7);
        }
        this.elements.table.style.visibility = 'visible';
    }
}

Calendar.initialize = function() {
    var cal, res = [];
    if (location.search)
    {
        res = location.search.replace('?','').split('/');
	alert(res[0]);
	alert(res[1]);
	alert(res[2]);
    }

    if (res.length >= 3)
    {
       cal = new Calendar(res[0], res[1]-1, res[2]);
    }
    else if (res.length == 2)
    {
       cal = new Calendar(res[0], res[1]-1);
    }
    else if (res.length == 1)
    {
       cal = new Calendar(res[0]);
    }
    else
    {
        cal = new Calendar();
    }
    cal.display();
};

(function() {
    var loadHandler = window.onload;
    if (loadHandler)
    {
        window.onload = function() { loadHandler(); Calendar.initialize(); }
    }
    else
    {
        window.onload = Calendar.initialize;
    }
})();
