var number_of_elements;
var distancematrix_1;
var results_matrix;
var previous_city;
var timeCityMatrix;
var timeFrame;


function initTimeFrame()
{
	timeFrame = new Array(number_of_elements+1);
	//examples
	timeFrame[1]={begin:1463901662807,end:1493901662805};//City 1 indexes from 0
	timeFrame[2]={begin:1463901662807,end:1493901662805};
}

function initResultsMatrix() {
	results_matrix = new Array(number_of_elements);
	for (var i=0; i < number_of_elements; i++) {
		results_matrix[i] = new Array(Math.pow
		(2,number_of_elements+1));
	}
}
function initPrevCityMatrix() {
	previous_city = new Array(number_of_elements);
	for (var i=0; i < number_of_elements; i++) {
		previous_city[i] = new Array(Math.pow
		(2,number_of_elements+1));
	}	
}
function initTimeCityMatrix()
{
	timeCityMatrix = new Array(number_of_elements);
	for (var i=0; i < number_of_elements; i++) {
		timeCityMatrix[i] = new Array(Math.pow
		(2,number_of_elements+1));
	}	
}

function calculate_Way(destination_city, subset)
{
	if((subset==0)||(subset==1))
	{
		results_matrix[destination_city][0]=distancematrix_1[destination_city][0].distance 
		+ ifOnTime(destination_city,beginTime+distancematrix_1[destination_city][0].duration*1000);
		previous_city[destination_city][0]=0;
		timeCityMatrix[destination_city][0]=beginTime+distancematrix_1[destination_city][0].duration*1000;
		return distancematrix_1[destination_city][0].distance;
	}
	else
	{
		var possible_subsets = new Array(number_of_elements+1);
		var results_subsets = new Array(number_of_elements+1);
		possible_subsets[0]=0;
		for(var i=1;i<=number_of_elements;i++)
		{
			if( Math.floor( subset/Math.pow(2,i)) % 2 == 1)
			{
				possible_subsets[i]=1;
			}
			else
			{
				possible_subsets[i]=0;
			}
		}
		var minimum_city_index=0;
		var minimum_city_value=Number.MAX_VALUE;
		var minimum_city_time=0;
		for(var i=1;i<=number_of_elements;i++)
		{
			if(possible_subsets[i]==1)
			{
				//results_subsets[i]=distancematrix_1[destination_city][i]+calculate_Way(i, subset-Math.pow(2,i));
				results_subsets[i]=distancematrix_1[destination_city][i].distance+results_matrix[i][subset-Math.pow(2,i)]
				+ ifOnTime(destination_city,timeCityMatrix[i][subset-Math.pow(2,i)]+distancematrix_1[destination_city][0].duration*1000);
				if(minimum_city_value>results_subsets[i])
				{
					minimum_city_value=results_subsets[i];
					minimum_city_index=i;
					minimum_city_time=timeCityMatrix[i][subset-Math.pow(2,i)]+distancematrix_1[destination_city][i].duration*1000;
					//dodac droge
				}
			}
		}
		previous_city[destination_city][subset]=minimum_city_index;
		results_matrix[destination_city][subset]=minimum_city_value;
		timeCityMatrix[destination_city][subset]=minimum_city_time;
		return minimum_city_value;
	}
}
function calculate_init()
{
	initTimeFrame();
	initResultsMatrix();
	initPrevCityMatrix();
	initTimeCityMatrix();
	for(var init=0;init<number_of_elements-1;init++)
	{
		generate_subset(init);
	}
	//calculate_Way(0,Math.pow(2,number_of_elements)-2);
	
	//find_path(0,Math.pow(2,number_of_elements)-2, []);
	var tempResult = calculateWayNew(0,0,new Array( number_of_elements + 1),0,0,beginTime,0);
	drawPath(tempResult,[]);
}
//generowanie pokolei ktore zbiory ma liczyc odleglosci
function generate_subset(k) //k - number of elements in subset
{
	var temp_variable = Math.pow(2,number_of_elements)-1;
	while(temp_variable>=0)
	{
		if ( temp_variable % 2 == 0) 
		{
			var how_many_elements_in_subset=0;
			for(var i=1;i<=number_of_elements;i++)
			{
				if( Math.floor( temp_variable/Math.pow(2,i)) % 2 == 1 )
				{
					how_many_elements_in_subset++;
				}
			}
			if(how_many_elements_in_subset==k)
			{
				//for(j=1;j<=number_of_elements;j++)   //version 1
				for(var j=1;j<number_of_elements;j++)   //version2
				{
					//if(Math.floor( temp_variable/Math.pow(2,j)) % 2 == 1 ) //version 1
					if((Math.floor( temp_variable/Math.pow(2,j)) % 2 ) != 1 ) //version 2
					{
						//calculate_Way(j, temp_variable-Math.pow(2,j)); //version1
						calculate_Way(j, temp_variable); //version2
					}
				}
			}
		}
		temp_variable--;
	}
}

