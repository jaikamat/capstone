app.factory('EvalFactory', function ($http, ParametersFactory, MapFactory, ScrollFactory) {
	//These cached objects are used to reset the game so another http request is not required.
	var mapCache, scrollCache, paramsCache;

	var MAX_STEPS = 50;

	return {
		map: null,
		nodeCoords: null,
		bezierData: null,
		scroll: null,
		scrollCoords: null,
		scrollBezierData: null,
		params: null,
		stepCounter: 0,
		validGame: true,
		gameMessage: "",

		initializeGame: function (levelNumber) {
			var self = this;
			if(levelNumber === 0){
				self.map = mapCache = MapFactory.createNewBoard(0); 
				self.scroll = scrollCache = ScrollFactory.createScroll(); 
				self.params = paramsCache = ParametersFactory.createParameters(); 
				paramsCache.initBoard(mapCache);
			}
			else {
				return $http.get('/api/levels/' + levelNumber) //make a http request to the backend
				.then(function (res) {
					self.map = mapCache = MapFactory.createNewBoard(res.data.map.data); //create the map
					self.nodeCoords = res.data.map.nodeCoords; //set the node coordinates
					self.bezierData = res.data.map.bezierData; //set the svg bezier curve data for the nodes
					self.scroll = scrollCache = ScrollFactory.createScroll(res.data.scroll.data); //create the scroll
					self.scrollCoords = res.data.scroll.scrollCoords; //set the scroll coordinates
					self.scrollbezierData = res.data.scroll.bezierData; //set the svg bezier curve data for the scroll
					self.params = paramsCache = ParametersFactory.createParameters(res.data.params.data); //create the parameters
					paramsCache.initBoard(mapCache); //initialize the board with the parameters given
				});
			}
		},

		advance: function () {
			var self = this;
			//Check if the game has stepped more than 30 times.
			if(self.stepCounter > MAX_STEPS) {
				self.validGame = false;
				self.gameMessage = "Stuck in infinite loop!";
			}
			if (self.validGame) {
				var gemsAndTrollStatus = {    //Capture data from the map
					trollStatus: self.map.current.troll,
					gemsCollected: self.map.gemsCollected
				};
				var color = self.scroll.getScrollColor(gemsAndTrollStatus); //Get the next scroll color
				if(color === undefined) {
					self.gameMessage = "Moving pointer!"
					return;
				} else if (color !== null) { //If we aren't at the end of the scroll
					try {
						self.map.step(color);
						self.gameMessage = "Moving along " + color + " path!";
					} catch(e) {
						self.validGame = false;
						self.gameMessage = e.message;
					}
				}
				else if(self.map.current === self.map.end) { //End of scroll and end of map
					if(self.map.gemsCollected === self.params.gems.length) { //All gems collected
						self.validGame = false;
						self.gameMessage = "Level completed!";
					} else {	//Gems missing
						self.validGame = false;
						self.gameMessage = "Gems not collected!";
					}
				} else {	//Did not make it to the portal
					self.validGame = false;
					self.gameMessage = "Goal not reached!";
				}
				self.stepCounter++; //increment the step counter to check for infinite loop
			}
		},

		fastAdvance: function () {	//Automatically run the step function until the game is false
			while (this.validGame) {
				this.advance();
			}
		},

		resetGame: function () {	//Reset the game
			this.stepCounter = 0;
			this.validGame = true;
			this.map = mapCache;
			this.scroll = scrollCache;
			this.params = paramsCache;
		}

	};
})