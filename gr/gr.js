(function(){
  function SVG(element) {
    this.root = element;
    this.ns = element.getAttribute('xmlns')
    this.width = element.getAttribute('width');
    this.height = element.getAttribute('height');
  }
  SVG.prototype.add = function(name, attrs) {
    var elem = document.createElementNS(this.ns, name);
    for (var attr in attrs) {
      elem.setAttribute(attr, attrs[attr]);
    }
    this.root.appendChild(elem);
    return elem;
  }
  SVG.prototype.drawLine = function(x1,y1,x2,y2,style) {
    return this.add('line', { 'x1': x1, 'y1': y1,
        'x2': x2, 'y2': y2, 'style': style });
  }
  SVG.prototype.drawRectangle = function(x1,y1,x2,y2,style) {
    return this.add('rect', { 'x': x1, 'y': y1,
        'width': x2-x1, 'height': y2-y1, 'style': style });
  }
  SVG.prototype.drawEllipse = function(cx, cy, rx, ry, style) {
    return this.add('ellipse', { 'cx': cx, 'cy': cy,
      'rx': rx, 'ry': ry, 'style': style });
  }
  SVG.prototype.drawOval = function(x1, y1, x2, y2, style) {
    var cx = (x1+x2)/2;
    var cy = (y1+y2)/2;
    var rx = (x2-x1)/2;
    var ry = (y2-y1)/2;
    return this.drawEllipse(cx, cy, rx, ry, style);
  }
  SVG.prototype.getCoords = function(element) {
    var xattrs, yattrs;
    if (element.tagName == 'ellipse') {
      xattrs = ['cx'];
      yattrs = ['cy'];
    } else if (element.tagName == 'line') {
      xattrs = ['x1', 'x2'];
      yattrs = ['y1', 'y2'];
    }
    var coords = [];
    for (var i=0; i<xattrs.length; ++i) {
      coords.push(element.getAttribute(xattrs[i]));
      coords.push(element.getAttribute(yattrs[i]));
    }
    return coords;
  }
  SVG.prototype.move = function(element, dx, dy) {
    var xattrs, yattrs;
    if (element.tagName == 'ellipse') {
      xattrs = ['cx'];
      yattrs = ['cy'];
    } else if (element.tagName == 'line') {
      xattrs = ['x1', 'x2'];
      yattrs = ['y1', 'y2'];
    }
    for (var i=0; i<xattrs.length; ++i) {
      element.setAttribute(xattrs[i], element.getAttribute(xattrs[i])-0+dx);
      element.setAttribute(yattrs[i], element.getAttribute(yattrs[i])-0+dy);
    }
    return element;
  }
      
  function drawGrid(svg) {
    var max = Math.max(svg.width, 
                       svg.height);
    var style;
    for (var i=0; i<max; i+=10) {
      style = 'stroke: cyan';
      if (i % 40 == 0) {
         style += '; stroke-width: 3'
      }
      if (i < svg.width) {
        svg.drawLine(i, 0, i, svg.height, style);
      }
      if (i < svg.height) {
        svg.drawLine(0, i, svg.width, i, style);
      }
    }
  }
  function drawTrack(svg) {
    var outer = svg.drawOval(10,10,630,420,
                              'stroke: black; stroke-width: 2; fill: none');
    var inner = svg.drawOval(120,80,530,340,
                              'stroke: black; stroke-width: 2; fill: none');
    svg.drawLine(320,10,320,80, 'stroke:black; stroke-width: 2');
    return { 'outer': outer, 'inner': inner }
  }

  function inEllipse(ellipse, x, y)  {
     var cx = ellipse.getAttribute('cx') - 0
     var cy = ellipse.getAttribute('cy') - 0
     var rx = ellipse.getAttribute('rx') - 0
     var ry = ellipse.getAttribute('ry') - 0
     var rx2 = rx*rx;
     var ry2 = ry*ry;
     var dx = x - cx;
     var dy = y - cy;
     return ((dx*dx)/rx2 + (dy*dy)/ry2 <= 1);
  }

  function crossesEllipse(ellipse, x0, y0, x1, y1) {
    if (inEllipse(ellipse, x0, y0) == inEllipse(ellipse, x1, y1)) {
      return undefined;
    }
    var cx = ellipse.getAttribute('cx') - 0
    var cy = ellipse.getAttribute('cy') - 0
    var rx = ellipse.getAttribute('rx') - 0
    var ry = ellipse.getAttribute('ry') - 0
    var rx2 = rx*rx;
    var ry2 = ry*ry;
    var dx = x0 - cx;
    var dy = y0 - cy;
    var r = (dx*dx)/rx2 + (dy*dy)/ry2;
    if (r > 1) {
      var t = x0; x0 = x1; x1 = t;
      t = y0; y0 = y1; y1 = t;
    }
    var x = x0;
    var y = y0;
    dx = x - cx;
    dy = y - cy;
    r = (dx*dx)/rx2 + (dy*dy)/ry2;
    while ( Math.abs(r-1) > 0.05 ) {
      if (r > 1) {
        x = (x0 + x)/2
        y = (y0 + y)/2
      } else {
        x = (x1 + x)/2
        y = (y1 + y)/2
      }
      dx = x - cx;
      dy = y - cy;
      r = (dx*dx)/rx2 + (dy*dy)/ry2;
    }
    return [x, y]
  }

   

  function Race(svg, log_pane, scoreboard, racers) {
    this.svg = svg
    this.log_pane = log_pane
    this.scoreboard = scoreboard
    this.racers = racers;
    this.time = 0;
    this.completed = false;
    this.track = drawTrack(svg);
    this.x = this.track.outer.getAttribute('cx') - 0
    this.y = this.track.outer.getAttribute('cy') - 0
    this.slots = []
    for (var i=0; i<racers.length; ++i) {
      var tr = document.createElement('tr');
      tr.setAttribute('style', 'background-color: black; color: ' + this.racers[i].color + ';');
      var td = document.createElement('th')
      td.innerHTML = this.racers[i].name;
      tr.appendChild(td);
      td = document.createElement('td')
      td.innerHTML = "0%";
      tr.appendChild(td);
      this.scoreboard.appendChild(tr)
      this.slots.push(tr)
      this.racers[i].x = this.racers[i].start[0]
      this.racers[i].y = this.racers[i].start[1]
      this.racers[i].crashed = false;
      this.racers[i].element = 
        svg.drawEllipse(this.racers[i].x, this.racers[i].y, 4, 4, 
                   'fill: ' + this.racers[i].color);
    }
  }

  Race.prototype.log = function(message) {
    var sec = this.time
    var min = Math.floor(sec / 60)
    sec = sec % 60;
    var ts = min;
    if (min < 10) ts = "0" + ts;
    ts += ":";
    if (sec < 10) ts += "0";
    ts += sec;
    this.log_pane.innerHTML += "<p>" + ts + ". " + message + "</p>";
  }

  Race.prototype.start = function() {
    this.log("And they're off!");
    var race = this;
    this.timer = window.setInterval(function() { race.tick(); }, 1000);
  }

  Race.prototype.tick = function() {
    this.time += 1;
    var done = true;
    for (var i=0; i<this.racers.length; ++i) {
      var racer = this.racers[i]
      if (racer.crashed)
        continue;
      var car = racer.element;
      var vector = racer.vectors[this.time];
      if (vector != undefined) {
        done = false;
        dx = (vector[0] - 0)*10;
        dy = (vector[1] - 0)*10;
        var x0 = racer.x
        var y0 = racer.y
        if (!inEllipse(this.track.outer, x0, y0) ||
             inEllipse(this.track.inner, x0, y0)) {
          continue; // driver has previously crashed
        }

        var x1 = x0 + dx;
        var y1 = y0 + dy;
        var crashPoint = crossesEllipse(this.track.outer, x0, y0, x1, y1);
        if ((crashPoint = crossesEllipse(this.track.outer, x0, y0, x1, y1)) ||
            (crashPoint = crossesEllipse(this.track.inner, x0, y0, x1, y1)))
        {
             // driver has just crashed
             this.log(racer.name + " has crashed!");
             racer.crashed = true;
             x1 = crashPoint[0]
             y1 = crashPoint[1]
             dx = x1 - x0
             dy = y1 - y0
        }
        this.svg.drawEllipse(x0, y0, 4, 4, 'fill: ' + racer.color);
        this.svg.move(car, dx, dy);
        this.svg.drawLine(x0, y0, x1, y1, 
                          'stroke: ' + racer.color + '; stroke-width: 3');
        racer.x = x1;
        racer.y = y1;
        var theta = Math.atan2( this.y - y1, x1 - this.x )
        racer.progress = (Math.PI/2.0 - theta) / (2 * Math.PI) * 100
        while (racer.progress < 0) racer.progress += 100;

        for (var j=0; j<this.racers.length; ++j) {
          if (i != j) {
            r = this.racers[j];
            if (Math.abs(r.x - x1) <=5 && Math.abs(r.y - y1) <= 5) {
              this.log(racer.name + " has crashed into " + r.name + "!");
              racer.crashed = true;
              r.crashed = true;
            }
          }
        }

        for (var j=0; j<this.racers.length; ++j) {
          r = this.racers[j];
          if (r.crashed) {
             this.svg.drawEllipse(r.x, r.y, 15, 15, 'fill: yellow');
             this.svg.drawEllipse(r.x, r.y, 10, 10, 'fill: orange');
             this.svg.drawEllipse(r.x, r.y, 5, 5, 'fill: red');
          }
        }
      }
    }

    // figure out the leaderboard
    var leader = this.racers[0]
    this.racers.sort(function(a,b) { return b.progress - a.progress; });
    for (var i=0; i<this.racers.length; ++i) {
      this.slots[i].style.color = this.racers[i].color
      this.slots[i].innerHTML = '<th>' + this.racers[i].name + '</th><td>' +
      Math.floor(this.racers[i].progress+0.5) + '%</td>'
    }
    if (leader != this.racers[0]) {
      this.log(this.racers[0].name + " has taken the lead!");
    }
    if (done) {
      window.clearInterval(this.timer);
      this.log("Race over!");
    }
  }

  function startRace(svg, log, scoreboard) {
    new Race(svg, log, scoreboard, racers).start();
  }
  window.onload = function() {
    var svg = new SVG(document.getElementsByTagName("svg")[0]);
    var log = document.getElementById("racelog");
    var scoreboard = document.getElementById("scoreboard");
    svg.drawRectangle(0,0,svg.width,svg.height,'fill:white')
    drawGrid(svg);
    startRace(svg, log, scoreboard);
  }
})();
