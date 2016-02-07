    var other = {}
    function swap(img, url)
    {
	other[img] = img.src
	img.src = url
    }

    function unswap(img)
    {
	img.src = other[img] 
    }

    function setCurrent(imgId)
    {
	img = document.getElementById(imgId);
 	if (!img.complete)
	{
	    img.onload = function() { setCurrent(imgId) }
	}
	else
	{
	    img.src = img.src.replace("_active.png", ".png")
	    img.src = img.src.replace(".png", "_current.png")
	    img.onmouseover = null
	    img.onmouseout = null
	}
    }
