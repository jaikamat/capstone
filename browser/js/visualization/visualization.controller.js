app.controller('VisualizationCtrl', function ($scope, MapFactory, ParametersFactory, ScrollFactory, EvalFactory) {
  
  var NODE_WIDTH = 80;

  var options = [{
    red: 1,
    green: 2,
    blue: 4
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
    blue: 0
  }, {
    red: 2,
    green: 4,
    blue: 3
  }];

  var level1 = {
    0 : [0.2, 0.2],
    1 : [0.5, 0.2],
    2 : [0.8, 0.2],
    3 : [0.2, 0.6],
    4 : [0.5, 0.6],
    5 : [0.8, 0.6]
  };

  var parametersOptions = {
    startNode: 5,
    endNode: 3,
    redTokens: 2,
    greenTokens: 2,
    blueTokens: 0,
    gems: [],
    conditionals: []
  };

  // for each element, if another object exists with those start and 
  // ends swapped, remove it and label bidirectional
  function filterDirection (arr) {
    arr.forEach(function (element) {
      var nstart = element.end;
      var nend = element.start;
      arr.forEach(function (e, idx) {
        if (e.start === nstart && e.end === nend) {
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
    return filterDirection(connections);
  }

  // this function takes coordinate inputs (with optional bezier curve anchor points) to draw paths
  function drawSvgLine (x1, y1, x2, y2, color, dist) { // dist is the amount of curvature needed
    var attr, bx1, by1, bx2, by2;
    var newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    dist = dist || 0;

    bx1 = x1 - (dist * (y2 - y1) / Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    by1 = y1 + (dist * (x2 - x1) / Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    bx2 = x2 - (dist * (y2 - y1) / Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
    by2 = y2 + (dist * (x2 - x1) / Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

    attr = `M ${x1} ${y1} C ${bx1} ${by1} ${bx2} ${by2}, ${x2} ${y2}`;

    newPath.setAttribute('d', attr);
    newPath.setAttribute('id', 'routes');
    newPath.setAttribute('fill', 'transparent');
    newPath.setAttribute('stroke', color);
    newPath.setAttribute('stroke-width', 20);

    $("#lines").append(newPath);
  }


  function drawMapNodes (object) { //is invoked with an object of key id and value array { 0: [0.5, 0.6], 1: [0.5, 0.6], 2: [0.5, 0.6] }
    var bW = document.getElementById('board').offsetWidth;
    var bH = document.getElementById('board').offsetHeight;
    for (let key in object) {
      $scope.board.nodes[key].coords = [bW * object[key][0] - NODE_WIDTH / 2, bH * object[key][1]];
    }
    console.log("MAP NODES DRAWN")
    console.log('DIV WIDTH: ', bW, 'DIV HEIGHT: ', bH);
  }


  function drawMapPaths (array) { // use the output from the get all connections
    array.forEach(function (object) {
      console.log(object)
      var bW = document.getElementById('board').offsetWidth;
      var bH = document.getElementById('board').offsetHeight;

      var divDiameter = NODE_WIDTH/2;
      // first element of array is the source, second is the target
      var startCoords = $scope.board.nodes[object.start].coords;
      var endCoords = $scope.board.nodes[object.end].coords;

      // centers the div coordinates
      var x1 = startCoords[0] + divDiameter;
      var y1 = startCoords[1] + divDiameter;
      var x2 = endCoords[0] + divDiameter;
      var y2 = endCoords[1] + divDiameter;
      var color = object.color;

      // hard-coding in what paths are curved or not!
      if (object.start === 0 && object.end === 2) drawSvgLine(x1, y1, x2, y2, color, -100);
      else if (object.start === 3 && object.end === 5) drawSvgLine(x1, y1, x2, y2, color, 100);
      else drawSvgLine(x1, y1, x2, y2, color);
    });
    console.log('MAP PATHS DRAWN')
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
    // console.log("Player location after step: ", EvalFactory.map.current);
    console.log("Game message: ", EvalFactory.gameMessage);
    // console.log("Current: ", EvalFactory.map.current, "End: ", EvalFactory.map.end);
    console.log("Scroll.end: ", EvalFactory.scroll.end);
  };

  $scope.board = MapFactory.createNewBoard(options);
  console.log('THESE ARE THE NODES', $scope.board.nodes);
  var mapConnections = getAllConnections($scope.board.nodes);
  $scope.connections = mapConnections;
  $scope.board.setCurrentAndEnd(0, 5);

  drawMapNodes(level1);
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
    drawMapNodes(level1);
    drawMapPaths($scope.connections);
    $scope.$apply();
    console.log('WE ARE RESIZING')
  }

  window.addEventListener("resize", resizeThrottler);
})()

});