//find_path(0,Math.pow(2,number_of_elements)-2);
function find_path(destination_city,subset, route)
{
var dateString=new Date(timeCityMatrix[destination_city][subset]);
	console.log('from ' + previous_city[destination_city][subset] + ' to ' + destination_city + ' at ' + dateString);
	route.push(destination_city);
	
	if(subset>0)
	{
		find_path(previous_city[destination_city][subset], subset-Math.pow(2,previous_city[destination_city][subset]), route);
	}
	else
	{
		route.push(route[0]);
		route = route.map(function(id) {
			return locations[id];
		});
		drawRoute(route);
	}
}
function ifOnTime(destinationCity,timeCome)
{
console.log(destinationCity+' '+timeCome);
	if(timeFrame[destinationCity]!=null)
	{
		if(timeFrame[destinationCity].begin!=null)
		{
			if(timeFrame[destinationCity].begin>timeCome)
			{
				console.log('City '+destinationCity+' false');
				return 0;
			}
		}
		if(timeFrame[destinationCity].end!=null)
		{
			if(timeFrame[destinationCity].end<timeCome)
			{
				console.log('City '+destinationCity+' false');
				return 0;
			}
		}
		console.log('City '+destinationCity+' true');
		return 1;
	}
	else
	{
		console.log('City '+destinationCity+' true');
		return 1;
	}
}

