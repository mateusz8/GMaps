var number_of_elements;
var distancematrix_1;
var XCollectionTable;
var XCollectionTable2;
var uOptimal;

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
try {
    console.clear();
}
catch(err) {

}
	XCollectionTable = new Array ( number_of_elements + 1) ;
	XCollectionTable2 = new Array ( number_of_elements + 1) ;
	generateInitialCollection(initialXCollection,0);
	XCollectionTable[0] = initialXCollection;
	calculateXCollectionsNew(XCollectionTable2[number_of_elements],number_of_elements);
	uOptimal = CalculateWayNewNew([0],0);
	drawPathNew([]);
	//showAllXCollections();
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
//function calculateXCollections(,step)



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
			if (check == true)
			{
				existsInCollection = true;
				var tempHandler;
				var nullHandler;
				if( givenElement.cost <= givenCollection[i].cost)
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
	var debugInfo='State: ';
	for (var i = 0; i <= givenX.vectorOfCities.length - 1; i++)
	{
		if(i!=0){debugInfo+=' -> ';}
		debugInfo+=givenX.vectorOfCities[i];
	}
	var dateString = new Date( givenX.vectorOfTime[givenX.vectorOfTime.length-1] );
	//debugInfo+=' time: '+ dateString +' cost: '+givenX.cost;
	debugInfo+=' cost: '+givenX.cost;
	//debugInfo+=' to visit: ';
	//var notVisitedCities = Math.pow(2,number_of_elements) - 2 - givenX.visitedCities;
	//for(var i=1 ; i <= number_of_elements ; i++ )
	//{
	//	if( Math.floor( notVisitedCities/Math.pow(2,i)) % 2 == 1)
	//	{
	//		debugInfo += i+' ';
	//	}
	//}
	debugInfo += ' decision: '+givenX.decision;
	if(givenX.rejected.length>0)
	{
			debugInfo+=' rejected cities: '
		for( var i = 0 ; i < givenX.rejected.length ; i++ )
		{
			if(i!=0)
			{
				debugInfo+=', ';
			}
			debugInfo+=givenX.rejected[i].decision;// +' cost: '+givenX.rejected[i].cost+ ' ';
		}	
	}

	console.log(debugInfo);
}

//function removeElementFromCollection()
//{
//}

