var $locations = $('#locations');
var markers = [];

function addLocation(loc) {
	var elem = $('<div class="location" data-id='+loc.id+'><div class="name">'+loc.name+'</div><div class="close"></div></div>');
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

function refreshView() {
	refreshMarkers();
	refreshLocations();
}

function loadPreset(key) {
	if (key) {
		locations = data[key].slice();
	} else {
		locations = [];
	}
	refreshView();
}