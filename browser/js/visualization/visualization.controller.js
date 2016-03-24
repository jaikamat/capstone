app.controller('VisualizationCtrl', function ($scope, MapFactory, ParametersFactory, ScrollFactory, EvalFactory) {

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

  function getConnections(nodes) {
    var connections = [];

    for (var nodeId in nodes) {
      let node = nodes[nodeId];
      ['red', 'green', 'blue'].forEach(function (color) {
        if (node[color] !== null) {
          connections.push([+nodeId, node[color], color]);
        }
      });
    }
    return connections;
  }

  // this function takes coordinate inputs (with optional bezier curve anchor points)
  // to draw lines
  function drawSvgLine(x1, y1, x2, y2, color, bx1, by1, bx2, by2) {
    if (bx1 && bx2) {
      //<path d="M10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/>
      var newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      var attr = 'M' + x1 + " " + y1 + " C" + " " + bx1 + " " + by1 + ", " + bx2 + " " + by2 + ", " + x2 + " " + y2;
      newPath.setAttribute('d', attr);
      newPath.setAttribute('id', 'curved-routes');
      newPath.setAttribute('fill', 'transparent');
      newPath.setAttribute('stroke', color);
      newPath.setAttribute('stroke-width', 20);
      $("#lines").append(newPath);
    } else {
      var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      newLine.setAttribute('id', 'straight-routes');
      newLine.setAttribute('x1', x1);
      newLine.setAttribute('y1', y1);
      newLine.setAttribute('x2', x2);
      newLine.setAttribute('y2', y2);
      newLine.setAttribute('stroke', color);
      newLine.setAttribute('stroke-width', 20);
      $("#lines").append(newLine);
    }
  }

  var lastNode;

  function currentNodeStyle(color) {
    if (lastNode) lastNode.css('background-color', 'white');
    // this is the current node on the DOM
    $scope.board.step(color);
    var currentDOMnode = $scope.board.current.id;
    // this is the element we are isolating
    var element = $('#node' + currentDOMnode);
    // we then change the color to black 
    element.css('background-color', 'black');
    // and then move
    // now the current has changed
    lastNode = $('#node' + currentDOMnode);
  }

  $scope.board = MapFactory.createNewBoard(options);
  $scope.connections = getConnections($scope.board.nodes);
  $scope.board.setCurrentAndEnd(0, 5);
  $scope.currentNodeStyle = currentNodeStyle;

  // width: 600px
  // height: 400px
  // TODO: set these to be percentage coordinates of the parent div pixel size
  $scope.board.nodes[0].coords = [160, 100];
  $scope.board.nodes[1].coords = [360, 100];
  $scope.board.nodes[2].coords = [560, 100];
  $scope.board.nodes[3].coords = [160, 300];
  $scope.board.nodes[4].coords = [360, 300];
  $scope.board.nodes[5].coords = [560, 300];

  $scope.connections.forEach(function (array) {
    var divDiameter = 40;
    // first element of array is the source, second is the target
    var coords1 = $scope.board.nodes[array[0]].coords;
    var coords2 = $scope.board.nodes[array[1]].coords;
    // centers the div coordinates
    var x1 = coords1[0] + divDiameter;
    var y1 = coords1[1] + divDiameter;
    var x2 = coords2[0] + divDiameter;
    var y2 = coords2[1] + divDiameter;
    var color = array[2];
    // console.log('NODE\n', array[0], array[1], 'COLOR\n', color)

    if (array[0] === 0 && array[1] === 2) {
      drawSvgLine(x1, y1, x2, y2, color, x1 + 20, y1 - 100, x2 - 20, y2 - 100);
    } else if (array[0] === 3 && array[1] === 5) {
      drawSvgLine(x1, y1, x2, y2, color, x1 + 20, y1 + 100, x2 - 20, y2 + 100);
    } else if (array[0] === 5 && array[1] === 3); // do nothing
    else if (array[0] === 2 && array[1] === 0); // do nothing
    else {
      drawSvgLine(x1, y1, x2, y2, color);
    }
  });

  $scope.scroll = ScrollFactory.createScroll();
  $scope.scroll.addInstruction(0);
  $scope.scroll.addInstruction(1);
  $scope.scroll.addInstruction(2);
  $scope.scroll.addInstruction(3);
  $scope.scroll.setStart(0);
  $scope.scroll.setRoute(0, {
    next: 1
  });
  $scope.scroll.setRoute(1, {
    next: 2
  });
  $scope.scroll.setRoute(2, {
    next: 3
  });
  $scope.scroll.setRoute(3, {
    next: -1
  });

  var parametersOptions = {
    startNode: 5,
    endNode: 3,
    redTokens: 2,
    greenTokens: 2,
    blueTokens: 0,
    gems: [],
    conditionals: []
  };

  $scope.parameters = ParametersFactory.createParameters(parametersOptions);
  console.log($scope.parameters);

  function getTokens() {
    var arr = [];
    for (let i = 0; i < $scope.parameters.redTokens; i++) {
      arr.push({
        id: i,
        color: 'red'
      });
    }
    for (let i = 0; i < $scope.parameters.greenTokens; i++) {
      arr.push({
        id: i,
        color: 'green'
      });
    }
    for (let i = 0; i < $scope.parameters.blueTokens; i++) {
      arr.push({
        id: i,
        color: 'blue'
      });
    }
    return arr;
  }

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
  console.log("Initted map: ", EvalFactory.map);

  $scope.run = function () {
    var items = $('.item-class');
    var tokens = items.children();
    console.log(items);
    // console.log("Player location before step: ", EvalFactory.map.current);
    // var last = document.getElementById('node-' + EvalFactory.map.current.id);
    // EvalFactory.advance();
    // var current = document.getElementById('node-' + EvalFactory.map.current.id);
    // if (last) last.style.backgroundColor = 'white';
    // current.style.backgroundColor = 'yellow';
    // // console.log("Player location after step: ", EvalFactory.map.current);
    // console.log("Game message: ", EvalFactory.gameMessage);
    // // console.log("Current: ", EvalFactory.map.current, "End: ", EvalFactory.map.end);
    // console.log("Scroll.end: ", EvalFactory.scroll.end);
  };

});
