var Age;
if (!Age)
{
    alert("Age.js not loaded");
}
var boys = new Object();
var with_frac = false;
if (document.location.search && document.location.search.match(/frac/))
	with_frac = true;

boys.csr = new Object();
boys.csr.bday = new Age(new Date(Date.UTC(2003, 11, 11,  8, 24, 30)), with_frac);
boys.csr.els = new Array();

boys.car = new Object();
boys.car.bday = new Age(new Date(Date.UTC(2006, 1, 7, 19, 10, 30)), with_frac);
boys.car.els = new Array();

var timer;
function startClock()
{
   timer =  window.setInterval(updateClock, 500);
}

function stopClock()
{
   window.clearInterval(timer);
}

function $(id)
{
    var el = document.getElementById(id);
    if (!el && document.all) el = document.all[id];
    if (!el)
    {
        alert("No such element '" + id + "'");
    }
    return el;
}

function updateClock()
{
   for (var key in boys)
   {
       var age = boys[key].bday.current();

       for (var i = 0; i < Age.COMPONENTS.length; ++i)
       {
           var id = key + "_" + Age.COMPONENTS[i]
           var cell = boys[key].els[i];
           if (cell == null)
           {
               cell = boys[key].els[i] = $(id);
           }
           if (cell == null)
           {
               alert("Couldn't find `" + id + "'");
               stopClock();
           }
           else
           {
               if (cell.name)
                   cell.value = age[i];
               else
                   cell.innerHTML = age[i];
           }
       }
   }
}
