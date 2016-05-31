var number_of_elements;
var distancematrix_1;
var XCollectionTable;


var initialVectorOfVisitedCities = new Array(1);
initialVectorOfVisitedCities [0] = 0 ; 
var initialVectorOfTime = new Array(1);
initialVectorOfTime[0] = beginTime;
var initialVisitedCities = 0 ;
var initialCost = 0 ;
var initialX = 
{
	vectorOfCities: initialVectorOfVisitedCities ,
	visitedCities: initialVisitedCities ,
	vectorOfTime: initialVectorOfTime ,
	cost: initialCost,
	ifOnTime: true
}
var initialXCollection = new Array (1);
initialXCollection [0] = initialX; 

function calculate_init()
{
	XCollectionTable = new Array ( number_of_elements + 1) ;
	calculateWay(initialXCollection,0);
	drawPath([]);
	XCollectionTable[0] = initialXCollection;
	showAllXCollections();
}
function ifOnTime(destinationCity,timeCome)
{
	//console.log(destinationCity+' '+timeCome);
	if((locations[destinationCity].timeFrame.begin !=0 )&&(locations[destinationCity].timeFrame.begin>timeCome))
	{
		//console.log('City '+destinationCity+' false');
		return 0;
	}
	if((locations[destinationCity].timeFrame.end!=0)&&(locations[destinationCity].timeFrame.end<timeCome))
	{
		//console.log('City '+destinationCity+' false');
		return 0;
	}
	//console.log('City '+destinationCity+' true');
	return 1;
}
function calculateWay(xCollection,step)
{
	//xCollection - wektor możliwych stanów w kroku step
	var xppCollection = [];
	if( step < number_of_elements -1)
	{
		for( var i = 0 ; i < xCollection.length ; i++ )
		{
			xppCollection = possibilitiesForSingleX(xppCollection,xCollection[i]);
		}
		calculateWay(xppCollection,step+1);
	}
	else
	{
		for( var i = 0 ; i < xCollection.length ; i++ )
			{
				xppCollection = addLastPath( xppCollection,xCollection[i] );
			}
	}
	XCollectionTable[step+1] = xppCollection;
}
function possibilitiesForSingleX(generatedXppCollection,X)
{
	var notVisitedCities = Math.pow(2,number_of_elements) - 2 - X.visitedCities;
	var possibleNextCity = new Array(number_of_elements+1);
	var results = new Array(number_of_elements+1);
	possibleNextCity[0]=0;
	var minimumCostCityIndex=0;
	var minimumCost = Number.MAX_VALUE;
	// możliwe decyzje w stanie x -> u = fi(x)
	for(var i=1 ; i <= number_of_elements ; i++ )
	{
		if( Math.floor( notVisitedCities/Math.pow(2,i)) % 2 == 1)
		{
			if ( ifOnTime(i, X.vectorOfTime[X.vectorOfTime.length-1] + distancematrix_1[i][X.vectorOfCities[X.vectorOfCities.length-1]].duration*1000 ) )
			{
				var newVectorOfCities = new Array ( X.vectorOfCities.length + 1 );
				for (var j = 0 ; j < X.vectorOfCities.length ; j++)
				{
					newVectorOfCities[j]=X.vectorOfCities[j];
				}
				newVectorOfCities[newVectorOfCities.length-1] = i ;
				var newVectorOfTime = new Array ( X.vectorOfTime.length + 1 );
				for (var j = 0 ; j < X.vectorOfTime.length ; j++)
				{
					newVectorOfTime[j] = X.vectorOfTime[j];
				}
				newVectorOfTime[newVectorOfTime.length-1] = X.vectorOfTime[X.vectorOfTime.length-1] + distancematrix_1[i][X.vectorOfCities[X.vectorOfCities.length-1]].duration*1000 ;
				var newCost = X.cost + distancematrix_1[i][X.vectorOfCities[X.vectorOfCities.length-1]].distance ;
				var newVisitedCities = X.visitedCities + Math.pow(2,i) ;
				// stan x
				var newX = 
				{
					vectorOfCities: newVectorOfCities ,
					visitedCities: newVisitedCities ,
					vectorOfTime: newVectorOfTime ,
					cost: newCost,
					ifOnTime: true
				};
				generatedXppCollection = addElementToCollection (generatedXppCollection , newX);
			}
			else
			{
				//console.log('Not on time');
			}
		}
	}
	return generatedXppCollection;
}
function addElementToCollection(givenCollection,givenElement)
{
	var newCollection = new Array(givenCollection.length+1);
	for (var j = 0 ; j < givenCollection.length ; j++)
	{
		newCollection[j]=givenCollection[j];
	}
	//optional delete givencollection
	newCollection[newCollection.length-1]=givenElement;
	return newCollection;
}
function showXCollection ( givenCollection )
{
	if(typeof givenCollection !== undefined )
	{
		for (var j = 0 ; j < givenCollection.length ; j++)
		{
			showX(givenCollection[j]);
		}
	}
	else
	{
		console.log('Empty.');
	}
}
function showX (givenX)
{
	var debugInfo='Way: ';
	for (var i = 0; i <= givenX.vectorOfCities.length - 1; i++)
	{
		if(i!=0){debugInfo+=' -> ';}
		debugInfo+=givenX.vectorOfCities[i];
	}
	var dateString = new Date( givenX.vectorOfTime[givenX.vectorOfTime.length-1] );
	debugInfo+=' time: '+ dateString +' cost: '+givenX.cost;
	debugInfo+=' to visit: ';
	var notVisitedCities = Math.pow(2,number_of_elements) - 2 - givenX.visitedCities;
	for(var i=1 ; i <= number_of_elements ; i++ )
	{
		if( Math.floor( notVisitedCities/Math.pow(2,i)) % 2 == 1)
		{
			debugInfo += i+' ';
		}
	}
	console.log(debugInfo);
}

