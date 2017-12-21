let map;
let forecastSet = [];
function initMap() {
  map = new google.maps.Map(document.getElementById('map_'), {
    center: {lat: 38.617319, lng: -98.0},
    zoom: 5,
    draggableCursor: 'default'
  });

  map.addListener('click', function(event) {
    let forecastObj = {};
    sendGeoRequest(event, forecastObj);
    sendWeatherRequest(event, forecastObj);
    if (forecastSet[0] === undefined) {
      displayButtons();
    }
  });
}

// this is a comment near placeMarker

function placeMarker(position, map) {
  var marker = new google.maps.Marker ({
    position: position,
    icon: "images/next.png",
    map: map
  });
}

$("#anti_map").click(function(event) {
  // in next version, add pop-up giving more detailed forecast
})

function sendGeoRequest(event, forecastObj) {
  forecastObj.lat = event.latLng.lat();
  forecastObj.lng = event.latLng.lng();
  let url_geocode = "https://maps.googleapis.com/maps/api/geocode/json?latlng="
  + forecastObj.lat + "," + forecastObj.lng + "&result_type=postal_code&key=AIzaSyCw4czRm3DzsYvilZl7s2_TgLJedG5RVbg";
  $.get(url_geocode, function(res_geo) {
    if (res_geo['results'][0] !== undefined) {
      placeMarker(event.latLng, map);
      addGeoDataToObj(res_geo, forecastObj);
      addGeoDataToSidebar(res_geo, forecastObj);
      forecastObj.validClick = true
    }
  }, 'json');
}

function addGeoDataToObj(res_geo, forecastObj) {
  forecastObj.city = res_geo['results'][0]['address_components'][1]['long_name'];
  let indexState = res_geo['results'][0]['address_components'].length - 2;
  forecastObj.state = res_geo['results'][0]['address_components'][indexState]['short_name'];
  forecastObj.location = forecastObj.city + ', ' + forecastObj.state;
  console.log(forecastObj);
}

function addGeoDataToSidebar(res_geo, forecastObj) {
  console.log("res_geo - ", res_geo);
  $("#display_data").append('<div><p class="placeName">' + forecastObj.location + '</p></div>');
}

function sendWeatherRequest(event, forecastObj) {
  let url_weather = "https://api.weather.gov/points/" +
  forecastObj.lat + "," + forecastObj.lng + "/forecast";

  $.get(url_weather, function(res_weather) {
    if (forecastObj.validClick) {
      addWeatherDataToObj(res_weather, forecastObj);
      addWeatherDataToPage(res_weather, forecastObj);
      forecastSet.push(forecastObj);
    }
  }, 'json');
}

function addWeatherDataToObj(res_weather, forecastObj) {
  forecastObj.periods = res_weather.properties.periods;
}

function addWeatherDataToPage(res_weather, forecastObj) {
  console.log("res_weather - ", res_weather);

  // if it hasn't been done yet,
  // insert names of days and nights into header boxes
  let firstHeader = document.querySelector(".header");
  if (firstHeader.innerHTML === "") {
    $(".header").each(function(i) {
      this.textContent = forecastObj.periods[i].name ;
    })
  }

  // for this map click, create the first part of a row with location
  let rowStr = '<section class="icon_row"><div class="icon_box city_box"><p class="location">' +
  forecastObj.location + '</p></div>';
  // for each time period of forecast, append items to row -
  // thumbnail, short forecast, and hi or lo temperature
  for (let j = 0; j < forecastObj.periods.length; j++) {
    rowStr += '<div class="icon_box"><img class="weather_icon" src="' + forecastObj.periods[j].icon + '">'
   + '<p class="temperature">' + forecastObj.periods[j].temperature + '</p>' + '<p class="icon_text">' + forecastObj.periods[j].shortForecast +
     '</p></div>';
  }
  rowStr += '</section>';
  $("#anti_map").append(rowStr);
}

/* on click - hide map and sidebar and show anti_map */
$("#switch_view").click(function(){
  $("#map_").toggle();
  $("#side_bar_").toggle();
  $("#anti_map").toggle();
});

$("#startOver").click(function(){
  forecastSet.length = 0;
  // remove markers from map
  // remove forecasts for anti-map
});

$("#goBack").click(function(){
  $("#map_").toggle();
  $("#side_bar_").toggle();
  $("#anti_map").toggle();
});

function displayButtons() {
  $("#switch_view").toggle();
  $("#startOver").toggle();
}

function sendDirectionsRequest(event, forecastObj) {
  // doesn't work -- Error -  No 'Access-Control-Allow-Origin' header

  //let url_directions = "https://maps.googleapis.com/maps/api/directions/json?origin=75+9th+Ave+New+York,+NY&destination=MetLife+Stadium+1+MetLife+Stadium+Dr+East+Rutherford,+NJ+07073?key=AIzaSyAd0ZZdBnJftinI-qHnPoP9kq5Mtkey6Ac";
  //let url_directions = "https://maps.googleapis.com/maps/api/directions/json?origin=75+9th+Ave+New+York,+NY&destination=MetLife+Stadium+1+MetLife+Stadium+Dr+East+Rutherford,+NJ+07073&key=AIzaSyCw4czRm3DzsYvilZl7s2_TgLJedG5RVbg";

  //   $.ajax({
  //     url: url_route,
  //     type: "GET",
  //     dataType: 'json',
  //     cache: false,
  //     success: function(res_route){
  //         console.log('res_route - ', res_route);
  //     }
  // });
  //   });

  //   $.get(url_route, function(res_route) {
  //       console.log('res_route - ', res_route);
  //   // add a red line on map to show route
  // })
};
