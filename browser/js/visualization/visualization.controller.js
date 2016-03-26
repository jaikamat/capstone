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
    console.log(connections);
    return connections;
  }

  function getSteps(items) {
    let divRadius = 25;
    let steps = [];

    steps.push({
      source: 'start',
      destination: items[0].id,
      type: 'next'
    });

    for (let itemId in items) {
      let item = items[itemId];
      ['next', 'truePath', 'falsePath'].forEach(function (follower) {
        if (item[follower] !== null && item[follower] !== undefined) {
          steps.push([+itemId, item[follower], follower]);
        }
      });
    }

    steps.forEach(function (step) {
      const divRadius = 25;
      // first element of array is the source, second is the target
      let coords1;
      if (step[0] === 'start') coords1 = $scope.scroll.start.coords;
      else coords1 = $scope.scroll.items[step[0]].coords;
      let coords2;
      if (step[1].id === -1) coords2 = $scope.scroll.end.coords;
      else coords2 = $scope.scroll.items[step[1]].coords;
      // centers the div coordinates
      step.x1 = step.coords1[0] + divRadius;
      step.y1 = coords1[1] + divRadius;
      step.x2 = coords2[0] + divRadius;
      step.y2 = coords2[1] + divRadius;
      if (step[2] === 'next') step.color = 'gray';
      if (step[2] === 'truePath') step.color = 'green';
      if (step[2] === 'falsePath') step.color = 'red';
    });

    return steps;
  }

  // { oneWay: [], twoWay:  }

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
  console.log('THESE ARE THE NODES', $scope.board.nodes);
  $scope.connections = getConnections($scope.board.nodes);
  $scope.board.setCurrentAndEnd(0, 5);
  $scope.currentNodeStyle = currentNodeStyle;

  // TODO: set these to be percentage coordinates of the parent div pixel size
  // TODO: on window resize, re-run function to draw map on front end;
  var nodeWidth = 80;
  var itemWidth = 40;

  // for each node, inout the corrds it should be at and then draw them
  // for each path, compute its location as well

  var level1 = {
    0: [0.2, 0.2],
    1: [0.5, 0.2],
    2: [0.8, 0.2],
    3: [0.2, 0.6],
    4: [0.5, 0.6],
    5: [0.8, 0.6]
  };

  var scroll1 = {
    0: [0.35, 0.3],
    1: [0.45, 0.3],
    2: [0.55, 0.3],
    3: [0.65, 0.3],
  };

  var startCoords = [0.25, 0.3];
  var endCoords = [0.75, 0.3];

  function drawMapNodes(object) { //is invoked with an object of key id and value array { 0: [], 1: [], 2[] }
    var bW = document.getElementById('board').offsetWidth;
    var bH = document.getElementById('board').offsetHeight;
    for (let key in object) {
      $scope.board.nodes[key].coords = [bW * object[key][0] - itemWidth / 2, bH * object[key][1]];
    }
    // console.log("MAP NODES DRAWN")
    // console.log('DIV WIDTH: ', bW, 'DIV HEIGHT: ', bH);
  }

  function drawScrollItems(scrollCoords, startCoods, endCoords) {
    var sW = document.getElementById('scroll').offsetWidth;
    var sH = document.getElementById('scroll').offsetHeight;
    var bH = document.getElementById('board').offsetHeight;
    for (let key in scrollCoords) {
      if (scrollCoords.hasOwnProperty(key)) {
        $scope.scroll.items[key].coords = [sW * scrollCoords[key][0] - itemWidth / 2, bH + sH * scrollCoords[key][1]];
      }
    }
    $scope.scroll.start.coords = [sW * startCoords[0] - itemWidth / 2, bH + sH * startCoords[1]];
    $scope.scroll.end.coords = [sW * endCoords[0] - itemWidth / 2, bH + sH * endCoords[1]];
  }

  drawMapNodes(level1);

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

    // pare down 

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

  drawScrollItems(scroll1, startCoords, endCoords);
  $scope.steps = getSteps($scope.scroll.items);

  console.log("Steps", $scope.steps);

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

  $scope.run = function () {
    $('.item-class').children().removeAttr('draggable');
    var items = [].slice.call($('.item-class'), 1, -1);
    var tokens = [].slice.call($('.item-class').children());
    items.forEach(function (item, index) {
      EvalFactory.scroll.items[index].color = tokens[index].style.backgroundColor;
    });
    var last = document.getElementById('node-' + EvalFactory.map.current.id);
    EvalFactory.advance();
    var current = document.getElementById('node-' + EvalFactory.map.current.id);
    if (last) last.style.backgroundColor = 'white';
    current.style.backgroundColor = 'yellow';
    console.log("Game message: ", EvalFactory.gameMessage);
    // console.log("Current: ", EvalFactory.map.current, "End: ", EvalFactory.map.end);
  };

  (function () {
    var resizeTimeout;

    function resizeThrottler() {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(function () {
          resizeTimeout = null;
          actualResizeHandler();
        }, 1000)
      }
    }

    function actualResizeHandler() {
      // TODO: make sure to re-compute map data here
      drawMapNodes(level1);
      // $scope.$apply(); // need this
      console.log('WE ARE RESIZING')
    }

    window.addEventListener("resize", resizeThrottler);
  })()

});
