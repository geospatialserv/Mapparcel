var latitude = 41.442959,
            longitude = -70.580726,
            map_zoom = 14;
 var map_options = {
            center: new google.maps.LatLng(latitude, longitude),
            zoom: map_zoom,
            panControl: true,
            zoomControl: true,
			zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				mapTypeIds: ["roadmap", "terrain", "satellite"],
				position: google.maps.ControlPosition.LEFT_TOP
			},
            streetViewControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: true,
        }
        //inizialize the map

var map = new google.maps.Map(document.getElementById('map'), map_options);
var locationButton = document.createElement("button");
locationButton.innerHTML = '<i class="fa-solid fa-location-crosshairs fa-lg"></i>';
locationButton.classList.add("custom-map-control-button");
map.controls[google.maps.ControlPosition.RIGHT_TOP].push(locationButton);
locationButton.addEventListener("click", function () {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                infoWindow.setPosition(pos);
                infoWindow.setContent("Location found.");
                infoWindow.open(map);
                map.setCenter(pos);
            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        }
        else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation.");
    infoWindow.open(map);
}
var geolayer='geojsonLayers/81_425_0.geojson';

var featureStyle = {
    fillColor: '#ADFF2F',
    fillOpacity: 0.1,
    strokeColor: '#ADFF2F',
    strokeWeight: 1
  };
 var bounds = new google.maps.LatLngBounds();
  map.data.addListener('addfeature', function(e) {
    processPoints(e.feature.getGeometry(), bounds.extend, bounds);
    map.fitBounds(bounds);
  });
  map.data.addListener('click', function(e) {
    var bounds = new google.maps.LatLngBounds();
    processPoints(e.feature.getGeometry(), bounds.extend, bounds);
    map.fitBounds(bounds);
  });
  //Load mapdata via geoJson
 map.data.loadGeoJson(geolayer);
function processPoints(geometry, callback, thisArg) {
  if (geometry instanceof google.maps.LatLng) {
    callback.call(thisArg, geometry);
  } else if (geometry instanceof google.maps.Data.Point) {
    callback.call(thisArg, geometry.get());
  } else {
    geometry.getArray().forEach(function(g) {
      processPoints(g, callback, thisArg);
    });
  }
}