var map;
var autocomplete;
var locations = [];
var directionsDisplay;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 8,
		mapTypeControl: false,
		streetViewControl: false
	});
	
	directionsDisplay = new google.maps.DirectionsRenderer({
		suppressMarkers:true
	});
    directionsDisplay.setMap(map);
	
	initAutocomplete();

	loadPreset('test');
}

function addAutocompleteLocation() {
	var place = autocomplete.getPlace();
	locations.push({
		id: generateId(),
		name:place.formatted_address,
		latLng: place.geometry.location
	});
	$('#pac-input').val('');
	refreshView();
}

function initAutocomplete() {
	var input = document.getElementById('pac-input');
	autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);

	autocomplete.addListener('place_changed', addAutocompleteLocation);
}

function generateId() {
	var max = -1;
	$.each(locations, function(i, loc) {
		if (loc.id > max) {
			max = loc.id;
		}
	});
	return max + 1;
}

//locations[i].name
//locations[i].latLng.lat();
//locations[i].latLng.lng();


function calculateDistance() {
	var nodes = locations.map(function(e){
		return e.latLng
	});
	declare_some_tables();
	var geocoder = new google.maps.Geocoder;
        new google.maps.DistanceMatrixService().getDistanceMatrix({
          origins: nodes,
          destinations: nodes,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        },
		function(response, status) {
			if (status !== google.maps.DistanceMatrixStatus.OK) {
				alert('Error was: ' + status);
			} else {
				var originList = response.originAddresses;
				var destinationList = response.destinationAddresses;
				for (var i = 0; i < originList.length; i++) {
					var results = response.rows[i].elements;
					for (var j = 0; j < results.length; j++) {
						var temp = originList[i] + ' to ' + destinationList[j] + ': ' + results[j].distance.text;
						console.log(temp);
						distancematrix_1[i][j]=results[j].distance.value;//in meters
					}
				}
			}
        });
}

function fakeDrawRoute() {
	drawRoute(locations.slice());
}

function drawRoute(route) {
	if (route.length > 0) {
		new google.maps.DirectionsService().route({
			origin: route[0].latLng,
			destination: route[0].latLng,
			waypoints: route
						.splice(1, route.length - 1)
						.map(function(loc) {
							return {location: loc.latLng, stopover: true};
						}),
			optimizeWaypoints: false,
			travelMode: google.maps.TravelMode.DRIVING
		},
		function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
			/*
			var route = response.routes[0];
		  var summaryPanel = document.getElementById('directions_panel');
		  summaryPanel.innerHTML = '';
		  // For each route, display summary information.
		  for (var i = 0; i < route.legs.length; i++) {
			var routeSegment = i + 1;
			summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
			summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
			summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
			summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
		  }
		}*/
			}
		});
  	}
}
      
/*
	  function initMap2() {
		function initMap() {
		  var bounds = new google.maps.LatLngBounds;
		  var markersArray = [];
		  var origin1 = {lat: 55.93, lng: -3.118};
		  var origin2 = 'Greenwich, England';
		  var destinationA = 'Stockholm, Sweden';
		  var destinationB = {lat: 50.087, lng: 14.421};
		  var destinationIcon = 'https://chart.googleapis.com/chart?' +
			  'chst=d_map_pin_letter&chld=D|FF0000|000000';
		  var originIcon = 'https://chart.googleapis.com/chart?' +
			  'chst=d_map_pin_letter&chld=O|FFFF00|000000';
		  var map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 55.53, lng: 9.4},
			zoom: 10,
			mapTypeControl: false,
			streetViewControl: false
		  });
		  var geocoder = new google.maps.Geocoder;
		  var service = new google.maps.DistanceMatrixService;
		  service.getDistanceMatrix({
			origins: [origin1, origin2],
			destinations: [destinationA, destinationB],
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false
		  }, function(response, status) {
			if (status !== google.maps.DistanceMatrixStatus.OK) {
			  alert('Error was: ' + status);
			} else {
				console.log(response);
			  /*var originList = response.originAddresses;
			  var destinationList = response.destinationAddresses;
			  var outputDiv = document.getElementById('output');
			  outputDiv.innerHTML = '';
			  deleteMarkers(markersArray);
			  var showGeocodedAddressOnMap = function(asDestination) {
				var icon = asDestination ? destinationIcon : originIcon;
				return function(results, status) {
				  if (status === google.maps.GeocoderStatus.OK) {
					map.fitBounds(bounds.extend(results[0].geometry.location));
					markersArray.push(new google.maps.Marker({
					  map: map,
					  position: results[0].geometry.location,
					  icon: icon
					}));
				  } else {
					alert('Geocode was not successful due to: ' + status);
				  }
				};
			  };
			  for (var i = 0; i < originList.length; i++) {
				var results = response.rows[i].elements;
				geocoder.geocode({'address': originList[i]},
					showGeocodedAddressOnMap(false));
				for (var j = 0; j < results.length; j++) {
				  geocoder.geocode({'address': destinationList[j]},
					  showGeocodedAddressOnMap(true));
				  outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
					  ': ' + results[j].distance.text + ' in ' +
					  results[j].duration.text + '<br>';
				}
			  }*//*
			}
		  });
		}
		function deleteMarkers(markersArray) {
		  for (var i = 0; i < markersArray.length; i++) {
			markersArray[i].setMap(null);
		  }
		  markersArray = [];
		}
		initMap();
	  }*/

$('#fake-input').on('change', function() {
	loadPreset($(this).val());
});

initMap();
