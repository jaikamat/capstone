app.factory('EvalFactory', function ($http, ParametersFactory, MapFactory, ScrollFactory) {
	//These cached objects are used to reset the game so another http request is not required.
	var mapCache, scrollCache, paramsCache;
	var stepCounter = 0;

	return {
		map: null,
		scroll: null,
		params: null,
		validGame: true,
		gameMessage: "",

		initializeGame: function (levelNumber) {
			var self = this;
			if(levelNumber === 0){
				mapCache = MapFactory.createNewBoard(0); 
				scrollCache = ScrollFactory.createScroll(); 
				paramsCache = ParametersFactory.createParameters(); 
				paramsCache.initBoard(mapCache);
				self.map = mapCache;
				self.scroll = scrollCache;
				self.params = paramsCache;
			}
			else {
				$http.get('/api/levels' + levelNumber) //make a http request to the backend
				.then(function (res) {
					mapCache = MapFactory.createNewBoard(res.data.map.data); //create the map
					scrollCache = ScrollFactory.createScroll(res.data.scroll.data); //create the scroll
					paramsCache = ParametersFactory.createParameters(res.data.params.data); //create the parameters
					paramsCache.initBoard(mapCache); //initialize the board with the parameters given
				})
				.then(function () {	//Cache everything
					self.map = mapCache;
					self.scroll = scrollCache;
					self.params = paramsCache;
				});
			}
		},

		advance: function () {
			var self = this;
			//Check if the game has stepped more than 30 times.
			if(stepCounter > 30) {
				self.validGame = false;
				self.gameMessage = "Stuck in infinite loop!";
			}
			if (self.validGame) {
				var gameData = {    //Capture data from the map
					trollStatus: self.map.current.troll,
					gemsCollected: self.map.gemsCollected
				};
				var color = self.scroll.getData(gameData); //Get the next scroll color
				if (color !== null) { //If we aren't at the end of the scroll
					var mapMove = self.map.step(color);
					if(mapMove === null) {  //If the map path is invalid
						self.validGame = false;
						self.gameMessage = "That path is not available!";
					}
					else { //otherwise, execute movement
						self.gameMessage = "Moving along" + color + "path!";
					}
				}
				else if(self.map.current === self.map.end) { //End of scroll and end of map
					if(self.map.gemsCollected === self.params.gems.length) { //All gems collected
						self.validGame = false;
						self.gameMessage = "Level completed!";
					}
					else {	//Gems missing
						self.validGame = false;
						self.gameMessage = "Gems not collected!";
					}
				}
				else {	//Did not make it to the portal
					self.validGame = false;
					self.gameMessage = "Goal not reached!";
				}
				stepCounter++; //increment the step counter to check for infinite loop
			}
		},

		fastAdvance: function () {	//Automatically run the step function until the game is false
			var self = this;
			while (self.validGame) {
				self.advance();
			}
		},

		resetGame: function () {	//Reset the game
			var self = this;
			stepCounter = 0;
			self.validGame = true;
			self.map = mapCache;
			self.scroll = scrollCache;
			self.params = paramsCache;
		}

	};
})