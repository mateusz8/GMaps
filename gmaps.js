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
							duration: results[j].duration.value*1000
						}
					}
				}
				
				console.log('loading distance matrix: ' + requestsCounter + "/" + requestsToLoad);
				if (requestsCounter == requestsToLoad) {
					console.log('distance matrix loaded');
					//calculateCost();
					//calculate_init();
					newCalc();
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

//
// //
// // // NEW ALGORITHM
// //
//

function newCalc() {
	var states = minimalize(locations.length);

	console.log(states);
	
	if (states.length) {
		console.log('Choose path: ');
		var path = states[0];
		while (path.nextState != null) {
			console.log('state: ' + path.stringState + ', desision: ' + path.decision);
			path = path.nextState;
		};
		
		console.log('path: ' + path.stringState + ', cost: ' + states[0].decisionState.cost);
		drawRoute(path.state);
	} else {
		console.log('Nie znaleziono drogi spełniającej oczekiwania.');
		alert('Nie znaleziono drogi spełniającej oczekiwania.');
	}
}

function minimalize(step) {
	if (step > 1) {
		var states = minimalize(step-1);
	}
	else {
		var states = permute(locations);
		states = states.map(function(state) {
			return {
				nextState: null,
				state: state,
				stringState: pathToString(state),
				decision: null,
				decisionState: {state: state, cost: 0, time: 0}
			};
		})
	}
	console.log('step ' + step + ':');
	//console.log(states);
	
	var currStates = [];
	var currStringStates = [];
	var currDecisions = [];
	var currDecisionsState = [];
	
	for (var i = 0; i < states.length; i+= 1) {
		var index = (states[i].state.length - 1)
		var state = states[i].state.slice();
		state.splice(index);
		var stringState = pathToString(state);
		
		var cost = states[i].decisionState.cost + distancematrix_1[locations.indexOf(states[i].state[index-1])][locations.indexOf(states[i].state[index])].distance;
		var pos = currStringStates.indexOf(stringState);
		if(pos > -1) {
			if (currDecisions[pos].indexOf(states[i].state[index].id) == -1) {
				currDecisions[pos].push(states[i].state[index].id);
				currDecisionsState[pos].push({state: state, cost: cost, time: 0});	
			}
		} else {
			currStates.push(state);
			currStringStates.push(stringState);
			currDecisions.push([states[i].state[index].id]);
			currDecisionsState.push([{state: state, cost: cost, time: 0}]);
		}
	}
	
	var prevStates = [];
	for (var i = 0; i < currStates.length; i+= 1) {
		var bestDecisionIndex = null;
		for (var j = 0; j < currDecisions[i].length; j+= 1) {
			if (bestDecisionIndex == null) {
				if (isOnTime(currStates[i],currDecisions[i][j])) {
					bestDecisionIndex = j;
				}
			} else {
				if (currDecisionsState[i][bestDecisionIndex].cost > currDecisionsState[i][j].cost && isOnTime(currStates[i],currDecisions[i][j])) {
					bestDecisionIndex = j;
				}
			}

		}
		if (bestDecisionIndex != null) {
		
			console.log('state: ' + currStringStates[i] + ', decisions: ' + currDecisions[i] + ', costs: ' + currDecisionsState[i].map(function(e){return e.cost}) + ', best: ' + currDecisions[i][bestDecisionIndex] + '(' + currDecisionsState[i][bestDecisionIndex].cost + ')');
			
			prevStates.push({
				nextState: states.filter(function(e){return e.stringState == currStates[i].map(function(e){return e.id}).join(' -> ') + ' -> ' + currDecisions[i][bestDecisionIndex]})[0],
				state: currStates[i],
				stringState: currStringStates[i],
				decision: currDecisions[i][bestDecisionIndex],
				decisionState: currDecisionsState[i][bestDecisionIndex],
			});
		}
		else {
			console.log('state: ' + currStringStates[i] + ', decisions: ' + currDecisions[i] + ', costs: ' + currDecisionsState[i].map(function(e){return e.cost}) + ', best: none');		
		}
	}
	
	console.log('');
	
	return prevStates;
}

function isOnTime(state, decision) {
	var now = new Date().getTime();
	var time = 0;
	for (var i = 0; i < state.length - 1; i++) {
		time = time + distancematrix_1[locations.indexOf(state[i])][locations.indexOf(state[i+1])].duration;
	}
	time = time + distancematrix_1[locations.indexOf(state[state.length - 1])][locations.indexOf(getLocation(decision))].duration;
	
	if ((getLocation(decision).timeFrame.begin && getLocation(decision).timeFrame.begin > now + time)||(getLocation(decision).timeFrame.end && getLocation(decision).timeFrame.end < now + time)) {
		console.log("Decision " + decision + " is out of time frame!");

		return false
	}

	return true;
}

function pathToString(path) {
	var result = '';
	for (var i = 0; i < path.length; i+= 1) {
		result += path[i].id;
		if (i<path.length-1) {
			result += ' -> ';
		}
	}
	return result;
}


function permute(cities) {
	var permutations = [];
	function generate(n, arr) {
		if (n == 1) {
			var perm = arr.slice();
			perm.unshift(cities[0]);
			perm.push(cities[0]);
			
			permutations.push(perm);
			
			return;
		}
		for (var i = 0; i < n; i+= 1) {
			generate(n - 1, arr);
			if (n % 2 == 0) {
				swap(arr, i, n - 1);
			} else {
				swap(arr, 0, n - 1);
			}
		}
	}
	function swap(arr, idxA, idxB) {
		var tmp = arr[idxA];
		arr[idxA] = arr[idxB];
		arr[idxB] = tmp;
	}
	generate(cities.length-1, cities.slice(1));
	return permutations;
}



initMap();
