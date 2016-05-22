var DISTANCE_MATRIX_SERVICE_DELAY = 15000;

var map;
var autocomplete;
var locations = [];
var locations_origins;
var locations_destinations;
var beginTime = new Date().getTime();

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 8,
		mapTypeControl: false,
		streetViewControl: false
	});
	
	initAutocomplete();	

	loadPreset('europe5');
}

function addAutocompleteLocation() {
	var place = autocomplete.getPlace();
	locations.push({
		id: generateId(),
		name:place.formatted_address,
		latLng: place.geometry.location,
		timeFrame: {begin:0, end:0}
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


var requestsToLoad, requestsCounter;

function initDistanceMatrix()
{
	number_of_elements=locations.length;
	distancematrix_1 = new Array(number_of_elements);
	for (var i=0; i < number_of_elements; i++) {
		distancematrix_1[i] = new Array(number_of_elements);
	}
}

function calculateDistance()
{
	initDistanceMatrix();
	requestsToLoad = 0;
	requestsCounter = 0;
	for(var i=0;i*10<locations.length;i++) {
		for(var j=0;j*10<locations.length;j++) {
			loadDistanceMatrix(i,j);
		}
	}
}

function loadDistanceMatrix(indexI,indexJ) {
	setTimeout(function() {
		console.log('loadDistanceMatrix(' + indexI + ',' + indexJ + ')');
		var nodes_origins = locations.slice(indexI*10, (indexI+1)*10).map(function(e){
			return e.latLng
		});
		var nodes_destinations = locations.slice(indexJ*10, (indexJ+1)*10).map(function(e){
			return e.latLng
		});
		new google.maps.DistanceMatrixService().getDistanceMatrix({
		  origins: nodes_origins,
		  destinations: nodes_destinations,
		  travelMode: google.maps.TravelMode.DRIVING,
		  unitSystem: google.maps.UnitSystem.METRIC,
		  avoidHighways: false,
		  avoidTolls: false
		},
		function(response, status) {
			if (status !== google.maps.DistanceMatrixStatus.OK) {
				alert('Error was: ' + status);
			} else {
				requestsCounter++;
				var originList = response.originAddresses;
				var destinationList = response.destinationAddresses;
				for (var i = 0; i < originList.length; i++) {
					var results = response.rows[i].elements;
					for (var j = 0; j < results.length; j++) {
						distancematrix_1[i+indexI*10][j+indexJ*10] = {
							distance: results[j].distance.value,
							duration: results[j].duration.value
						}
					}
				}
				
				console.log('loading distance matrix: ' + requestsCounter + "/" + requestsToLoad);
				if (requestsCounter == requestsToLoad) {
					console.log('distance matrix loaded');
					//calculateCost();
					calculate_init();
				}
			}
		});
	}, requestsToLoad++ * DISTANCE_MATRIX_SERVICE_DELAY);
}

function fakeDrawRoute() {
	drawRoute(locations.slice());
}

function getLocation(id) {
	return locations.filter(function(loc) {
		return loc.id == id;
	})[0];
}

function process_all()
{
	if (locations.length > 20) {
		alert('Limit of locations is 20.');
	} else {
		calculateDistance();
	}
}

$('#fake-input').on('change', function() {
	loadPreset($(this).val());
});
$('#calculate').on('click', function() {
	process_all();
});

initMap();
