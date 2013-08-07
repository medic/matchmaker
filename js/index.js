/*
 *
 *
 *
 *
 */

$(window).load(function() {

	$("div.col-lg-3").click(function() {
		sessionStorage.setItem('buttonClicked', $(this).attr("id") + "Cats");
		
		var src,
			name;
			
		if ($(this).attr("id") == "phone") { 
			src = "img/phone.png";
			name = "phoneMsg"; 
		} 
		
		else if ($(this).attr("id") == "comp") { 
			src = "img/computer.png";
			name = "computerMsg"; 
		} 
		
		// $(this).attr("id") == "all"
		else { 
			src = "img/both.png";
			name = "bothMsg"; 
		}
	
		sessionStorage.setItem('src', src);
		sessionStorage.setItem('name', name);
	});	
});	
