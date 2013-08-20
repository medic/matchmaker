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
 
 
	function clearSessionStorage() {
		var buttonClicked = sessionStorage.getItem('buttonClicked'),
			name = sessionStorage.getItem('name'),
			src = sessionStorage.getItem('src');
	  
		sessionStorage.clear();
		sessionStorage.buttonClicked = buttonClicked;
		sessionStorage.name = name;
		sessionStorage.src = src;  
	}
	
	$(window).onbeforeunload = clearSessionStorage();


	// INITIALIZE arrays while document is loading
	
	var phoneCats = JSON.parse(localStorage.getItem('phoneCats')),
		compCats = JSON.parse(localStorage.getItem('compCats')),
		allCats = JSON.parse(localStorage.getItem('allCats')),
		constraints = JSON.parse(localStorage.getItem('constraints')),
		tools = JSON.parse(localStorage.getItem('tools')),
		counter; // number of tools currently available to user
		
	
		
	// ***************************** Page is ready *****************************
	$(window).load(function(){
		
		noConstraintsSel();
		loadTools();
		checkMsgType(); // default behavior of categories on load
		
		$("a#sum").hide();
		
		// ADDING constraints
		$.listen('click', '.constraintImg', function() {	
	
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
				$("figure#" + constraintID).css({
					"opacity":"0.4",
					"filter":"alpha(opacity=40)"
				});

				$("figure#" + constraintID + " > img").css("cursor", "default");
				
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
			$("figure#" + constraintID).css({
				"opacity":"1.0",
				"filter":"alpha(opacity=100)"
			});
			
			$("figure#" + constraintID + " > img").css("cursor", "pointer");
			
		});
		
		// DROPDOWN behavior
		$("img.drop").click(function() {
			var id = $(this).attr("id");
			if (id == "phoneMsg" || id == "computerMsg" || id == "bothMsg") {
				checkMsgType($(this));
			}
		});
		
		
		// SHOW/HIDE categories
		$.listen('click', 'p.whiteboard', function() {
			toggleCats($(this));
		});
		
		$.listen('click', 'img.arrow', function() {
			toggleCats($(this).parent());
		});
		
		function toggleCats(parent) {
				
			var id = $(parent).attr("id"),
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
		
		}
		
		
		// SEND INFO to summary page
		$('a#sum').click( function() {
			
			// Array of selected constraints
			var selectedConstraints = [];
			
			$("section#userselected > figure").each(function() {
				var figID = $(this).attr("id").replace("Sel", "");
				selectedConstraints.push(figID);
			});
			
			sessionStorage.setItem('selectedConstraints', JSON.stringify(selectedConstraints));
			
			// Array of tech options
			var techOptions = [];

			$("fieldset#tech > section > p").each(function() {
				var techID = $(this).attr("id");
				
				if ($("p#" + techID).css("display") != "none") {
					techOptions.push(techID);
				}
				
				sessionStorage.removeItem(techID);
			});
			
			sessionStorage.setItem('techOptions', JSON.stringify(techOptions));
			
		});


		
		// ***************************** Begin Helper Functions *****************************
		
		
		// argument clickedImage must be a jQuery object
		function checkMsgType(clickedImage) {
			switch ($(clickedImage).attr("id")) {
			
				case "phoneMsg":	
					var name = "phoneMsg";
					var src = "img/phone.png";
					$("img#selected").attr("src", src);
					$("img#selected").attr("name", name);
					$("ul.dropdown-menu > li > img").attr("class", "deselected drop");		
					$("img#" + name).attr("class", "selected drop");
					
					loadCategories(phoneCats);
					
					sessionStorage.setItem('src', src);
					sessionStorage.setItem('buttonClicked', 'phoneCats');
					sessionStorage.setItem('name', name);
					
					break;
				case "computerMsg":
					var name = "computerMsg";
					var src = "img/computer.png";			
					$("img#selected").attr("src", src);
					$("img#selected").attr("name", name);
					$("ul.dropdown-menu > li > img").attr("class", "deselected drop");	
					$("img#" + name).attr("class", "selected drop");					
					
					loadCategories(compCats);
					
					sessionStorage.setItem('src', src);
					sessionStorage.setItem('buttonClicked', 'compCats');
					sessionStorage.setItem('name', name);
					
					break;
				case "bothMsg": 
					var name = "bothMsg";
					var src = "img/both.png";	
					$("img#selected").attr("src", src);
					$("img#selected").attr("name", name);
					$("ul.dropdown-menu > li > img").attr("class", "deselected drop");
					$("img#" + name).attr("class", "selected drop");
					
					loadCategories(allCats);
					
					sessionStorage.setItem('src', src);
					sessionStorage.setItem('buttonClicked', 'allCats');
					sessionStorage.setItem('name', name);
					
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
		
			uniquetools = [];
		
			$.each(tools, function(index, tool) {
		
				$("fieldset#tech > section").append('<p id="' + tool.productID + '">' + tool.productName + '</p>');
		
				/*
				if ($.inArray(tool.productName, uniquetools) == -1) {
					uniquetools.push(tool.productName);
					
					$("fieldset#tech > section").append('<p id="' + tool.productID + '"><a href="' + 
						tool.productLink + '" target="_blank">' + tool.productName + '</a></p>');
				} else {
					$("fieldset#tech > section").append('<p id="' + tool.productID + '" class="duplicate"><a href="' + 
						tool.productLink + '" target="_blank">' + tool.productName + '</a></p>');
					$("p.duplicate").css("display", "none");
				}
				*/
				
			});
			
			counter = tools.length;
			//counter = uniquetools.length;
			$("small#counter").text("(" + counter +")");
		}
		
		
		// REFRESH the list of available tools
		function updateTools(constraintID, containerID) {
			
			$.each(tools, function(index, tool) {
				
				var false_array = JSON.parse(sessionStorage.getItem(tool.productID));
				
				if (!false_array) {
					false_array = [];
				} 
				
				
				if (!tool[constraintID] && tool[constraintID] != undefined) {		
		
					// constraint was added
					if (containerID.match(/[a-zA-Z]+Constraints$/) != null) {
						
						false_array.push(constraintID);
						
						// only decrease the counter if the tech option hasn't been eliminated yet
						if (!($("p#" + tool.productID).css("display") == "none")) {

							$("p#" + tool.productID).hide();
							counter--;
						}
						
						// check for corner cases
						
					}
				
					// constraint was removed
					if (($("p#" + tool.productID).css("display") == "none") && (containerID.match(/^userselected$/) != null)) {
						
						var i = $.inArray(constraintID, false_array);					
										
						if (i > -1) {
							false_array.splice(i, 1);
						}
				
						// don't add the tech option back or increase the counter until all the constraints that equal false for that option are removed
						// also don't show duplicate options
						if (false_array.length == 0 && $("p#" + tool.productID).attr("class") != "duplicate") {
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
			if (counter == 0 && !($("fieldset#tech").has("div#nomatch").length)) {
				$("fieldset#tech > legend").after('<div id="nomatch" class="alert">No match. Consider which constraints and assets you really need.</div>');
			} 
			
			if (counter != 0) {
				$("div#nomatch").remove();
			}
			
			if (counter < 5) {
				$("a#sum").show();
			} else {
				$("a#sum").hide();
			}
			
			
		}
		
		
		
	});


