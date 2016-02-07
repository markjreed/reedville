(function(){
  function showComponents(a)
  {
     var xhr = window.XMLHttpRequest ? new XMLHttpRequest() :
				       new ActiveXObject('MSXML.XMLHTTP.3.0');
     xhr.open('GET', '#', true);
     var id = a.id.replace(/^a_/, '');
     var div = document.getElementById('c_' + id);
     xhr.onreadystatechange = function () 
     { 
	if (request.readyState == 4 && request.status == 200)
	{
  	   div.style.display = 'block';
	   div.innerHTML = request.responseText;
	}
     }
     alert("About to call send");
     xhr.send();
     alert("Sent");
  }
  window.onload = function() {
    var links = document.evaluate('//a[@class="recipe"]', document, null, 
				  XPathResult.ANY_TYPE, null);
    var list = [];
    for (var a = links.iterateNext(); a; a = links.iterateNext())
    {
      list.push(a);
    }
    for (var i=0; i<list.length; ++i)
    {
      var a = list[i];
      a.onclick = function() { showComponents(a); alert("returning false"); return false; }
    }
  }
})();
