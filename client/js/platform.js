"use strict" // Here we go strict mode *w*

var grid = [];

function takeAndSplitCoords(value){
	let altered = value.replace(')',''); // remove the closing braces because we don't need em
	let pairs = altered.split('(').filter(function(w){ // split by opening braces we get an array of tuples straightaway
		return w.trim().length > 0
	});
	return pairs.map(function (pair){
		let components = pair.split(':').map(function(m){ return parseInt(m)});
		return { i: components[0], j: components[1] }
	})
}

function takeParameters(){
	// Take parameters as given from the users
	var gridsize = $('#param-size').val().split('x').map(function(token){ return parseInt(token)});
	var entrances = takeAndSplitCoords( $('#param-entrances').val() );
	var exits = takeAndSplitCoords( $('#param-exits').val() );
	var walls =  takeAndSplitCoords( $('#param-walls').val() );
	var cost = $('#param-cost').val() || '1+coord.j*2';

	// Encapsulate given parameters 
	var params = below.settings.create();
	params.size = { width: gridsize[0], height: gridsize[1] };
	params.entrances = entrances;
	params.exits = exits;
	params.walls = walls;
	params.costFunction = function(cell, coord){ return eval(cost) };

	return params;
}

function generate(onclick){
	// Take the grid paramters from the users
	let parameters = takeParameters();
	// Create a new grid
	grid = below.generate(parameters);

	// Render the grid 
	below.ui.render(grid,$('#grid-container'),[],true);

	// Bind the cell with onclick event (if supplied)
	if (typeof(onclick) != 'undefined'){
		$('.cell').each(function(i,cell){
			$(cell).click(function (evt){
				onclick(evt.target);
			})
		});
	}

	return grid;
}

function findRoute(onclick){
	let sourceAndDest = $('#param-route').val().split('->').map(function (s){
		let units = s.replace('(','').replace(')').split(':');
		return { i: parseInt(units[0]), j: parseInt(units[1]) }
	});
	console.log(sourceAndDest);
	let from = sourceAndDest[0];
	let to = sourceAndDest[1];
	var route = below.generateBestRoute(grid,from,to);

	// Render
	below.ui.render(grid, $('#grid-container'), route, true );

	// Bind the cell with onclick event (if supplied)
	if (typeof(onclick) != 'undefined'){
		$('.cell').each(function(i,cell){
			$(cell).click(function (evt){
				onclick(evt.target);
			})
		});
	}
}

function renderFromGrid(grid){
	if (typeof(grid)=='undefined' || grid==null)
		return false;

	// Clear old parameters
	$('#param-size').val('');
	$('#param-entrances').val('');
	$('#param-exits').val('');
	$('param-walls').val('');
	$('param-cost').val('');

	// Extract parameter from the given grid
	var size = below.array2d.size(grid);

	alert(size);
}



