var number_of_elements;
var distancematrix_1;


function calculate_init()
{
	var tempResult = calculateWayNew(0,0,new Array( number_of_elements + 1),0,0,beginTime,0);
	drawPath(tempResult,[]);
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

//var a = calculateWayNew(0,0,new Array( number_of_elements + 1),0,0,beginTime,0)
function calculateWayNew(destinationCity, visitedCities, vectorVisitedCities, previousCity, step, timeCurrent,previousCost)
{
	vectorVisitedCities[step]=destinationCity;
	if(visitedCities==(Math.pow(2,number_of_elements)-2))
	//if(step==number_of_elements-2)
	{
		var costMatrix;
		var resultsMatrix;
		//cost = distancematrix_1[0][destinationCity].distance+previousCost;
		cost = distancematrix_1[destinationCity][0].distance+previousCost;
		var onTime = ifOnTime(0,timeCurrent + distancematrix_1[0][destinationCity].duration );
		if (onTime) 
			{
				costMatrix = cost;//new Array( 1 );
				//costMatrix[ 0 ] = cost ;
				resultsMatrix = new Array( 1 );
				resultsMatrix[ 0 ] = vectorVisitedCities ;
			}
			
		//info begin
//var debugInfo='debug: ';
//for (var i = 0; i<= step; i++)
//{
//if(i!=0){debugInfo+=' -> ';}
//debugInfo+=vectorVisitedCities[i];
//}
//debugInfo+=' step '+ step+' cost '+cost + ' prevcity '+previousCity+' destcity '+ destinationCity;
//console.log(debugInfo);
//info end


		return {vectorOfVectorOfCities:resultsMatrix,vectorOfCosts:costMatrix,minOneOnTime:onTime};
	}
	else
	{
		var resultsMatrix ;
		var costMatrix ;
		if (( ifOnTime(destinationCity, timeCurrent + distancematrix_1[destinationCity][previousCity].duration ) ) || ( step == 0 ))
		{
			var minOneOnTime = 0 ;
			var notVisitedCities = Math.pow(2,number_of_elements) - 2 - visitedCities;
			var possibleNextCity = new Array(number_of_elements+1);
			var results = new Array(number_of_elements+1);
			possibleNextCity[0]=0;
			var minimumCostCityIndex=0;
			var minimumCost = Number.MAX_VALUE;
			for(var i=1;i<=number_of_elements;i++)
			{
				if( Math.floor( notVisitedCities/Math.pow(2,i)) % 2 == 1)
				{
					possibleNextCity[i]=1;
					var vectorVisitedCitiesTemp = new  Array(number_of_elements+1);
					for (var j = 0 ; j < number_of_elements ; j++)
					{
						vectorVisitedCitiesTemp[j]=vectorVisitedCities[j];
					}
					results[i] = calculateWayNew(i, visitedCities+Math.pow(2,i), vectorVisitedCitiesTemp, destinationCity, step+1, timeCurrent+distancematrix_1[i][destinationCity].duration*1000,previousCost+distancematrix_1[destinationCity][i].distance);
//					if(results[i]==null)
//					{
//						console.log('blad'+i+' '+destinationCity);
//						console.log('zle '+i, visitedCities+Math.pow(2,i), vectorVisitedCitiesTemp, destinationCity, step+1, timeCurrent+distancematrix_1[i][destinationCity].duration*1000,previousCost+distancematrix_1[destinationCity][i].distance);
//					}
//					else
//					{
//						console.log('dobre '+i, visitedCities+Math.pow(2,i), vectorVisitedCitiesTemp, destinationCity, step+1, timeCurrent+distancematrix_1[i][destinationCity].duration*1000,previousCost+distancematrix_1[destinationCity][i].distance);
//					}
					if(results[i].minOneOnTime==1)
					{
						minOneOnTime = 1;
						if(results[i].vectorOfCosts<minimumCost)
						{
							minimumCostCityIndex=i;
							minimumCost=results[i].vectorOfCosts;
						}
					}
				}
				else
				{
					possibleNextCity[i]=0;
				}
			}
			if(minimumCostCityIndex==0)
			{
				return {vectorOfVectorOfCities:resultsMatrix,vectorOfCosts:costMatrix,minOneOnTime:0};
			}
			else
			{
				return results[minimumCostCityIndex];
			}
		}
		else
		{
			return {vectorOfVectorOfCities:resultsMatrix,vectorOfCosts:costMatrix,minOneOnTime:0};
		}
	}
}

function drawPath(calculateResults, route)
{
	if(calculateResults.minOneOnTime==1)
	{
		var i = 0;
		var timeCurrent = beginTime;
		while (true)
		{
			if(i>=number_of_elements)
			{
				var dateStringfrom = new Date( timeCurrent );
				timeCurrent=timeCurrent+distancematrix_1[0][calculateResults.vectorOfVectorOfCities[0][i-1]].duration*1000;
				var dateStringto = new Date( timeCurrent );
				console.log('from: '+calculateResults.vectorOfVectorOfCities[0][i-1]+' '+locations[calculateResults.vectorOfVectorOfCities[0][i-1]].name+' @ '+ dateStringfrom +' to 0 '+locations[calculateResults.vectorOfVectorOfCities[0][0]].name+'@ '+dateStringto);
				route.push(0);
				break;
			}
			if(i!=0)
			{
				var dateStringfrom = new Date( timeCurrent );
				timeCurrent=timeCurrent+distancematrix_1[calculateResults.vectorOfVectorOfCities[0][i]][calculateResults.vectorOfVectorOfCities[0][i-1]].duration*1000;
				var dateStringto = new Date( timeCurrent );
				console.log('from: '+calculateResults.vectorOfVectorOfCities[0][i-1]+' '+locations[calculateResults.vectorOfVectorOfCities[0][i-1]].name+' @ '+ dateStringfrom +' to '+calculateResults.vectorOfVectorOfCities[0][i]+' '+locations[calculateResults.vectorOfVectorOfCities[0][i]].name+' @ '+dateStringto);
			}
			route.push(calculateResults.vectorOfVectorOfCities[0][i]);
			i++;
		}
		route = route.map(function(id) {
			return locations[id];
		});
		drawRoute(route);
		
	}
	else
	{
		console.log('No possible results.');
		alert('No possible results.');
	}
}
