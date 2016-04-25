var map;
var autocomplete;
var locations = [];
var markers = [];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 8,
		mapTypeControl: false,
		streetViewControl: false
	});
	initAutocomplete();

	fakeData();
}

function initAutocomplete() {
	var input = document.getElementById('pac-input');
	autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);

	autocomplete.addListener('place_changed', function() {
		marker.setVisible(false);
		var place = autocomplete.getPlace();
		console.log(place);
		
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}
		marker.setPosition(place.geometry.location);
		marker.setVisible(true);
		locations.push({name:place.name, latLng: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng())});
	});
}

function fakeData() {
	locations = [];
	locations.push({name:"A", latLng: new google.maps.LatLng(36.255, -115.238)});
	locations.push({name:"B", latLng: new google.maps.LatLng(36.778, -119.417)});
	locations.push({name:"C", latLng: new google.maps.LatLng(40.714, -74.005)});
	locations.push({name:"D", latLng: new google.maps.LatLng(23.634, -102.552)});
	
	var bounds = new google.maps.LatLngBounds();
	for(var i=0; i<locations.length; i++) {
		var marker = new google.maps.Marker({position: locations[i].latLng, map: map, title: locations[i].name});
		markers.push(marker);
		bounds.extend(locations[i].latLng);
	}
	map.fitBounds(bounds);
}

function clearMarkers() {
	$.each(markers, function(i, marker) {
		marker.setMap(null);
	});
	markers = [];
}

function refreshMarkers() {
	if (locations.length > 0) {
		var bounds = new google.maps.LatLngBounds();
		$.each(locations, function(i, loc) {
			var position = new google.maps.LatLng(loc.lat, loc.lng);
			markers.push(
				new google.maps.Marker({
					position: position,
					map: map,
					title: loc.name
				})
			);
			bounds.extend(position);
		});
		map.fitBounds(bounds);
	} else {
		map.setCenter({lat: 0, lng: 0});
		map.setZoom(2);
	}
}

function loadPreset(key) {
	clearMarkers();
	if (key) {
		locations = data[key].slice();
	} else {
		locations = [];
	}
	refreshMarkers();
}

//locations[i].name
//locations[i].latLng.lat();
//locations[i].latLng.lng();


function calculate_distance()
{
  var service2 = new google.maps.DistanceMatrixService;
	//var origin1 = 'Hamburg, Germany';
	//var destinationB = {lat: 50.087, lng: 14.421};
	var origin0={lat:locations[0].latLng.lat(), lng: locations[0].latLng.lng()}
	var origin1={lat:locations[1].latLng.lat(), lng: locations[1].latLng.lng()}
	var origin2={lat:locations[2].latLng.lat(), lng: locations[2].latLng.lng()}
	var origin3={lat:locations[3].latLng.lat(), lng: locations[3].latLng.lng()}
	var destinationA={lat:locations[0].latLng.lat(), lng: locations[0].latLng.lng()}
	var destinationB={lat:locations[1].latLng.lat(), lng: locations[1].latLng.lng()}
	var destinationC={lat:locations[2].latLng.lat(), lng: locations[2].latLng.lng()}
	var destinationD={lat:locations[3].latLng.lat(), lng: locations[3].latLng.lng()}
	var geocoder = new google.maps.Geocoder;
        service2.getDistanceMatrix({
          origins: [origin0, origin1, origin2, origin3],
          destinations: [ destinationA, destinationB, destinationC, destinationD],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, function(response, status) {
          if (status !== google.maps.DistanceMatrixStatus.OK) {
            alert('Error was: ' + status);
          } else {
            var originList = response.originAddresses;
            var destinationList = response.destinationAddresses;
            //var outputDiv = document.getElementById('output');
            //outputDiv.innerHTML = '';
            //deleteMarkers(markersArray);

            //var showGeocodedAddressOnMap = function(asDestination) {
            //  var icon = asDestination ? destinationIcon : originIcon;
            //  return function(results, status) {
            //    if (status === google.maps.GeocoderStatus.OK) {
            //      map.fitBounds(bounds.extend(results[0].geometry.location));
            //      markersArray.push(new google.maps.Marker({
            //        map: map,
            //        position: results[0].geometry.location,
            //        icon: icon
            //      }));
            //    } else {
            //      alert('Geocode was not successful due to: ' + status);
            //    }
            //  };
            //};

            for (var i = 0; i < originList.length; i++) {
              var results = response.rows[i].elements;
            //  geocoder.geocode({'address': originList[i]},
            //      showGeocodedAddressOnMap(false));
              for (var j = 0; j < results.length; j++) {
            //    geocoder.geocode({'address': destinationList[j]},
            //        showGeocodedAddressOnMap(true));
            //    //outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
            //        ': ' + results[j].distance.text + ' in ' +
            //       results[j].duration.text + '<br>';
								var temp = originList[i] + ' to ' + destinationList[j] +
                    ': ' + results[j].distance.text;// + ' in ' +
                    //results[j].duration.text ;//+ '<br>';
										alert(temp);
              }
            }
          }
        });
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