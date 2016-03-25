app.controller('VisualizationCtrl', function ($scope, MapFactory, ParametersFactory, ScrollFactory, EvalFactory) {
  
  var NODE_WIDTH = 80;

//~~~MAP 7~~~

  // var options = [{
  //     red: 3,
  //     green: 1,
  //     blue: 2
  //   }, {
  //     red: 4,
  //     green: 0,
  //     blue: null
  //   }, {
  //     red: 5,
  //     green: 3,
  //     blue: 0
  //   }, {
  //     red: 0,
  //     green: 2,
  //     blue: 4
  //   }, {
  //     red: 1,
  //     green: 6,
  //     blue: 3
  //   }, {
  //     red: 2,
  //     green: 7,
  //     blue: 6
  //   }, {
  //     red: 8,
  //     green: 4,
  //     blue: 5
  //   }, {
  //     red: null,
  //     green: 5,
  //     blue: 8
  //   }, {
  //     red: 6,
  //     green: null,
  //     blue: 7
  //   }];

  // var level1 = {
  //   0 : [0.2, 0.3],
  //   1 : [0.2, 0.6],
  //   2 : [0.4, 0.1],
  //   3 : [0.4, 0.45],
  //   4 : [0.4, 0.8],
  //   5 : [0.6, 0.3],
  //   6 : [0.6, 0.6],
  //   7 : [0.8, 0.3],
  //   8 : [0.8, 0.6]
  // }

  // var bezierCurves = []

//~~~MAP 4~~~

  // var options = [{
  //     red: 1,
  //     green: 1,
  //     blue: 0
  //   }, {
  //     red: 0,
  //     green: 0,
  //     blue: 2
  //   }, {
  //     red: 3,
  //     green: 5,
  //     blue: 1
  //   }, {
  //     red: 2,
  //     green: 4,
  //     blue: 5
  //   }, {
  //     red: 5,
  //     green: 3,
  //     blue: 4
  //   }, {
  //     red: 4,
  //     green: 2,
  //     blue: 3
  //   }];

  // var level1 = {
  //   0 : [0.2, 0.25],
  //   1 : [0.2, 0.75],
  //   2 : [0.4, 0.75],
  //   3 : [0.6, 0.75],
  //   4 : [0.8, 0.75],
  //   5 : [0.6, 0.25]
  // }

  // var bezierCurves = [
  //   {
  //     start : 0,
  //     end: 0,
  //     color : 'blue',
  //     curvature: 100
  //   },
  //   {
  //     start : 0,
  //     end: 1,
  //     color: 'red',
  //     curvature: -50
  //   },
  //   {
  //     start : 0,
  //     end: 1,
  //     color: 'green',
  //     curvature: 50
  //   },
  //   {
  //     start : 4,
  //     end: 4,
  //     color: 'blue',
  //     curvature: -100
  //   }
  // ]

//~~~MAP 3~~~

  // var options = [{
  //     red: 1,
  //     green: 1,
  //     blue: 3
  //   }, {
  //     red: 0,
  //     green: 0,
  //     blue: 2
  //   }, {
  //     red: 3,
  //     green: 5,
  //     blue: 1
  //   }, {
  //     red: 2,
  //     green: 4,
  //     blue: 0
  //   }, {
  //     red: 5,
  //     green: 3,
  //     blue: 5
  //   }, {
  //     red: 4,
  //     green: 2,
  //     blue: 4
  //   }];

  // var level1 = {
  //   0 : [0.2, 0.2],
  //   1 : [0.5, 0.2],
  //   2 : [0.8, 0.2],
  //   3 : [0.2, 0.6],
  //   4 : [0.5, 0.6],
  //   5 : [0.8, 0.6]
  // }

  // var bezierCurves = [
  //   {
  //     start : 0,
  //     end: 1,
  //     color : 'red',
  //     curvature: -50
  //   },
  //   {
  //     start : 0,
  //     end: 1,
  //     color: 'green',
  //     curvature: 50
  //   },
  //   {
  //     start : 4,
  //     end: 5,
  //     color: 'red',
  //     curvature: -50
  //   },
  //   {
  //     start : 4,
  //     end: 5,
  //     color: 'blue',
  //     curvature: 50
  //   }
  // ]

//~~~MAP 2~~~

  // var options = [{
  //     red: 2,
  //     green: 4,
  //     blue: 1
  //   }, {
  //     red: 5,
  //     green: 2,
  //     blue: 0
  //   }, {
  //     red: 0,
  //     green: 1,
  //     blue: 3
  //   }, {
  //     red: 4,
  //     green: 5,
  //     blue: 2
  //   }, {
  //     red: 3,
  //     green: 0,
  //     blue: 5
  //   }, {
  //     red: 1,
  //     green: 3,
  //     blue: 4
  //   }];

  // var level1 = {
  //   0: [0.4, 0.20],
  //   1: [0.2, 0.5],
  //   2: [0.4, 0.5],
  //   3: [0.6, 0.5],
  //   4: [0.8, 0.5],
  //   5: [0.6, 0.8],
  // }

  // var bezierCurves = [];

  // var parametersOptions = {
  //   startNode: 3,
  //   endNode: 5,
  //   redTokens: 2,
  //   greenTokens: 0,
  //   blueTokens: 2,
  //   gems: [],
  //   conditionals: []
  // }

//~~~MAP 1~~~

  var options = [{
    red: 1,
    green: 2,
    blue: 4,
    troll: 'purple'
  }, {
    red: 0,
    green: 3,
    blue: 2
  }, {
    red: 5,
    green: 0,
    blue: 1
  }, {
    red: 4,
    green: 1,
    blue: 5
  }, {
    red: 3,
    green: 5,
    blue: 0,
  }, {
    red: 2,
    green: 4,
    blue: 3,
    troll: 'orange'
  }];

  var level1 = {
    0 : [0.2, 0.2],
    1 : [0.5, 0.2],
    2 : [0.8, 0.2],
    3 : [0.2, 0.6],
    4 : [0.5, 0.6],
    5 : [0.8, 0.6]
  };

  // specify lower number first TODO: fix this
  var bezierCurves = [
    {
      start : 0,
      end: 2,
      color : 'green',
      curvature: -100
    },
    {
      start : 3,
      end: 5,
      color: 'blue',
      curvature: 100
    }
  ]

  var parametersOptions = {
    startNode: 2,
    endNode: 4,
    redTokens: 2,
    greenTokens: 1,
    blueTokens: 1,
    gems: [1],
    conditionals: []
  };

  // for each element, if another object exists with those start and 
  // ends swapped, remove it and label bidirectional

  function filterDirection (arr) {
    arr.forEach(function (element) {
      var nstart = element.end;
      var nend = element.start;
      arr.forEach(function (e, idx) {
        if (e.start === nstart && e.end === nend && nstart !== nend) {
          element.bidirectional = true;
          arr.splice(idx, 1);
        }
      })
    }) 
    return arr;
  }

  function getAllConnections (nodes) {
    var connections = [];

    for (var nodeId in nodes) {
      let node = nodes[nodeId];
      ['red', 'green', 'blue'].forEach(function (color) {
        if (node[color] !== null) {
          connections.push({
            start: +nodeId,
            end: node[color],
            color: color,
            bidirectional: false
          });
        }
      });
    }
    var sortedConnections = filterDirection(connections);
    return specifyBezierCurves(sortedConnections);
  }

  function specifyBezierCurves (array) {
    array.forEach(function (object) {
      bezierCurves.forEach(function (element) {
        if (object.start === element.start && object.end === element.end && object.color === element.color) {
          object.curvature = element.curvature;
        }
      });
    });
    // console.log("ALL THE CONNECTIONS: ",array);
    return array;
  }

  // this function takes coordinate inputs (with optional bezier curve anchor points) to draw paths
  function drawSvgLine (x1, y1, x2, y2, color, dist) { // dist is the amount of curvature needed
    var attr, bx1, by1, bx2, by2;
    var newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var check = false
    
    dist = dist || 0;
    
    if (x1 === x2 && y1 === y2) {
      var cachex1 = x1;
      var cachex2 = x2;
      x1 += 75;
      x2 -= 75;
    }

    bx1 = x1 - (dist * (y2 - y1) / Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    by1 = y1 + (dist * (x2 - x1) / Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    bx2 = x2 - (dist * (y2 - y1) / Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    by2 = y2 + (dist * (x2 - x1) / Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

    if (cachex1) {
      x1 = cachex1;
      x2 = cachex2;
    }

    attr = `M ${x1} ${y1} C ${bx1} ${by1} ${bx2} ${by2}, ${x2} ${y2}`;

    newPath.setAttribute('d', attr);
    newPath.setAttribute('id', 'routes');
    newPath.setAttribute('fill', 'transparent');
    newPath.setAttribute('stroke', color);
    newPath.setAttribute('stroke-width', 20);

    $("#lines").append(newPath);
  }

  function setNodeCoordinates (object) { //is invoked with an object of key id and value array { 0: [0.5, 0.6], 1: [0.5, 0.6], 2: [0.5, 0.6] }
    var bW = document.getElementById('board').offsetWidth;
    var bH = document.getElementById('board').offsetHeight;
    for (let key in object) {
      $scope.board.nodes[key].coords = [bW * object[key][0] - NODE_WIDTH / 2, bH * object[key][1]];
    }
    console.log("MAP NODES DRAWN")
  }

  function drawMapPaths (array) { // use the output from the get all connections
    array.forEach(function (object) {
      var bW = document.getElementById('board').offsetWidth;
      var bH = document.getElementById('board').offsetHeight;

      var divDiameter = NODE_WIDTH / 2;
      // first element of array is the source, second is the target
      var startCoords = $scope.board.nodes[object.start].coords;
      var endCoords = $scope.board.nodes[object.end].coords;

      // centers the div coordinates
      var x1 = startCoords[0] + divDiameter;
      var y1 = startCoords[1] + divDiameter;
      var x2 = endCoords[0] + divDiameter;
      var y2 = endCoords[1] + divDiameter;
      var color = object.color;

      if (object.curvature) drawSvgLine(x1, y1, x2, y2, color, object.curvature);
      else drawSvgLine(x1, y1, x2, y2, color);
    });
  }

  function getTokens() {
    var arr = [];
    ["red", "green", "blue"].forEach(function (color) {
      for (let i = 0; i < $scope.parameters[color + "Tokens"]; i++) {
        arr.push({
          id: i,
          color: color
        });
      }
    })
    return arr;
  }

  $scope.run = function () {
    $('.item-class').children().removeAttr('draggable');
    var items = [].slice.call($('.item-class'), 0, -1);
    var tokens = [].slice.call($('.item-class').children());
    items.forEach(function (item, index) {
      EvalFactory.scroll.items[index].color = tokens[index].style.backgroundColor;
    });
    console.log("EvalFactory scroll items: ", EvalFactory.scroll.items);
    console.log("Player location before step: ", EvalFactory.map.current);
    var last = document.getElementById('node-' + EvalFactory.map.current.id);
    EvalFactory.advance();
    var current = document.getElementById('node-' + EvalFactory.map.current.id);
    if (last) last.style.backgroundColor = 'white';
    current.style.backgroundColor = 'yellow';
    console.log("Game message: ", EvalFactory.gameMessage);
    console.log("Scroll.end: ", EvalFactory.scroll.end);
  };

  $scope.board = MapFactory.createNewBoard(options);
  console.log('THESE ARE THE NODES', $scope.board.nodes);
  var mapConnections = getAllConnections($scope.board.nodes);
  $scope.connections = mapConnections;
  $scope.board.setCurrentAndEnd(0, 5);

  // draw the map paths and nodes
  setNodeCoordinates(level1);
  drawMapPaths($scope.connections);

  $scope.scroll = ScrollFactory.createScroll();
  $scope.scroll.addInstruction(0);
  $scope.scroll.addInstruction(1);
  $scope.scroll.addInstruction(2);
  $scope.scroll.addInstruction(3);
  $scope.scroll.setStart(0);
  $scope.scroll.setRoute(0, { next: 1 });
  $scope.scroll.setRoute(1, { next: 2 });
  $scope.scroll.setRoute(2, { next: 3 });
  $scope.scroll.setRoute(3, { next: -1 });
  
  $scope.parameters = ParametersFactory.createParameters(parametersOptions);

  $scope.tokens = getTokens();

  // need to link up some of the back end functions with changing the DOM
  EvalFactory.initializeGame(0);
  EvalFactory.map = $scope.board;
  EvalFactory.scroll = $scope.scroll;
  EvalFactory.params = $scope.parameters;
  EvalFactory.mapCache = $scope.board;
  EvalFactory.scrollCache = $scope.scroll;
  EvalFactory.paramsCache = $scope.parameters;
  EvalFactory.params.initBoard(EvalFactory.map);

(function () {
  var resizeTimeout;

  function resizeThrottler () {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function () {
        resizeTimeout = null;
        actualResizeHandler();
      }, 1000)
    }
  }

  function actualResizeHandler () {
    // TODO: make sure to re-compute map data here
    // setNodeCoordinates(level1);
    // drawMapPaths($scope.connections);
    // $scope.$apply();
    console.log('WE ARE RESIZING')
  }

  window.addEventListener("resize", resizeThrottler);
})()

});
