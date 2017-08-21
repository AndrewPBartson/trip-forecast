// present_user_interface.js


function showTimePicker() {
$('#resume_time').timepicker();	
}

function showDatePicker() {
$('#depart_time').datetimepicker({
	timeFormat: 'HH:mm z',
	showTimezone: true,
	timezone: 'PT',
	timezoneList: [ 
			{ value: 'ET', label: 'Eastern'}, 
			{ value: 'CT', label: 'Central' }, 
			{ value: 'MT', label: 'Mountain' }, 
			{ value: 'PT', label: 'Pacific' } 
		]
   });
}
// Form presentation and optionizing functions
function select24cycle() {
 if (document.getElementById("24_hr_cycle").checked)  {
				  $("#hours_rest_li").css("display", "none");  
				  $("#resume_time_li").css("display", "block");
				  $("#hours_driving").attr( "max", "24"); 
			  } 
			  else {
				  $("#hours_rest_li").css("display", "block");  
				  $("#resume_time_li").css("display", "none");
				  $("#hours_driving").attr( "max", "200"); //      
			  }        
}

function setCustom() {
		   if (document.getElementById("custom").checked)  {
				  $("#custom_li").css("background-color", "yellow");   
				  $("#default_li").css("background-color", "white");
				  $("#custom_options").css("background-color", "yellow");
				  $("#custom_options input").removeAttr("readonly");
				  $("#hours_rest_li").css("display", "block");
				  $("#resume_time_li").css("display", "none");
				  $("#24_hr_cycle").attr("disabled", false);
				  $("#24_hr_cycle").removeAttr("checked"); 
				  $("#custom_options").css("opacity", "1");  
			  } 
			  else {
				 $("#custom_li").css("background-color", "white");   
				 $("#default_li").css("background-color", "yellow");
				 $("#custom_options").css("background-color", "white"); 
				 optionReset();
				 $("#24_hr_cycle").attr("checked", "checked");
				 $("#24_hr_cycle").attr("disabled", "disabled");
				 $("#custom_options input").attr("readonly", "readonly");
				 $("#custom_options").css("opacity", "0.4");
			  } 
}
function setDefault() {
		      if (document.getElementById("default").checked)  {
				 $("#custom_li").css("background-color", "white");   
				 $("#default_li").css("background-color", "yellow");
				 $("#custom_options").css("background-color", "white"); 
				 optionReset();
				 $("#24_hr_cycle").attr("checked", "checked");
				 $("#24_hr_cycle").attr("disabled", "disabled");
				 $("#custom_options input").attr("readonly", "readonly");
				 $("#custom_options").css("opacity", "0.4");
				  } 
			  else {
				  $("#custom_li").css("background-color", "yellow");   
				  $("#default_li").css("background-color", "white");
				  $("#custom_options").css("background-color", "yellow");
				  $("#custom_options input").removeAttr("disabled");
				  $("#custom_options input").removeAttr("readonly");
				  $("#hours_rest_li").css("display", "block");
				  $("#resume_time_li").css("display", "none");
				  $("#24_hr_cycle").attr("disabled", false);
				  $("#24_hr_cycle").removeAttr("checked"); 
				  $("#custom_options").css("opacity", "1"); 
				    
			  }     
}
function optionReset () {
	document.getElementById("hours_rest_li").style.display = "none";  
	document.getElementById("resume_time_li").style.display = "block"; 
	document.getElementById("24_hr_cycle").checked = "checked";
	document.getElementById("speed").value = "67";
	document.getElementById("hours_driving").value = "11";
	document.getElementById("resume_time").value = "08:00";
	document.getElementById("hours_rest").value = "10";
	$("#hours_driving").attr( "max", "24"); // also "max" for "hours_rest" needs to be adjusted at various times. 
}