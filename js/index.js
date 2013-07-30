/*
 *
 *
 *
 *
 */

$(window).load(function() {

	$("img.pick3").click(function() {
		sessionStorage.setItem('buttonClicked', $(this).attr("name") + "Cats");
		sessionStorage.setItem('src', $(this).attr("src"));
		
		var name;
		if ($(this).attr("name") == "phone") { name = "phoneMsg"; } 
		
		else if ($(this).attr("name") == "comp") { name = "computerMsg"; } 
		
		// $(this).attr("name") == "all"
		else { name = "bothMsg"; }
	
		sessionStorage.setItem('name', name);
	});	
});	