function showAllXCollections()
{
	for ( var i = 0 ; i < number_of_elements ; i++ )
	{
	console.log(' ');
	showXCollection(XCollectionTable2[i]);
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



function calculateXCollectionsNew(xCollection,step)
{
	if(step >0 )
	{
		var debugInfo = 'V'+(number_of_elements-step+1)+'(x'+(step-1)+')';
	}
	console.log(debugInfo);
	var xppCollection = [];
	if( step >= 1)
	{
		for( var i = 0 ; i < xCollection.length ; i++ )
		{
			xppCollection = possibilitiesForSingleXNew(xppCollection,xCollection[i]);
		}
		XCollectionTable2[step-1] = xppCollection;
		showXCollection (XCollectionTable2[step-1]);
		calculateXCollectionsNew(xppCollection,step-1);
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
				xppCollection = addLastPath2( xppCollection,xCollection[i] );
			}
		XCollectionTable2[step+1] = xppCollection;
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
			if ( true )
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
				var newCost = 0;//X.cost + distancematrix_1[i][X.vectorOfCities[X.vectorOfCities.length-1]].distance ;
				var newVisitedCities = X.visitedCities + Math.pow(2,i) ;
				var rejected=[];
				var newX = 
				{
					vectorOfCities: newVectorOfCities ,
					visitedCities: newVisitedCities ,
					vectorOfTime: newVectorOfTime ,
					cost: newCost,
					ifOnTime: true,
					rejected: rejected
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





function possibilitiesForSingleXNew(generatedXppCollection,X)
{
	var notVisitedCities = Math.pow(2,number_of_elements) - 2 - X.visitedCities;
	var possibleNextCity = new Array(number_of_elements-1);
	var results = new Array(number_of_elements+1);
	possibleNextCity[0]=0;
	var minimumCostCityIndex=0;
	var minimumCost = Number.MAX_VALUE;
	
			if ( ifOnTime(X.vectorOfCities[X.vectorOfTime.length-2], X.vectorOfTime[X.vectorOfTime.length-2]))
			{
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
				var newVisitedCities = X.visitedCities;// + Math.pow(2,i) ;
				var rejected=[];
				var newX = 
				{
					vectorOfCities: newVectorOfCities ,
					visitedCities: newVisitedCities ,
					vectorOfTime: newVectorOfTime ,
					cost: newCost,
					decision:X.vectorOfCities[X.vectorOfTime.length-1],
					ifOnTime: true,
					rejected:rejected
				};
				generatedXppCollection = addElementToCollection (generatedXppCollection , newX);
			}
			else
			{
				/*var debugInfo='Not on time: State: ';
				for (var i = 0; i <= X.vectorOfCities.length - 1; i++)
				{
					if(i!=0){debugInfo+=' -> ';}
					debugInfo+=X.vectorOfCities[i];
				}
				debugInfo+=' decision: '+X.decision;
				console.log(debugInfo);*/
				;
			}

	return generatedXppCollection;
}

function addLastPath2(generatedXppCollection,X)
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
		var newCost = 0;//X.cost + distancematrix_1[0][X.vectorOfCities[X.vectorOfCities.length-1]].distance ;
		var newVisitedCities = X.visitedCities ;
		var decision;
		var newX = 
		{
			vectorOfCities: newVectorOfCities ,
			visitedCities: newVisitedCities ,
			vectorOfTime: newVectorOfTime ,
			cost: newCost,
			decision:decision,
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
function psi(X,step)
{
	var minCost = Number.MAX_VALUE;
	var minIndeks = -1 ;
	for( var i = 0 ; i < XCollectionTable2[step].length ; i++ )
	{
		var check = true ;
		for( var j = 0 ; j < step + 1;j++)
		{
			//console.log('i = '+i+' j= '+'if left= '+XCollectionTable2[step+1][i].vectorOfCities[j]+' if right '+X.vectorOfCities[j]);
			if(XCollectionTable2[step][i].vectorOfCities[j]!=X.vectorOfCities[j])
			{
				check = false;
				break;
			}
		}
		if (check == true)
		{
			if( minCost > XCollectionTable2[step][i].cost)
			{
				minCost = XCollectionTable2[step][i].cost;
				minIndeks = i;
			}
		}
	}
	if(minCost < Number.MAX_VALUE)
	{
		var result = {
			decision: XCollectionTable2[step][minIndeks].decision,
			//decision: minIndeks;
			x:XCollectionTable2[step][minIndeks]
		}
		return result;
	}
	else
	{
		return minIndeks;
	}
}
function psi2(U,step)
{
	var minCost = Number.MAX_VALUE;
	var minIndeks = -1 ;
	for( var i = 0 ; i < XCollectionTable2[step].length ; i++ )
	{
		var check = true ;
		for( var j = 0 ; j < step + 1;j++)
		{
			if(XCollectionTable2[step][i].vectorOfCities[j]!=U[j])
			{
				check = false;
				break;
			}
		}
		if (check == true)
		{
			if( minCost > XCollectionTable2[step][i].cost)
			{
				minCost = XCollectionTable2[step][i].cost;
				minIndeks = i;
			}
		}
	}
	if(minCost < Number.MAX_VALUE)
	{
		return XCollectionTable2[step][minIndeks].decision;
	}
	else
	{
		var temp;
		return temp;
	}
}
function CalculateWayNewNew(uVector,step)
{
	if(step < number_of_elements )
	{
		var uVectorNew = new Array ( uVector.length + 1 );
		for (var j = 0 ; j < uVector.length ; j++)
		{
			uVectorNew[j]=uVector[j];
		}
		uVectorNew[uVectorNew.length-1] = psi2(uVector,step);
		ShowUVector(uVectorNew);
		return CalculateWayNewNew(uVectorNew,step+1);
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
function drawPathNew(route)
{
	//if((typeof uOptimal[0] !== undefined )&&(uOptimal[0]!="undefined")&&(typeof uOptimal[0] >=0 ))
	if(!isNaN(uOptimal[0]))
	{
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
			route.push(patchVector[i]);
			var dateString = new Date( timeCurrent );
			console.log('City: '+patchVector[i]+' '+locations[patchVector[i]].name+' @ '+ dateString); 
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
function ShowUVector(uVector)
{
	if(!isNaN(uVector[0]))
	{
		var toPrint = 'u = ';
		for (var j = 1 ; j < uVector.length ; j++)
			{
				if(j!=1)
				{
					toPrint+= ' -> ';
				}
				toPrint+= uVector[j];
			}
		console.log(toPrint);
	}
}
