/*
 *
 *
 *
 *
 */

	// INITIALIZE arrays while document is loading
	$(document).ready(function() {
	
	
		$.getJSON("../data/json/phoneCats.json", function(data) {	
			localStorage.setItem('phoneCats', JSON.stringify(data));	
		});
	
	
	
		$.getJSON("../data/json/compCats.json", function(data) {
			localStorage.setItem('compCats', JSON.stringify(data));				
		});
	
	
		$.getJSON("../data/json/allCats.json", function(data) {
			localStorage.setItem('allCats', JSON.stringify(data));	
		});
	
	
	
		$.getJSON("../data/json/constraints.json", function(data) {
			localStorage.setItem('constraints', JSON.stringify(data));			
		});
	
	
	
		$.getJSON("../data/json/tools.json", function(data) {
			localStorage.setItem('tools', JSON.stringify(data));
		});
	
		
	}); 

 
 
$(window).load(function() {

	$("div.thumbnail").click(function() {
	
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
