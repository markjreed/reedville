function validate(){
	brtn=true
	var s
	with(document.forms[0]){
		var last_elename
		var this_elestate=false
		var arr_missed=[]
		for(var i=1;i<length;i++){
			if(elements[i].type=="radio"){
				var elename=elements[i].name
				if(last_elename!=elename){
					if(this_elestate!=true){
						arr_missed[arr_missed.length]=last_elename
					}
				this_elestate=false
				}
				if(elements[i].checked){
					this_elestate=true
				}
			last_elename=elename
			}
		}
	}
	if(this_elestate!=true){
		arr_missed[arr_missed.length]=last_elename
	}
	if(arr_missed.length>1){
		brtn=false
		alert("You have missed one or more of the propositions on this page.\nWe ask that you evaluate them all before we move on.")
	}
	return brtn
}

function incompleteAlert(){
	msg="You have missed one or more propositions on this page.\nWe ask that you evaluate them all before we move on."
	alert(msg)
}