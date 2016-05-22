var $locations = $('#locations');
var markers = [];
var directionsDisplay = [];

function addLocation(loc) {
	var elem = $('<div class="location" data-id='+loc.id+'>' +
					'<div class="name">'+loc.name+'</div>' + 
					'<div class="close"></div>' + 
					'<div class="time-limits">' +
						'<input type="text" value="" class="after" placeholder="from"/>' + 
						'<input type="text" value="" class="before" placeholder="to"/>' + 
					'</div>' + 
				'</div>');
	elem.find('.close').on('click', removeLocation);
	$locations.append(elem);
}
function removeLocation() {
	var elem = $(this).closest('.location');
	var id = elem.data('id');
	//remove location from dataset
	$.each(locations, function(i, loc) {
		if (loc.id == id) {
			removeMarker(i);
			locations.splice(i, 1);
			return false;
		}
	});
	elem.remove();
}

function removeMarker(i) {
	var marker = markers[i];
	markers.splice(i, 1);
	marker.setMap(null);
	markers[i];
}

function clearMarkers() {
	$.each(markers, function(i, marker) {
		marker.setMap(null);
	});
	markers = [];
}

function refreshMarkers() {
	clearMarkers();
	if (locations.length > 0) {
		var bounds = new google.maps.LatLngBounds();
		$.each(locations, function(i, loc) {
			markers.push(
				new google.maps.Marker({
					position: loc.latLng,
					map: map,
					title: loc.name
				})
			);
			bounds.extend(loc.latLng);
		});
		map.fitBounds(bounds);
	} else {
		map.setCenter({lat: 0, lng: 0});
		map.setZoom(2);
	}
}

function clearLocations() {
	$locations.empty();
}

function refreshLocations() {
	clearLocations();
	$.each(locations, function(i, loc) {
		addLocation(loc);
	});
}

function clearRoute() {
	$.each(directionsDisplay, function(i, directions) {
		directions.setMap(null);
	});
	directionsDisplay = [];	
}

function drawRoute(route) {
	clearRoute();
	for(var i=0;i*8<=route.length;i++) {
		drawRoutePart(route.slice(i*8-i, (i+1)*8-i));
	}
}

function drawRoutePart(route) {
	if (route.length > 0) {
		new google.maps.DirectionsService().route({
			origin: route[0].latLng,
			destination: route[route.length - 1].latLng,
			waypoints: route
						.splice(1, route.length - 2)
						.map(function(loc) {
							return {location: loc.latLng, stopover: true};
						}),
			optimizeWaypoints: false,
			travelMode: google.maps.TravelMode.DRIVING
		},
		function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				var directions = new google.maps.DirectionsRenderer({
					suppressMarkers:true
				});
				directions.setMap(map);
				directions.setDirections(response);
				directionsDisplay.push(directions);
				refreshMarkers();
			}
		});
  	}
}

function refreshView() {
	clearRoute();
	refreshMarkers();
	refreshLocations();
	initDateTimePicker();
}

function loadPreset(key) {
	if (key) {
		locations = data[key].slice();
	} else {
		locations = [];
	}
	refreshView();
}

function initDateTimePicker() {
	var $input = $('.time-limits .after, .time-limits .before');
	$input.datetimepicker({
		dayOfWeekStart : 1,
		lang:'en',
		step:10
	});
	$input.on('focus', function() {
		$('body').addClass('show-datetime-picker');
	});
	$input.on('blur', function() {
		$('body').removeClass('show-datetime-picker');
	});	
	$('.time-limits .after').on('change', function() {
		var id = $(this).closest('.location').data('id');
		if($(this).val() == '') {
			getLocation(id).timeFrame.begin = 0;
		} else {
			getLocation(id).timeFrame.begin = $(this).datetimepicker('getValue').getTime();
		}
	});
	$('.time-limits .before').on('change', function() {
		var id = $(this).closest('.location').data('id');
		if($(this).val() == '') {
			getLocation(id).timeFrame.end = 0;
		} else {
			getLocation(id).timeFrame.end = $(this).datetimepicker('getValue').getTime();
		}
	});
}

function getLocation(id) {
	var loc;
	$.each(locations, function(i, l) {
		if (l.id == id) {
			loc = l;
			return false;
		}
	});
	return loc;
}