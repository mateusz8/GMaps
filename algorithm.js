var number_of_elements;
var distancematrix_1;
var results_matrix
var previous_city


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

function calculate_Way(destination_city, subset)
{
	if((subset==0)||(subset==1))
	{
		results_matrix[destination_city][0]=distancematrix_1[destination_city][0].distance;
		previous_city[destination_city][0]=0;
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
		for(var i=1;i<=number_of_elements;i++)
		{
			if(possible_subsets[i]==1)
			{
				//results_subsets[i]=distancematrix_1[destination_city][i]+calculate_Way(i, subset-Math.pow(2,i));
				results_subsets[i]=distancematrix_1[destination_city][i].distance+results_matrix[i][subset-Math.pow(2,i)];
				if(minimum_city_value>results_subsets[i])
				{
					minimum_city_value=results_subsets[i];
					minimum_city_index=i;
					//dodac droge
				}
			}
		}
		previous_city[destination_city][subset]=minimum_city_index;
		results_matrix[destination_city][subset]=minimum_city_value;
		return minimum_city_value;
	}
}
function calculate_init()
{
	initResultsMatrix();
	initPrevCityMatrix();
	for(var init=0;init<number_of_elements-1;init++)
	{
		generate_subset(init);
	}
	calculate_Way(0,Math.pow(2,number_of_elements)-2);
	
	find_path(0,Math.pow(2,number_of_elements)-2, []);
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
	//console.log('from ' + previous_city[destination_city][subset] + ' to ' + destination_city);
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
