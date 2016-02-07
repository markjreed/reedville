(function() {
  var colors = [ 
    [ 255, 0, 0 ], // red
    [ 255, 255, 0 ], // yellow
    [ 0, 255, 0 ], // green
    [ 165, 42, 42 ], // brown
    [ 255, 36, 0 ], // scarlet
    [ 0, 0, 0 ], // black
    [ 204, 119, 34 ], // ochre
    [ 255, 218, 185 ], // peach
    [ 224, 17, 95 ], // ruby
    [ 107, 142, 35 ], // olive
    [ 127, 0, 255 ], // violet
    [ 229, 170, 112 ], // fawn
    [ 200, 162, 200 ], // lilac
    [ 255, 215, 0 ], // gold
    [ 210, 105, 30 ], // chocolate
    [ 224, 176, 255 ], // mauve
    [ 255, 253, 208 ], // cream
    [ 220, 20, 60 ], // crimson
    [ 192, 192, 192 ], // silver
    [ 255, 0, 127 ], // rose
    [ 240, 255, 255 ], // azure
    [ 255, 250, 205 ], // lemon
    [ 128, 70, 27 ], // russet
    [ 190, 190, 190 ], // grey
    [ 160, 32, 240 ], // purple
    [ 255, 255, 255 ], // white
    [ 255, 192, 203 ], // pink
    [ 255, 165, 0 ], // orange
    [ 0, 0, 255 ] // blue
  ]; 

  function startCycle() {
    var current = 0;
    var img = document.getElementsByTagName("img")[0];
    var timer = window.setInterval(function() { 
        img.style.backgroundColor = 'rgb(' + colors[current].join(',') + ')';
        current = (current + 1) % colors.length;
        if (!current) {
            window.clearInterval(timer);
            window.setTimeout(startCycle, 2400);
        }
    }, 800);
  }
  window.onload = startCycle;
})();
