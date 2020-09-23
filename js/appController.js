let map;
let forecastSet = [];

// ---------------- Initialize map and event listener --------------------

function initMap() {
  map = new google.maps.Map(document.getElementById('map_'), {
    center: {lat: 38.617319, lng: -98.0},
    zoom: 5,
    draggableCursor: 'default'
  });

  map.addListener('click', function(event) {
    let forecastObj = {
      messages: []
    };
    // remove error messages from previous click, if any
    clearErrorMsg();
    getLatLng(event, forecastObj);
    sendGeoRequest(event, forecastObj);
    sendWeatherRequest(event, forecastObj);
    // when both requests come back, check for errors
  });
}

// ----------- Get lat/lng from click event, round it off ---------------------

function getLatLng(event, forecastObj) {
  let tempLat = event.latLng.lat();
  let tempLng = event.latLng.lng();
  forecastObj.lat = tempLat.toFixed(4);
  forecastObj.lng = tempLng.toFixed(4);
  console.log('forecastObj :', forecastObj);
}

// ------------- Ajax request for name of city and state ----------------------

function sendGeoRequest(event, forecastObj) {
  let url_geo = "https://maps.googleapis.com/maps/api/geocode/json?latlng="
  + forecastObj.lat + "," + forecastObj.lng + "&result_type=postal_code&key=AIzaSyCw4czRm3DzsYvilZl7s2_TgLJedG5RVbg";
  $.ajax({
    url: url_geo,
    type: "GET",
    dataType: 'json',
    success: function(res_geo) {
      forecastObj.geoResComplete = true;
      if (validateGeoRes(res_geo, forecastObj)) {
        createMarker(event.latLng, map, forecastObj);
        addGeoDataToObj(res_geo, forecastObj);
        addGeoDataToSidebar(res_geo, forecastObj);
        forecastController(forecastObj);
      }
      else {
        forecastController(forecastObj);
      }
    },
    error: function(forecastObj) {
      forecastObj.geoResComplete = true;
      forecastObj.validGeoRes = false;
      forecastController(forecastObj);
    }
  });
}

// ------------- if invalid response -  ---------------------------------------

function showErrorMsg(forecastObj) {
  forecastObj.messages.push('Please try again.');
  if (forecastObj) {
    forecastObj.messages.forEach((msg) => {
      $("#cityNames").append('<div><p class="placeName message">' + msg + '</p></div>');
    });
  }
}
// -------------- Clear error messages from city list --------------------------

function clearErrorMsg() {
  // if there are any previous error messages, remove them.
  let elems = document.querySelectorAll('.message');
  elems.forEach((elem) => {
    let elemParent = elem.parentNode;
    elemParent.parentNode.removeChild(elemParent);
  });
}

// --------------- Check geo response - undefined? in US?  --------------------

function validateGeoRes(res_geo, forecastObj) {
  if (res_geo['results'][0] === undefined) {
    forecastObj.validGeoRes = false;
    forecastObj.messages.push("No location data.");
    return false;
  }
  let indexCountry = res_geo['results'][0]['address_components'].length - 1;
  if (res_geo['results'][0]['address_components'][indexCountry].short_name !== 'US') {
    forecastObj.validGeoRes = false;
    forecastObj.messages.push("Location must be in USA.");
    return false;
  }
  forecastObj.validGeoRes = true;
  return true;
}

// --------------------- Add marker to map ------------------------------------

function createMarker(position, map, forecastObj) {
  var marker = new google.maps.Marker ({
    position: position,
    icon: "images/next.png",
    map: map
  });
  forecastObj.marker = marker;
}

// ----------------- Add city and state to forecast object --------------------

function addGeoDataToObj(res_geo, forecastObj) {
  forecastObj.city = res_geo['results'][0]['address_components'][1]['long_name'];
  let indexState = res_geo['results'][0]['address_components'].length - 2;
  forecastObj.state = res_geo['results'][0]['address_components'][indexState]['short_name'];
  forecastObj.location = forecastObj.city + ', ' + forecastObj.state;
}

// ---------------------- Add city and state to sidebar ---------------------------

function addGeoDataToSidebar(res_geo, forecastObj) {
  $("#cityNames").append('<div><p class="placeName">' + forecastObj.location + '</p></div>');
}

// ----------- Ajax request for weather data for clicked location -------------

