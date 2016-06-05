var number_of_elements;
var distancematrix_1;
var XCollectionTable;
var uOptimal;

var initialVectorOfVisitedCities = new Array(1);
initialVectorOfVisitedCities [0] = 0 ; 
var initialVectorOfTime = new Array(1);
initialVectorOfTime[0] = beginTime;
var initialVisitedCities = 0 ;
var initialCost = 0 ;
var initialX = 
{
	vectorOfCities: initialVectorOfVisitedCities,
	visitedCities: initialVisitedCities,
	vectorOfTime: initialVectorOfTime,
	cost: initialCost,
	ifOnTime: true
}
var initialXCollection = new Array (1);
initialXCollection [0] = initialX; 

function calculate_init()
{
	try {
		console.clear();
	}
	catch(err) {}

	XCollectionTable = new Array ( number_of_elements + 1) ;
	generateInitialCollection(initialXCollection,0);
	calculateXCollections(XCollectionTable[number_of_elements],number_of_elements);
	uOptimal = calculateWay([0],0);
	drawPath();
}
function ifOnTime(destinationCity,timeCome)
{
	
	if((locations[destinationCity].timeFrame.begin !=0 )&&(locations[destinationCity].timeFrame.begin>timeCome))
	{
		return false;
	}
	if((locations[destinationCity].timeFrame.end!=0)&&(locations[destinationCity].timeFrame.end<timeCome))
	{
		return false;
	}
	return true;
}

function addElementToCollection(givenCollection,givenElement)
{
	
	var existsInCollection = false;
	if(typeof givenCollection !== undefined )
	{
		for (var i = 0 ; i < givenCollection.length ; i++)
		{
			var check = true ;
			for( var j = 0 ; j < givenCollection[i].vectorOfCities.length;j++)
			{
				if(givenCollection[i].vectorOfCities[j]!=givenElement.vectorOfCities[j])
				{
					check = false;
					break;
				}
			}
			if (check)
			{
				existsInCollection = true;
				var tempHandler;
				var nullHandler;

				if( givenElement.ifOnTime && givenElement.cost < givenCollection[i].cost)
				{
					tempHandler = givenCollection[i];
					givenCollection[i] = givenElement;
					givenCollection[i].rejected = tempHandler.rejected;
					tempHandler.rejected = nullHandler;
				}
				else
				{
					tempHandler=givenElement;
				}
				
				var newRejected = new Array ( givenCollection[i].rejected.length + 1 );
					for (var k = 0 ; k < newRejected.length -1 ; k++)
					{
						newRejected[k]=givenCollection[i].rejected[k];
					}
					newRejected[ newRejected.length -1 ] = tempHandler;
				givenCollection[i].rejected = newRejected;
			}
		}
	}

	if(existsInCollection == false)
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
	else
	{
		return givenCollection;
	}
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
	var debugInfo='state: ';
	for (var i = 0; i <= givenX.vectorOfCities.length - 1; i++)
	{
		if(i!=0){debugInfo+=' -> ';}
		debugInfo+=givenX.vectorOfCities[i];
	}

	var decisions = [];
	var costs = [];
	
	decisions.push(givenX.decision);
	costs.push(givenX.cost);
	
	if(!givenX.ifOnTime) {
		console.log('Decision '+givenX.decision+' is out of time frame!');
	}
	
	if(givenX.rejected.length>0)
	{
		for( var i = 0 ; i < givenX.rejected.length ; i++ )
		{
			if(!givenX.rejected[i].ifOnTime) {
				console.log('Decision '+givenX.rejected[i].decision+' is out of time frame!');
			}
			
			decisions.push(givenX.rejected[i].decision);
			costs.push(givenX.rejected[i].cost);
		}	
	}

	debugInfo+=', decisions: ' + decisions + ', costs: ' + costs + ', best: ' + (givenX.ifOnTime ? givenX.decision+'(' + givenX.cost + ')' : 'none');
	
	console.log(debugInfo);
}

