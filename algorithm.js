var number_of_elements=5;
//var discancematrix_1=[][];

var discancematrix_1 = new Array(number_of_elements);
for (var i=0; i < number_of_elements; i++) {
   discancematrix_1[i] = new Array(number_of_elements);
}



discancematrix_1[0][0]=0;
discancematrix_1[0][1]=1;
discancematrix_1[0][2]=2;
discancematrix_1[0][3]=3;
discancematrix_1[0][4]=4;
discancematrix_1[1][0]=1;
discancematrix_1[1][1]=0;
discancematrix_1[1][2]=3;
discancematrix_1[1][3]=2;
discancematrix_1[1][4]=2;
discancematrix_1[2][0]=4;
discancematrix_1[2][1]=4;
discancematrix_1[2][2]=0;
discancematrix_1[2][3]=3;
discancematrix_1[2][4]=5;
discancematrix_1[3][0]=5;
discancematrix_1[3][1]=5;
discancematrix_1[3][2]=3;
discancematrix_1[3][3]=0;
discancematrix_1[3][4]=3;
discancematrix_1[4][0]=4;
discancematrix_1[4][1]=2;
discancematrix_1[4][2]=1;
discancematrix_1[4][3]=12;
discancematrix_1[4][4]=0;

var results_matrix = new Array(number_of_elements);
for (var i=0; i < number_of_elements; i++) {
   results_matrix[i] = new Array(Math.pow
	 (2,number_of_elements+1));
}
var previous_city = new Array(number_of_elements);
for (var i=0; i < number_of_elements; i++) {
   previous_city[i] = new Array(Math.pow
	 (2,number_of_elements+1));
}
var previous_city2 = new Array(number_of_elements+1);

function calculate_Way(destination_city, subset)
{
	if((subset==0)||(subset==1))
	{
		results_matrix[destination_city][0]=discancematrix_1[destination_city][0];
		previous_city[destination_city][0]=0;
		return discancematrix_1[destination_city][0];
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
		var minimum_city_value=1000000000;
		for(var i=1;i<=number_of_elements;i++)
		{
			if(possible_subsets[i]==1)
			{
				//results_subsets[i]=discancematrix_1[destination_city][i]+calculate_Way(i, subset-Math.pow(2,i));
				results_subsets[i]=discancematrix_1[destination_city][i]+results_matrix[i][subset-Math.pow(2,i)];
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
		previous_city2=possible_subsets;
	}
}
function calculate_init()
{
	for(var init=0;init<number_of_elements-1;init++)
	{
		generate_subset(init);
	}
	//calculate_Way(0,Math.pow(2,number_of_elements)-1);
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

function find_patch(destination_city,subset)
{
	if(subset>0)
	{
		find_patch(previous_city[destination_city][subset],subset-Math.pow(2,previous_city[destination_city][subset]));
	}
		var temp = 'from' + previous_city[destination_city][subset] + ' to ' + destination_city;
		console.log(temp)
}