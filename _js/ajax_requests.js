// ajax_requests.js
// Example of proper url for google maps request:
// "http://maps.googleapis.com/maps/api/geocode/json?address=san carlos ca&sensor=false"
var locationJson;

function loadXMLDoc()
{
// Take starting point (input by user) and store it in a variable.
var origin = (document.getElementById("origin").value);
var request;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  request = new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  request = new ActiveXObject("Microsoft.XMLHTTP");
  }
var requestText = ("http://maps.googleapis.com/maps/api/geocode/json?address=" + origin + "&sensor=false");
request.open("GET", requestText, true);
request.onreadystatechange = function() 
  {
  if (request.readyState==4 && request.status==200)
    {
	var locationJson = JSON.parse(request.responseText);
	//console.log(some_data);
        document.getElementById("results").output += "test hi Amma!";
	    document.getElementById("results").output += locationJson.results[0].address_components[0].long_name;
        document.getElementById("results").output += request.responseText;
        //document.getElementById("output_data").output += "</p>";

	/*jQuery.each(locationJson, function()
       {
       //alert((this.status[0])+ "hello"); 
       });*/
    }
  }
request.send();
}