function showAllXCollections()
{
	for ( var i = 0 ; i < number_of_elements ; i++ )
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

function calculateXCollections(xCollection,step)
{
	if(step >0 )
	{
		console.log('V'+(number_of_elements-step+1)+'(x'+(step-1)+')');
	}

	var xppCollection = [];
	if( step >= 1)
	{
		for( var i = 0 ; i < xCollection.length ; i++ )
		{
			if (xCollection[i].ifOnTime) {
				xppCollection = possibilitiesForSingleXNew(xppCollection,xCollection[i]);
			}
		}
		XCollectionTable[step-1] = xppCollection;
		showXCollection (XCollectionTable[step-1]);
		calculateXCollections(xppCollection,step-1);
	}
	
}

function generateInitialCollection(xCollection,step)
{
	var xppCollection = [];
	if( step < number_of_elements -1)
	{
		for( var i = 0 ; i < xCollection.length ; i++ )
		{
			xppCollection = possibilitiesForSingleXInit(xppCollection,xCollection[i]);
		}
		generateInitialCollection(xppCollection,step+1);
	}
	else
	{
		for( var i = 0 ; i < xCollection.length ; i++ )
			{
				xppCollection = addLastPath( xppCollection,xCollection[i] );
			}
		XCollectionTable[step+1] = xppCollection;
	}
}
function possibilitiesForSingleXInit(generatedXppCollection,X)
{
	
	var notVisitedCities = Math.pow(2,number_of_elements) - 2 - X.visitedCities;
	var possibleNextCity = new Array(number_of_elements+1);
	var results = new Array(number_of_elements+1);
	possibleNextCity[0]=0;
	var minimumCostCityIndex=0;
	var minimumCost = Number.MAX_VALUE;
	for(var i=1 ; i <= number_of_elements ; i++ )
	{
		if( Math.floor( notVisitedCities/Math.pow(2,i)) % 2 == 1)
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
				var newVisitedCities = X.visitedCities + Math.pow(2,i) ;
				var newX = 
				{
					vectorOfCities: newVectorOfCities ,
					visitedCities: newVisitedCities ,
					vectorOfTime: newVectorOfTime ,
					cost: 0,
					ifOnTime: true,
					rejected: []
				};
				generatedXppCollection = addElementToCollection (generatedXppCollection , newX);
		}
	}
	return generatedXppCollection;
}

function possibilitiesForSingleXNew(generatedXppCollection,X)
{
	
	var notVisitedCities = Math.pow(2,number_of_elements) - 2 - X.visitedCities;
	var possibleNextCity = new Array(number_of_elements-1);
	var results = new Array(number_of_elements+1);
	possibleNextCity[0]=0;
	var minimumCostCityIndex=0;
	var minimumCost = Number.MAX_VALUE;
	
				var newVectorOfCities = new Array ( X.vectorOfCities.length - 1 );
				for (var j = 0 ; j < X.vectorOfCities.length -1 ; j++)
				{
					newVectorOfCities[j]=X.vectorOfCities[j];
				}
				var newVectorOfTime = new Array ( X.vectorOfTime.length - 1 );
				for (var j = 0 ; j < X.vectorOfTime.length - 1 ; j++)
				{
					newVectorOfTime[j] = X.vectorOfTime[j];
				}
				var newCost = X.cost + distancematrix_1[X.vectorOfCities[X.vectorOfCities.length-2]][X.vectorOfCities[X.vectorOfCities.length-1]].distance ;
				var newVisitedCities = X.visitedCities;
				
				var newX = 
				{
					vectorOfCities: newVectorOfCities ,
					visitedCities: newVisitedCities ,
					vectorOfTime: newVectorOfTime ,
					cost: newCost,
					decision:X.vectorOfCities[X.vectorOfTime.length-1],
					ifOnTime: ifOnTime(X.vectorOfCities[X.vectorOfTime.length-1], X.vectorOfTime[X.vectorOfTime.length-1]),
					rejected:[]
				};
				generatedXppCollection = addElementToCollection (generatedXppCollection , newX);

	return generatedXppCollection;
}

