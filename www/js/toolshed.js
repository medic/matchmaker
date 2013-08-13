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
		
		
		//js/json/phoneCats.json
	
	if (!phoneCats) {
		$.getJSON("../data/json/phoneCats.json", function(data) {	//../data/json/phoneCats.json
			localStorage.setItem('phoneCats', JSON.stringify(data));	
			phoneCats = JSON.parse(localStorage.getItem('phoneCats'));
		});
	} 
	
	if (!compCats) {
		$.getJSON("../data/json/compCats.json", function(data) {
			localStorage.setItem('compCats', JSON.stringify(data));	
			compCats = JSON.parse(localStorage.getItem('compCats'));			
		});
	}
	
	if (!allCats) {
		$.getJSON("../data/json/allCats.json", function(data) {
			localStorage.setItem('allCats', JSON.stringify(data));				
			allCats = JSON.parse(localStorage.getItem('allCats'));
		});
	} 
	
	if (!constraints) {
		$.getJSON("../data/json/constraints.json", function(data) {
			localStorage.setItem('constraints', JSON.stringify(data));
			constraints = JSON.parse(localStorage.getItem('constraints'));				
		});
	}
	
	if (!tools) {
		$.getJSON("../data/json/tools.json", function(data) {
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
			
				var constraintID = $(figure).attr('id');
			
				// But don't add it more than once
				if ($("section#userselected").has("figure#" + constraintID + "Sel").length == 0) {
					$("p#noSelect").remove();
					
					$("section#userselected").prepend($(figure).clone(true).attr("id", constraintID + "Sel"));
					$("figure#" + constraintID + "Sel > img").after('<span class="close">&times;</span>');
					$("figure#" + constraintID + "Sel > img").css("cursor", "default");
					
					updateTools(constraintID, $(container).attr('id')); // Update list of tech options
				}
				
				// Reduce opacity of constraint in category pane
				$("figure#" + constraintID + " > img").css({
					"opacity":"0.4",
					"filter":"alpha(opacity=40)",
					"cursor":"default"
				});				
			}			
		});
		
		// REMOVING constraints
		$.listen('click', 'span.close', function() {

			var figure = $(this).parent(),
				constraintID = $(figure).attr('id').replace("Sel", ""),
				container = $(this).parent().parent();
				
			updateTools(constraintID, $(container).attr('id')); // Update list of tech options first before removing!
			$(figure).remove();
			noConstraintsSel();
			
			// Restore opacity of constraint in category pane
			$("figure#" + constraintID + " > img").css({
				"opacity":"1.0",
				"filter":"alpha(opacity=100)",
				"cursor":"pointer"
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
		$("p.whiteboard").listen('click', 'img.arrow', function() {
	
			var parent = $(this).parent(),
				id = $(parent).attr("id"),
				txt = $(parent).text();

			if ($(parent).attr("data-open") == "false") {
			
			
				// Close all open categories first
				$("section#categories > p.whiteboard").each(function(index, object) {
				
					var objid = $(object).attr("id");
				
					if ($(object).attr("data-open") == "true") {	

						$("p#" + objid + "Qs.helptext").hide(200);	
						$("section#" + objid + "Constraints").hide(300);
						
					
						var text = $(object).text();
						$(object).attr("data-open", "false").html('<img class="arrow" src="img/close-arrow.png">' + text);
					
					} 
				});
			
				$(parent).attr("data-open", "true");
				$(parent).html('<img class="arrow" src="img/open-arrow.png">' + txt);
				
				
			} else {
				$(parent).attr("data-open", "false");
				$(parent).html('<img class="arrow" src="img/close-arrow.png">' + txt);
			}
			
			$("p#" + id + "Qs").toggle(200);
			$("section#" + id + "Constraints").toggle(300);
				
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
					
					$("ul.dropdown-menu > li > img").attr("class", "deselected drop");
					$("img#" + name).attr("class", "selected drop");
					
					loadCategories(window[cat]);
			}
		}
		
		
		function loadCategories(array) {			
			$("section#categories").empty(); // Wipe the constraints pane
			
			$.each(array, function(index, data) {			
				// Load the relevant categories
				$("section#categories").append('<p id="' + data.categoryID +
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
			$.each(tools, function(index, tool) {
				
				$("fieldset#tech > section").append('<p id="' + tool.productID + '"><a href="' + 
					tool.productLink + '" target="_blank">' + tool.productName + '</a></p>');
			});
		}
		
		
		// REFRESH the list of available tools
		function updateTools(constraintID, containerID) {
			
			$.each(tools, function(index, tool) {
				
				var false_array = JSON.parse(sessionStorage.getItem(tool.productID));
				
				if (!false_array) {
					false_array = [];
				} 
				
				
				if (!tool[constraintID]) {		
		
					// constraint was added
					if (containerID.match(/[a-zA-Z]+Constraints$/) != null) {
						
						false_array.push(constraintID);
						
						// only decrease the counter if the tech option hasn't been eliminated yet
						if (!($("p#" + tool.productID).css("display") == "none")) {

							$("p#" + tool.productID).hide();
							counter--;
						}
					}
				
					// constraint was removed
					if (($("p#" + tool.productID).css("display") == "none") && (containerID.match(/^userselected$/) != null)) {
						
						var i = $.inArray(constraintID, false_array);					
										
						if (i > -1) {
							false_array.splice(i, 1);
						}
				
						// don't add the tech option back or increase the counter until all the constraints that equal false for that option are removed
						if (false_array.length == 0) {
							$("p#" + tool.productID).show();
							counter++;
						}				
					}
			
				sessionStorage.setItem(tool.productID, JSON.stringify(false_array));
				
				}	
			});	
			
			// Update UI with counter
			$("small#counter").text("(" + counter +")");
			
			// Display message if all tools eliminated
			if (counter == 0) {
				$("fieldset#tech > legend").after('<div id="nomatch" class="alert">No match. Consider which constraints and assets you really need.</div>');
			} else {
				$("div#nomatch").remove();
			}
			
			
		}
		
		
		
	});


