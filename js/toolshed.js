/*
 *
 *
 *
 *
 *
 *
 *
 *
 */
 
 



	// INITIALIZE arrays while document is loading
	var phoneCats,
		compCats,
		allCats,
		constraints,
		tools,
		counter; // number of tools currently available to user
	
	if (!phoneCats) {
		$.getJSON("js/json/phoneCats.json", function(data) {
			localStorage.setItem('phoneCats', JSON.stringify(data));	
			phoneCats = JSON.parse(localStorage.getItem('phoneCats'));
		});
	} 
	
	if (!compCats) {
		$.getJSON("js/json/compCats.json", function(data) {
			localStorage.setItem('compCats', JSON.stringify(data));	
			compCats = JSON.parse(localStorage.getItem('compCats'));			
		});
	}
	
	if (!allCats) {
		$.getJSON("js/json/allCats.json", function(data) {
			localStorage.setItem('allCats', JSON.stringify(data));				
			allCats = JSON.parse(localStorage.getItem('allCats'));
		});
	} 
	
	if (!constraints) {
		$.getJSON("js/json/constraints.json", function(data) {
			localStorage.setItem('constraints', JSON.stringify(data));
			constraints = JSON.parse(localStorage.getItem('constraints'));				
		});
	}
	
	if (!tools) {
		$.getJSON("js/json/tools.json", function(data) {
			localStorage.setItem('tools', JSON.stringify(data));
			tools = JSON.parse(localStorage.getItem('tools'));
		});
	}
		
	
		
	// ***************************** Page is ready *****************************
	$(window).load(function(){
	
		counter = tools.length;
		$("small#counter").text("(" + counter +")");
		
		noConstraintsSel();
		loadTools();
		checkMsgType(); // default behavior of categories on load
		
		
		// ADDING constraints
		$("figure").listen('click', 'img.constraintImg', function() {	
	
			var container = $(this).parent().parent(),
				figure = $(this).parent();
			
			// Add the constraint if the image clicked is inside a category pane
			if (($(container).attr('id')).match(/[a-zA-Z]+Constraints$/) != null) {			
			
				var attr = $(figure).attr('id');
			
				// But don't add it more than once
				if ($("section#userselected").has("figure#" + attr + "Sel").length == 0) {
					$("p#noSelect").remove();
					
					$("section#userselected").append($(figure).clone(true).attr("id", attr + "Sel"));
					$("figure#" + attr + "Sel > img").after('<span class="close">&times;</span>');	
					
					updateTools(attr, $(container).attr('id')); // Update list of tech options
				}		
			}
			
			/*
			// Remove the constraint if the image clicked is in the selections pane
			if (($(container).attr('id')).match(/^userselected$/) != null) {
				
				var attr = $(this).attr('id').replace("Sel", "");
				updateTools(attr, $(container).attr('id')); // Update list of tech options first before removing!
				
				$(figure).remove();
				noConstraintsSel();
			}*/	
			
			
			// Reduce opacity of constraint in category pane
			$(figure).css({
				"opacity":"0.4",
				"filter":"alpha(opacity=40)"
			});			
			
		});
		
		// REMOVING constraints
		$.listen('click', 'span.close', function() {

			var figure = $(this).parent(),
				attr = $(figure).attr('id').replace("Sel", ""),
				container = $(this).parent().parent();
				
			updateTools(attr, $(container).attr('id')); // Update list of tech options first before removing!
			$(figure).remove();
			noConstraintsSel();
			
			// Restore opacity of constraint in category pane
			$("figure#" + attr).css({
				"opacity":"1.0",
				"filter":"alpha(opacity=100)"
			});
		});
		
		// DROPDOWN behavior
		$("img.drop").click(function() {
			var id = $(this).attr("id");
			if (id == "phoneMsg" || id == "computerMsg" || id == "bothMsg") {
				checkMsgType($(this));
			}
		});
		
		
		// SHOW/HIDE categories
		$("section#categories").listen('click', 'p', function() {
			var id = $(this).attr("id");
			var txt = $(this).attr("data-label");
			
			
			if (!($(this).attr("class") == "helptext")) {
			
				if ($(this).attr("data-open") == "false") {
					$(this).attr("data-open", "true");
					$(this).html('<img class="arrow" src="img/open-arrow.png">' + txt);
				} else {
					$(this).attr("data-open", "false");
					$(this).html('<img class="arrow" src="img/close-arrow.png">' + txt);
				}
				
				$("p#" + id + "Qs").toggle(200);
				$("section#" + id + "Constraints").toggle(300);
			}
		});


		
		// ***************************** Begin Helper Functions *****************************
		
		
		// argument clickedImage must be a jQuery object
		function checkMsgType(clickedImage) {
			switch ($(clickedImage).attr("id")) {
				case "phoneMsg":
					$("img#selected").attr("src", "img/phone.png");
					$("img#phoneMsg").attr("class", "selected drop");
					$("img#computerMsg").attr("class", "deselected drop");
					$("img#bothMsg").attr("class", "deselected drop");
					loadCategories(phoneCats);
					break;
				case "computerMsg":
					$("img#selected").attr("src", "img/computer.png");
					$("img#computerMsg").attr("class", "selected drop");	
					$("img#phoneMsg").attr("class", "deselected drop");
					$("img#bothMsg").attr("class", "deselected drop");						
					loadCategories(compCats);
					break;
				case "bothMsg": 
					$("img#selected").attr("src", "img/both.png");
					$("img#bothMsg").attr("class", "selected drop");
					$("img#phoneMsg").attr("class", "deselected drop");
					$("img#computerMsg").attr("class", "deselected drop");
					loadCategories(allCats);
					break;
				default:
					// get data from the button that was clicked on the landing page
					var cat = sessionStorage.getItem('buttonClicked');
					var src = sessionStorage.getItem('src');
					var name = sessionStorage.getItem('name');
								
					$("img#selected").attr("src", src);
					$("img#selected").attr("name", name);
					
					loadCategories(window[cat]);
			}
		}
		
		
		function loadCategories(array) {			
			$("section#categories").empty(); // Wipe the constraints pane
			
			$.each(array, function(index, data) {			
				// Load the relevant categories
				$("section#categories").append('<p id="' + data.categoryID + '" data-label="' + data.categoryLabel +
					'" class="whiteboard" data-open="false"><img class="arrow" src="img/close-arrow.png">' + data.categoryLabel + '</p>');
				$("section#categories").append('<p id="' + data.categoryID + 'Qs" class="helptext">' + data.guidingQs + '</p>');
				$("section#categories").append('<section id="' + data.categoryID + 'Constraints" class="constraintBox"></section>');
				
				$("p#" + data.categoryID + "Qs").hide();
				$("section#" + data.categoryID + "Constraints").hide();				
			});	
			loadConstraints();			
		}
		
		
		function loadConstraints() {
			constraints = JSON.parse(localStorage.getItem('constraints'));
			$.each(constraints, function(index, d){
				$("section#" + d.categoryID + "Constraints").append(
					'<figure id="' + d.constraintID + '"><img src="' + d.imageLink + 
					'" class="constraintImg"><figcaption>' + d.constraintLabel + '</figcaption></figure>'
				);
			});
		}
		
		
		// DEFAULT behavior for zero constraints selected
		function noConstraintsSel() {
			if ($("section#userselected").is(":empty")) {
				$("section#userselected").html('<p id="noSelect">You haven\'t selected anything yet!</p>');
			}
		}

		
		function loadTools() {
			$.each(tools, function(index, d) {
				$("fieldset#tech").append('<p id="' + d.productID + '"><a href="' + d.productLink + '" target="_blank">' + d.productName + '</a></p>');
			});
		}
		
		
		// REFRESH the list of available tools
		function updateTools(attr, containerID) {
			
			$.each(tools, function(index, data) {
				if (data[attr] == "false") {
				
					// only decrease the counter if the tech option hasn't been eliminated yet
					if ((!($("p#" + data.productID).css("display") == "none")) && (containerID.match(/[a-zA-Z]+Constraints$/) != null)) {
						$("p#" + data.productID).hide();
						counter--;
					}
				
					// only increase the counter if the tech option hasn't been added back yet
					if (($("p#" + data.productID).css("display") == "none") && (containerID.match(/^userselected$/) != null)) {
						$("p#" + data.productID).show();
						counter++;
						
						// don't add the tech option back until all the constraints that equal false are removed
						
					}
					

				
				}
			});	
			
			// Update UI with counter
			$("small#counter").text("(" + counter +")");
		}
		
	});


