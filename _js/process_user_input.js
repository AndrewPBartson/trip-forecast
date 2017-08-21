// process_user_input.js

// NEED TO WRITE PSEUDO-CODE. NEED TO DRAW FLOW CHART. NO MORE SPAGHETTI CODE. NEED OBJECT ORIENTATION.


var input_raw;
var input_list;
var output;
var haveValidation = false; // check for validation api
var validOkay = true;

function init() {
    //  when page loads, this creates an object the refers to the setup_trip form.
    input_raw = document.getElementById("user_input");
    //  when page loads, this creates an object that refers to the results div.
    output = document.getElementById('results');

    // check to see if the validation API is implemented
    haveValidation = (typeof input_raw.elements[0].validity === 'object');
}

// initialize calc_button
function initButtons(){
  //$( "#main_button" ).click(function() {   
    //return display();

  $( "#calc_button" ).click(function() {   
 saveValues(input_raw);
  }); // end calc_button setup	
}	


// display a string in the output div
function output( s ) {
	output.output += '<p>' + s + '</p>';
}

// display an error message in the output div
function errorOutput( s ) {
	output.output += '<p class="error">' + s + '</p>';
}

// clear the output div
function clearOutput() {
	output.output = '';
}

// within "for" loop, check a form element with the validity API
function isValid( e ) {
	if(e.validity.valid === true) {
		return true;
	} else // If element doesn't pass validity check, call errorOutput()
	{
		var m = e.validationMessage;
		errorOutput(e.name + ': ' + m );
		validOkay = false;
		return false;
	}
}

// Formats a value for display purposes for each form element, with special 
// processing depending on type of form element. Returns a string that includes 
// elements "name" and "value".
// Instead of this, I should have a function that writes the user input to an 
// array of name-value pairs.
function formatValue( e ) {
	v = function(s) {return e.name + ': ' + s }
	
	if (e.type == "radio") {
		if (e.checked) return v(e.value);
	    else return "" ;
	}

    // for "select-multiple" display a comma-separated list
    if(e.type == "select-multiple") {
		a = [];
		for ( var i = 0; i < e.length; ++i ) {
			if (e[i].selected) a.push(e[i].value);
		}
		return v(a.join(', '));
	} 
	if (e.type == "checkbox" ) return v(e.checked ? "on" : "off" );
	else return v(e.value);
}

// Purpose: Display values of all form elements including user input if any.
// This function is called by the "onsubmit" event. 
// This is written in such as way that it returns "false" when it should not 
// perform the "action" (when it should not send a request to an external server). 
// That's because we want it to work just inside the browser. If you return 
// "true" to "onsubmit" function, it will then send a "get" or "post" request 
// to the URL in the action="" attribute.
function display() {
    clearOutput();
    if (!haveValidation) {
        errorOutput('This platform does not support the HTML5 validation API.');
    }
    validOkay = true;
    // need to undisable checkbox so checkbox status is sent with POST request
    // ("readonly" doesn't work for checkboxes, hence this work-around.)
    $("#24_hr_cycle").removeAttr("disabled");

    for (var i = 0; i < input_raw.length; ++i) {
        var e = input_raw.elements[i];
        //output(formatValue(e));
        // var name = e.name;
        //if(!haveValidation) {
        //	output(formatValue(e));
        // output.output += '<p>' + s + '</p>';
        //	$(("#hidden_" + i)).val(formatValue(e));
        //}
        //if(haveValidation && isValid(e)) {
        output(formatValue(e));
        // output.output += '<p>' + s + '</p>';
        // Now that I can almost parse the JSON response from google maps,
        // (see code in ajax_request.js) I need to
        // write methods that take origin and destination from the user and insert
        // them into separate (?) XML request objects. Then when responses come back, do
        // something such as display a map of the route.
        return false;
    }
// The following function is much like calling display(). Unlike display() by itself, submitDisplay() returns true.
// Returning true calls the action attribute (a URL) of onsubmit(). This extra step is only necessary 
// when you want to send a request to an external server at the URL in "action".
    function submitDisplay() {
        display();
        return validOkay;
    }

// Purpose: Save all the user input into an array called _____?
// How do I create a non-numeric array?
    /*var myAddress1 = new Object();
     myAddress1.number = "3719";
     myAddress1.street = "Lola";
     myAddress1.city = "San Mateo";
     myAddress1.state = "CA";
     myAddress1.zip = "94403";*/
    function saveValues(input_raw) {
        //create the object
        var userInput = new Object();
        // example of workable syntax:
        var myAddress1 = new Object();
        myAddress1.number = "3719";
        myAddress1.street = "Lola";
        myAddress1.city = "San Mateo";
        myAddress1.state = "CA";
        myAddress1.zip = "94403";
        //another example:
        //The associative array notation has exactly the same effect -
//obj["key"] = value;
//e.g. document ["forms"["registration"["e-mail"
        // loop through user input from form
        // for each item, add name and value to the array
        for (var i = 0; i < input_raw.length; i++) {
            // I don't know how to get the data from the form into the JS object
            userInput[input_raw[i].name] = input_raw[i].value;
        }


        /*	v = function(s) {return e.name + ': ' + s }

         if (e.type == "radio") {
         if (e.checked) return v(e.value);
         else return "" ;
         }

         // for "select-multiple" display a comma-separated list
         if(e.type == "select-multiple") {
         a = [];
         for ( var i = 0; i < e.length; ++i ) {
         if (e[i].selected) a.push(e[i].value);
         }
         return v(a.join(', '));
         }
         if (e.type == "checkbox" ) return v(e.checked ? "on" : "off" );
         else return v(e.value);*/
    }


    window.onload = init;
}WQA