//var a = calculateWayNew(0,0,new Array( number_of_elements + 1),0,0,beginTime,0)
function calculateWayNew(destinationCity, visitedCities, vectorVisitedCities, previousCity, step, timeCurrent,previousCost)
{
vectorVisitedCities[step]=destinationCity;
//info begin
//var debugInfo='debug: ';
//for (var i = 0; i<= step; i++)
//{
//if(i!=0){debugInfo+=' -> ';}
//debugInfo+=vectorVisitedCities[i];
//}
//debugInfo+=' step '+ step;
//console.log(debugInfo);
//info end
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
var debugInfo='debug: ';
for (var i = 0; i<= step; i++)
{
if(i!=0){debugInfo+=' -> ';}
debugInfo+=vectorVisitedCities[i];
}
debugInfo+=' step '+ step+' cost '+cost + ' prevcity '+previousCity+' destcity '+ destinationCity;
console.log(debugInfo);
//info end


		
		return {vectorOfVectorOfCities:resultsMatrix,vectorOfCosts:costMatrix,minOneOnTime:onTime};
	}
	else
	{
		var resultsMatrix ;
		var costMatrix ;
		if (( ifOnTime(destinationCity, timeCurrent + distancematrix_1[destinationCity][previousCity].duration ) ) || ( step == 0 ))
		{
			if( step == 0 )
			{
				//vectorVisitedCities[0]=	100;
			}
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
					
					//results[i] = calculateWayNew(i, visitedCities+Math.pow(2,i), vectorVisitedCitiesTemp, destinationCity, step+1, timeCurrent+distancematrix_1[i][destinationCity].duration*1000,previousCost+distancematrix_1[i][destinationCity].distance);
					results[i] = calculateWayNew(i, visitedCities+Math.pow(2,i), vectorVisitedCitiesTemp, destinationCity, step+1, timeCurrent+distancematrix_1[i][destinationCity].duration*1000,previousCost+distancematrix_1[destinationCity][i].distance);
					if(results[i]==null)
					{
						console.log('blad'+i+' '+destinationCity);
						console.log('zle '+i, visitedCities+Math.pow(2,i), vectorVisitedCitiesTemp, destinationCity, step+1, timeCurrent+distancematrix_1[i][destinationCity].duration*1000,previousCost+distancematrix_1[destinationCity][i].distance);
					}
					else
					{
						console.log('dobre '+i, visitedCities+Math.pow(2,i), vectorVisitedCitiesTemp, destinationCity, step+1, timeCurrent+distancematrix_1[i][destinationCity].duration*1000,previousCost+distancematrix_1[destinationCity][i].distance);
					}
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
			//resultsMatrix = vectorVisitedCities;
			if(minimumCostCityIndex==0)
			{
				return {vectorOfVectorOfCities:resultsMatrix,vectorOfCosts:costMatrix,minOneOnTime:0};
			}
			else
			{
				return results[minimumCostCityIndex];
			}
			
			/*
			
					var minimum_city_index=0;
		var minimum_city_value=Number.MAX_VALUE;
		var minimum_city_time=0;
		for(var i=1;i<=number_of_elements;i++)
		{
			if(possible_subsets[i]==1)
			{
				//results_subsets[i]=distancematrix_1[destination_city][i]+calculate_Way(i, subset-Math.pow(2,i));
				results_subsets[i]=distancematrix_1[destination_city][i].distance+results_matrix[i][subset-Math.pow(2,i)]
				+ ifOnTime(destination_city,timeCityMatrix[i][subset-Math.pow(2,i)]+distancematrix_1[destination_city][0].duration*1000);
				if(minimum_city_value>results_subsets[i])
				{
					minimum_city_value=results_subsets[i];
					minimum_city_index=i;
					minimum_city_time=timeCityMatrix[i][subset-Math.pow(2,i)]+distancematrix_1[destination_city][i].duration*1000;
					//dodac droge
				}
			}
		}
		previous_city[destination_city][subset]=minimum_city_index;
		results_matrix[destination_city][subset]=minimum_city_value;
		timeCityMatrix[destination_city][subset]=minimum_city_time;
			
			
			
			*/
			
			
			
			
			
			
			// ilosc mozliwosci
			// 
			// = new Array(number_of_elements);
			
			//
					
			//results matrix 
		 //not including city where we begin
			//var minOneOnTime = false ;
			//var minCostIndex = 0;
			//wybierz wszystkie mozliwosc 
			//minimalizuj je jesli sa na czas
			//results_matrix[0] = 5;
						
		
				
//			if( step == 0 )
//			{
//				
//			}
			//return {vectorOfVectorOfCities:resultsMatrix,vectorOfCosts:costMatrix,minOneOnTime:minOneOnTime};
				// true minOnTime co jesli 1 miasto  i co jesli sie wysypie na pierwszym
		}
		else
		{
			console.log('tutaj jestem');
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
			//if(typeof(calculateResults.vectorOfVectorOfCities[i])=="undefined")
			if(i>=number_of_elements)
			{
				var dateStringfrom = new Date( timeCurrent );
				timeCurrent=timeCurrent+distancematrix_1[0][i-1].duration*1000;
				var dateStringto = new Date( timeCurrent );
				console.log('from: '+calculateResults.vectorOfVectorOfCities[0][i-1]+' @ '+ dateStringfrom +' to 0 @ '+dateStringto);
				route.push(0);
				break;
			}
			if(i!=0)
			{
				var dateStringfrom = new Date( timeCurrent );
				timeCurrent=timeCurrent+distancematrix_1[i][i-1].duration*1000;
				var dateStringto = new Date( timeCurrent );
				console.log('from: '+calculateResults.vectorOfVectorOfCities[0][i-1]+' @ '+ dateStringfrom +' to '+calculateResults.vectorOfVectorOfCities[0][i]+' @ '+dateStringto);
				//drawRoute(route);
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
	}
}
