<html>
 <head>
  <title>Computus</title>
 </head>
 <body>
  <h1>Computus</h1>

  <p>The tables below are used for the manual determination of Easter in the Gregorian
     calendar, based on the original Alexandrian computus.  Of course, computers make
     this much easier, but the manual method is more readily comprehensible than
     most algorithms for computers.</p>

  <h2>The Rule of Easter</h2>
  <p>Throughout all Christian congregations, Easter is 
   defined as <em>the first Sunday after the first full moon on or after the spring
   equinox.</em></p>

   <p>However, since establishing the precise times of the full moon and the
   equinox is computationally difficult, approximations to both were created, and
   are still used today. The difference between these approximations is why the
   Eastern Orthodox Church and the Catholic Church frequently observe Easter on 
   different Sundays despite agreeing on the basic rule above.</p>

  <h2>The Equinox</h2>
  <p>Since the calendar we use is supposed to match the tropical year, the equinox
     should theoretically fall on about the same day every year.  The approximation used
     in the Easter calculation is to assume that the equinox falls on exactly the same
     day every year, specifically March 21st.  The Eastern Orthodox Church
     still uses March 21st on the
     Julian calendar for this, which currently corresponds to April 3rd in the 
     Gregorian calendar used by Western churches.</p>

  <h2>The Epact</h2>
  <p>The phase of the moon is approximated through the Metonic cycle.  This cycle,
     named for Meton of Athens who described it in 432 BC but known centuries earlier,
     is the observation that the moon returns to the same phase on the same date after
     a period of 6,940 days - equal to 19 solar years or 235 lunar months.</p>

   <p>Imagine a lunar calendar running in parallel to the solar.  In the lunar
     reckoning, the 1st of the month is the new moon, so each month lasts only 29 or 30
     days.  At the end of 12 such months, only 354 days will have passed - there are still
     11 days left in the solar year.</p>

     <p>So if the first new moon of the year is on January 1st, the 12th new moon
     will be on November 21st, and the 13th . . . the start of the next lunar year
     ... will be on December 21st. So the next January 1st will be on the 12th day
     of the lunar year.  The January 1st after that will be on the 23rd day of the
     lunar year, and the one after that will be on the 34th - except now that we're
     more than a whole month out of whack, we add a 13th month to the lunar year so
     that January 1st is on the 4th instead.</p>

     <p>The accumulated difference between the solar and lunar years is called
	the <i>epact</i>, and the pattern where it goes up by 11 days every
	year continues, but doesn't quite yield the Metonic cycle: after 19
	years there's still a one-day difference.  So every 19th year the epact
	is increased by 12 days instead of 11.</p>

     <p>The Metonic cycle is used unmodifed by the Eastern Orthodox Church.
However, even Meton knew that the cycle is not exact.  Neither 19 solar years
nor 235 lunar months is quite 6,940 days, nor are they the same value as each
other.  Every cycle the discrepancy between the calendar and the moon increases
by over a third of a day, and that between the calendar and the sun increases
by almost half a day, while the discrepancy between the sun and the moon
increases by almost a tenth of a day.</p>

     After just three Metonic cycles (57 years), the new moon is coming a full day earlier 
     than predicted by the cycle - on December 31st instead of January 1st.  After three
     more it's on the 30th.

1710
57
     So after ten Metonic cycles (190 years),
     the new moon comes a day earlier thanThey every 190 years they drift apart by
     a day, and this adds up over. 
     6,940 days (more like 6939.6), and neither is 235 lunar months 




209
209 30 % p

209
     of
     of the 
     lunar month.  The January 1st after that will be on the 23rd day of its month, and the one after that will be
     another whole lunar month plus 3 days in.
     13th month


22 23 24 25 26 27 28 29 30 31 1
    
     mon
     times in every 19 years
     a 13th month is added to keep things in synch.  On a year when the two January 1sts
     coincide (there is a new moon on the real January 1st), the lunar year will end
     on December 20th.  The next January 1st, then, will be January 12th of the lunar
     year, a difference of 11 days.

     The difference between the lunar and solar dates is 
     to keep in synch with the 
a system of <i>epacts</i>.  Each
     year is assigned an epact number (between 0 and 29) representing the number of
     days since the nominal new moon as of January 1st of that year.  A 0 means the new
     moon is on January 1st; a 14 means that it fell 14 days earlier, on December
     18th of the prior year; etc.</p>

  <p>Since twelve lunar months add up to 354 days and a standard solar year is 365 days,
     the epact grows by 11 (wraping around to 0 at 30) every year. However, this isn't
     quite enough, so every 19 years it jumps 12 instead.  This yields a repeating cycle
     of 19 epacts: 0, 11, 22, 3, 14, 25, 6, 17, 28, 9, 20, 1, 12, 23, 4, 15, 26, 7, 18.</p>


     
3
     calendar instead of the Gregorian, which is currently </p>



<?php