function sendWeatherRequest(event, forecastObj) {
  let url_weather = "https://api.weather.gov/points/" +
  forecastObj.lat + "," + forecastObj.lng + "/forecast";
  $.ajax({
    url: url_weather,
    type: "GET",
    dataType: 'json',
    success: function(res_weather) {
      forecastObj.weatherResComplete = true;
      forecastObj.validWeatherRes = true;
      //console.log("Ajax response for weather - ", res_weather);
      console.log('res_weather : ', res_weather);
      addWeatherDataToObj(res_weather, forecastObj);
      addWeatherDataToPage(res_weather, forecastObj);
      forecastController(forecastObj);
    },
    error: function(res_weather) {
      forecastObj.weatherResComplete = true;
      forecastObj.validWeatherRes = false;
      forecastObj.messages.push('No data from weather server.')
      forecastController(forecastObj);
    }
  });
  // console.log("Forecast object - ", forecastObj);
}

function rollBack(forecastObj) {
  // remove name of city from sidebar
  if (forecastObj.validGeoRes) {
    let deleteDiv = document.querySelector('#cityNames').lastChild;
    deleteDiv.parentNode.removeChild(deleteDiv);
  }
  // remove row of forecasts from forecast grid due to no location data
  if (forecastObj.validWeatherRes) {
    let deleteRow = document.querySelector('#forecastGrid').lastElementChild;
    deleteRow.parentNode.removeChild(deleteRow);
  }
  // remove marker from map
  if (forecastObj.marker) {
    forecastObj.marker.setMap(null);
  }
}

// ------------------- Add weather data to forecast object --------------------

function addWeatherDataToObj(res_weather, forecastObj) {
  forecastObj.periods = res_weather.properties.periods;
}

// ---------------------- Add weather data to DOM -----------------------------

function addWeatherDataToPage(res_weather, forecastObj) {
  createForecastHeader(forecastObj);
  $("#forecastGrid").append(createForecastRow(forecastObj));
}

// -------------- Create header row for forecast grid -------------------------

function createForecastHeader(forecastObj) {
  // if it hasn't been done yet,
  // insert names of days and nights into prebuilt timePeriod boxes
  let firstPeriod = document.querySelector(".timePeriod");
  if (firstPeriod.innerHTML === "") {
    $(".timePeriod").each(function(i) {
      this.textContent = forecastObj.periods[i].name ;
    })
  }
}

// -------------- Create row of forecasts for one location --------------------

function createForecastRow(forecastObj) {
  // create the first part of a forecast row starting with name of location
  let rowStr = '<section class="icon_row"><div class="icon_box city_box"><p class="location">' +
  forecastObj.location + '</p></div>';
  // for each time period of forecast, append items to row -
  // thumbnail, short forecast, and hi/lo temperature
  forecastObj.periods.forEach((period) => {
    rowStr += '<div class="icon_box"><img class="weather_icon" src="' + period.icon + '">'
    + '<p class="icon_text">' + period.shortForecast +
    '</p><h2 class="temperature">' + period.temperature + '</h2></div>';
  })
  rowStr += '</section>';
  return rowStr;
}

// ----------- Decision - complete transaction or rollback --------------------

function forecastController(forecastObj) {
  if (forecastObj.geoResComplete && forecastObj.weatherResComplete) {
    if (forecastObj.validGeoRes && forecastObj.validWeatherRes) {
      forecastSet.push(forecastObj);
      refreshButtons();
    }
    else {
      rollBack(forecastObj);
      showErrorMsg(forecastObj);
    }
  }
}

// -------- If ajax requests are successful, show buttons in sidebar ----------

function refreshButtons () {
  let buttonList = document.querySelectorAll(".btn_sidebar");
  for(button of buttonList) {
    if (forecastSet.length > 0) {
      button.classList.remove('invisible');
    }
    else {
      button.classList.add('invisible');
    }
  }
}
// -------------------- Refresh markers and city list ------------------------

function refreshCitiesAndMarkers() {
  // clear markers -
  forecastSet.forEach((city, index) =>  {
    forecastSet[index].marker.setMap(null);
  });
  // clear list of city names -
  let cityGrid = document.querySelector('#cityNames');
  cityGrid.innerHTML = '';
  // reset to current markers and city names -
  forecastSet.forEach((city, index) => {
    $("#cityNames").append('<div><p class="placeName">' + city.location + '</p></div>');
    forecastSet[index].marker.setMap(map);
  })
}

// ----- "Show Forecast" button - hide map and sidebar, show forecastGrid -----

$(".showForecasts").click(function(){
  $("#map_").toggle();
  $("#side_bar_").toggle();
  $("#forecastGrid").toggle();
  clearErrorMsg();
  console.log('forecastSet :', forecastSet);
  //console.log(JSON.stringify(forecastSet));
});

// ----- "Return to Map" button - hide forecastGrid, show map and sidebar -----

$("#goBack").click(function(){
  $("#map_").toggle();
  google.maps.event.trigger(map, 'resize');
  $("#side_bar_").toggle();
  $("#forecastGrid").toggle();
});

// -------------- "Start Over" button - reload page -----------------

$("#startOver").click(function(){
  forecastSet.length = 0;
});