function addLastPath(generatedXppCollection,X)
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
		var newVisitedCities = X.visitedCities ;
		var newX = 
		{
			vectorOfCities: newVectorOfCities ,
			visitedCities: newVisitedCities ,
			vectorOfTime: newVectorOfTime ,
			cost: 0,
			decision: undefined,
			ifOnTime: ifOnTime(0, X.vectorOfTime[X.vectorOfTime.length-1] + distancematrix_1[0][X.vectorOfCities[X.vectorOfCities.length-1]].duration*1000 )
		};
				generatedXppCollection = addElementToCollection (generatedXppCollection , newX);

	return generatedXppCollection;
}
function psi(U,step)
{
	var minCost = Number.MAX_VALUE;
	var minIndeks = -1 ;
	for( var i = 0 ; i < XCollectionTable[step].length ; i++ )
	{
		var check = true ;
		for( var j = 0 ; j < step + 1;j++)
		{
			if(XCollectionTable[step][i].vectorOfCities[j]!=U[j])
			{
				check = false;
				break;
			}
		}
		if (check == true)
		{
			if( minCost > XCollectionTable[step][i].cost)
			{
				minCost = XCollectionTable[step][i].cost;
				minIndeks = i;
			}
		}
	}
	if(minCost < Number.MAX_VALUE)
	{
		return XCollectionTable[step][minIndeks].decision;
	}
	else
	{
		return undefined;
	}
}
function calculateWay(uVector,step)
{
	if(step < number_of_elements )
	{
		var uVectorNew = new Array ( uVector.length + 1 );
		for (var j = 0 ; j < uVector.length ; j++)
		{
			uVectorNew[j]=uVector[j];
		}
		uVectorNew[uVectorNew.length-1] = psi(uVector,step);
		return calculateWay(uVectorNew,step+1);
	}
	else
	{
		var uVectorNew = new Array ( uVector.length -1 );
		for (var j = 0 ; j < uVectorNew.length ; j++)
		{
			uVectorNew[j]=uVector[j+1];
		}
		return uVectorNew;
	}
}
function drawPath()
{
	var route = [];
	
	if(!isNaN(uOptimal[0]) && XCollectionTable[0][0].ifOnTime)
	{
		var now = new Date();
		console.log('Choose path: ');
		
		var patchVector = new Array ( uOptimal.length + 1 );
		for (var j = 0 ; j < uOptimal.length ; j++)
		{
			patchVector[j+1]=uOptimal[j];
		}
		patchVector[0] = 0;
		var timeCurrent = beginTime;
		for ( var i = 0 ; i <= number_of_elements ; i++ )
		{
			if (i!=0)
			{
				timeCurrent += distancematrix_1[patchVector[i]][patchVector[i-1]].duration*1000;
			}
			
			if (i==0) {
				console.log('state: ' + locations[patchVector[i]].name + '(' + locations[patchVector[i]].id + '), starting: ' + formatDate(now));
			} else {
				console.log('state: ' + route.map(function(id) {return locations[id].id;}).join(' -> ') + ', desision: ' + locations[patchVector[i]].name + '(' + locations[patchVector[i]].id + '), incoming: '+formatDate(new Date( timeCurrent )));
			}

			route.push(patchVector[i]);
		}
		route = route.map(function(id) {
			return locations[id];
		});
		console.log('path: ' + route.map(function(loc) {return loc.id;}).join(' -> ') + ', cost: ' + XCollectionTable[0][0].cost);

		drawRoute(route);
	}
	else
	{
		console.log('Nie znaleziono drogi spełniającej oczekiwania.');
		alert('Nie znaleziono drogi spełniającej oczekiwania.');
	}
}

function formatDate(date) {
	return date.getDate() + '/' + (date.getMonth()+1) + '/' +date.getFullYear()  + ' ' + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes()
}