//function removeElementFromCollection()
//{
//}

function addLastPath(generatedXppCollection,X)
{
	if ( ifOnTime(0, X.vectorOfTime[X.vectorOfTime.length-1] + distancematrix_1[0][X.vectorOfCities[X.vectorOfCities.length-1]].duration*1000 ) )
	{
		var newVectorOfCities = new Array ( X.vectorOfCities.length + 1 );
		for (var j = 0 ; j < X.vectorOfCities.length ; j++)
		{
			newVectorOfCities[j]=X.vectorOfCities[j];
		}
		newVectorOfCities[newVectorOfCities.length-1] = 0 ;
		var newVectorOfTime = new Array ( X.vectorOfTime.length + 1 );
		for (var j = 0 ; j < X.vectorOfTime.length ; j++)
		{
			newVectorOfTime[j] = X.vectorOfTime[j];
		}
		newVectorOfTime[newVectorOfTime.length-1] = X.vectorOfTime[X.vectorOfTime.length-1] + distancematrix_1[0][X.vectorOfCities[X.vectorOfCities.length-1]].duration*1000 ;
		var newCost = X.cost + distancematrix_1[0][X.vectorOfCities[X.vectorOfCities.length-1]].distance ;
		var newVisitedCities = X.visitedCities ;
		var newX = 
		{
			vectorOfCities: newVectorOfCities ,
			visitedCities: newVisitedCities ,
			vectorOfTime: newVectorOfTime ,
			cost: newCost,
			ifOnTime: true
		};
				generatedXppCollection = addElementToCollection (generatedXppCollection , newX);
			}
			else
			{
//				console.log('Not on time');
			}
	return generatedXppCollection;
}
function showAllXCollections()
{
	for ( var i = 0 ; i <= number_of_elements ; i++ )
	{
	console.log(' ');
	showXCollection(XCollectionTable[i]);
	}
}
function resultX ( givenCollection )
{
	var resultXX;
	if(typeof givenCollection !== undefined )
	{
		var minimumCostPathIndex=0;
		var minimumCost = Number.MAX_VALUE;
		for (var j = 0 ; j < givenCollection.length ; j++)
		{
			if( givenCollection[j].cost < minimumCost )
			{
				minimumCost = givenCollection[j].cost;
				minumumCostPathIndex = j;
			}
		}
		resultXX = givenCollection[minumumCostPathIndex];
	}
	else
	{
		console.log('Empty.');
	}
	return resultXX;
}
function drawPath(route)
{
	var resultOfCalculation = resultX ( XCollectionTable[number_of_elements] );
	if(resultOfCalculation != undefined)
	{
		var i = 0;
		var timeCurrent = beginTime;
		for ( var i = 0 ; i <= number_of_elements ; i++ )
		{
			route.push(resultOfCalculation.vectorOfCities[i]);
			var dateString = new Date( resultOfCalculation.vectorOfTime[i] );
			console.log('City: '+resultOfCalculation.vectorOfCities[i]+' '+locations[resultOfCalculation.vectorOfCities[i]].name+' @ '+ dateString); 
		}
		route = route.map(function(id) {
			return locations[id];
		});
		drawRoute(route);
	}
	else
	{
		console.log('It is not possible.');
		alert('It is not possible.');
	}
}
