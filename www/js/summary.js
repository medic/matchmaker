/*
 *
 *
 *
 *
 */ 
 
 
$(window).load(function() {

	var allConstraints = JSON.parse(localStorage.getItem('constraints')),
		selectedConstraintIDs = JSON.parse(sessionStorage.getItem('selectedConstraints')),
		allTech = JSON.parse(localStorage.getItem('tools')),
		techOptionIDs = JSON.parse(sessionStorage.getItem('techOptions')),
		counter = techOptionIDs.length,
		src = sessionStorage.getItem('src'),
		name = sessionStorage.getItem('name');

	
	// Load message type image					
	$("img#selected").attr("src", src);
	$("img#selected").attr("name", name);
	
	
	// Load selected constraints	
	$.each(selectedConstraintIDs, function(index, constraintID) {
		$.each(allConstraints, function(i, data) {
		
			if (data.constraintID == constraintID) {	
				$("section#userselected").append('<figure id="' + constraintID + '"><img src="' + data.imageLink + 
					'" class="constraintImg"><figcaption>' + data.constraintLabel + '</figcaption></figure>');
			
				$("figure#" + constraintID + " > img").css('cursor', 'default');
				
				// Load Things to Think About
				if (data.thingsToThinkAbout) {
					$("fieldset#ttta").append('<p>' + data.thingsToThinkAbout + '</p>');
				} 
			}
		});
	});
	
	if (!($("fieldset#ttta").has("p").length)) {
		$("fieldset#ttta").append('<p id="nothings">Some message that will appear if there are no "things to think about".</p>');
	}
	
	
	// Load tech options
	$.each(techOptionIDs, function(index, techID) {
		$.each(allTech, function(i, tool) {
		
			if (tool.productID == techID) {
				$("fieldset#techsum").append('<p id="' + techID + '"><a href="' + tool.productLink + '" target="_blank">' + 
					tool.productName + '</a></p>');		
			}
		});
	});

	$("small#counter").text("(" + counter +")");



});	
