app.controller('VisualizationCtrl', function ($scope, game) {
  $scope.game = game;
  var NODE_WIDTH = 80;
  var TOKEN_WITDH = 50;

  var scroll1 = {
    start: [0.25, 0.5],
    0: [0.35, 0.5],
    1: [0.45, 0.5],
    2: [0.55, 0.5],
    3: [0.65, 0.5],
    end: [0.75, 0.5]
  };
  $scope.getNumberForNgRepeat = getNumberForNgRepeat;

  setScrollCoordinates(scroll1);
  $scope.scrollItemConnections = getScrollCoordinates($scope.game.scroll);

  $scope.tokens = getTokens();

  //------------------------------------------

  // draw the map paths and nodes
  setNodeCoordinates($scope.game.nodeCoords);
  // draws map connections
  drawMapConnections(getAllConnections($scope.game.map.nodes));

  // for each element, if another object exists with those start and 
  // ends swapped, remove it and label bidirectional
  function filterDirection(arrOfConnections) {
    arrOfConnections.forEach(function (singleConnection) {
      var nstart = singleConnection.end;
      var nend = singleConnection.start;
      arrOfConnections.forEach(function (e, idx) {
        if (e.start === nstart && e.end === nend && nstart !== nend) {
          singleConnection.bidirectional = true;
          arrOfConnections.splice(idx, 1);
        }
      })
    })
    return arrOfConnections;
  }

  function getAllConnections(nodes) {
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
    return specifyBezierCurves(filterDirection(connections));
  }

  function specifyBezierCurves(arrOfConnections) {
    arrOfConnections.forEach(function (aConnection) {
      $scope.game.bezierData.forEach(function (element) {
        if (aConnection.start === element.start && aConnection.end === element.end && aConnection.color === element.color) {
          aConnection.curvature = element.curvature;
        }
      });
    });
    return arrOfConnections;
  }

  // this function takes coordinate inputs (with optional bezier curve anchor points) to draw paths
  function drawSvgLine(x1, y1, x2, y2, color, dist) { // dist is the amount of curvature needed
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

  function setNodeCoordinates(objOfNodeCoords) { //is invoked with an objOfNodeCoords of key id and value array { 0: [0.5, 0.6], 1: [0.5, 0.6], 2: [0.5, 0.6] }
    var bW = document.getElementById('board').offsetWidth;
    var bH = document.getElementById('board').offsetHeight;
    for (var nodeCoords in objOfNodeCoords) {
      $scope.game.map.nodes[nodeCoords].coords = [bW * objOfNodeCoords[nodeCoords][0] - NODE_WIDTH / 2, bH * objOfNodeCoords[nodeCoords][1]];
    }
  }

  function getScrollCoordinates(scroll) { //takes in the $scope.scroll object
    var paths = {};
    var arrayOfItems = Object.keys(scroll.items).map(k => scroll.items[k]);
    var arrayToIterateOver = [scroll.start].concat(arrayOfItems).concat(scroll.end);

    for (let i = 0; i < arrayToIterateOver.length - 1; i++) {
      paths[i] = {
        pathBegin: i,
        pathEnd: i + 1,
        x1: arrayToIterateOver[i].coords[0] + TOKEN_WITDH / 2,
        y1: arrayToIterateOver[i].coords[1] + TOKEN_WITDH / 2,
        x2: arrayToIterateOver[i + 1].coords[0] + TOKEN_WITDH / 2,
        y2: arrayToIterateOver[i + 1].coords[1] + TOKEN_WITDH / 2
      }
    }

    return paths;
  }

  function setScrollCoordinates(object) { //is invoked with an object of key id and value array { 0: [0.5, 0.6], 1: [0.5, 0.6], 2: [0.5, 0.6] }
    var sW = document.getElementById('scroll').offsetWidth;
    var sH = document.getElementById('scroll').offsetHeight;
    for (var key in object) {
      if (key === 'start') {
        $scope.game.scroll.start.coords = [sW * object[key][0] - NODE_WIDTH / 2, sH * object[key][1]];
      } else if (key === 'end') {
        $scope.game.scroll.end.coords = [sW * object[key][0] - NODE_WIDTH / 2, sH * object[key][1]];
      } else {
        $scope.game.scroll.items[key].coords = [sW * object[key][0] - NODE_WIDTH / 2, sH * object[key][1]];
      }
    }
  }

  function drawMapConnections(array) { // use the output from the get all connections
    array.forEach(function (object) {
      var bW = document.getElementById('board').offsetWidth;
      var bH = document.getElementById('board').offsetHeight;

      var divDiameter = NODE_WIDTH / 2;
      // first element of array is the source, second is the target
      var startCoords = $scope.game.map.nodes[object.start].coords;
      var endCoords = $scope.game.map.nodes[object.end].coords;

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

  // find all the token nodes and their coords (done)
  // draw an svg line for each coordinate pair using ng-repeat
  function getTokens() {
    var arr = [];
    ["red", "green", "blue"].forEach(function (color) {
      for (let i = 0; i < $scope.game.params[color + "Tokens"]; i++) {
        arr.push({
          id: i,
          color: color
        });
      }
    })
    return arr;
  }

  function getNumberForNgRepeat(integer) { // hack for ng-repeat
    return Array(integer);
  }

  $scope.run = function () {
    $('.item-class').children().removeAttr('draggable');
    var items = [].slice.call($('.item-class'), 1, -1);
    var tokens = [].slice.call($('.item-class').children());
    var current, currentNode, last, origin, destination, previousOrigin;

    items.forEach(function (item, index) {
      $scope.game.scroll.items[index].color = tokens[index].style.backgroundColor;
    });

    origin = $scope.game.scroll.pointer;
    $scope.game.advance();
    destination = $scope.game.scroll.pointer;
    animatePointer(origin, destination);

    console.log("Game message: ", $scope.game.gameMessage);

    // experimental addition for player interaction
    // this is a terrible, idea, just hacked for visuals
    if ($scope.game.gameMessage === 'Level completed!') {
      $('#game-container').fadeOut('slow');
    }
  };

  // function initMap () { // lables nodes as start and end and applies styles with animations
  //   var startNode, endNode;

  //   startNode = document.getElementById('node-' + EvalFactory.map.current.id);
  //   endNode = document.getElementById('node-' + EvalFactory.map.end.id);
  // }

  function animatePointer(origin, destination) {
    var pointer = document.getElementById('pointer');
    var positionKeyframes = [{ motionOffset: '100%' }];
    var positionTiming = { duration: 1000, iterations: 1 };
    var originCoords, destinationCoords, motionPath;

    if (origin.id === 'start') originCoords = $scope.game.scroll.start.coords;
    else if (origin.id === -1) originCoords = $scope.game.scroll.end.coords;
    else originCoords = $scope.game.scroll.items[origin.id].coords;
    if (destination.id === -1) destinationCoords = $scope.game.scroll.end.coords;
    else destinationCoords = $scope.game.scroll.items[destination.id].coords;

    motionPath = `M ${originCoords[0]}, ${originCoords[1]} L ${destinationCoords[0]}, ${destinationCoords[1]}`;
    pointer.style.motionPath = `path("${motionPath}")`;
    pointer.animate(positionKeyframes, positionTiming)
      .finished
      .then(function (arg) {
        console.log(arg);
        pointer.style.motionPath = `path("M ${destinationCoords[0]}, ${destinationCoords[1]}")`;
      })
  }

  (function () {
    var resizeTimeout;

    function resizeThrottler() {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(function () {
          resizeTimeout = null;
          actualResizeHandler();
        }, 1000);
      }
    }

    function actualResizeHandler() {
      // TODO: make sure to re-compute map data here
      // setNodeCoordinates(level1);
      // drawMapConnections($scope.connections);
      // $scope.$apply();
      console.log('WE ARE RESIZING')
    }
    window.addEventListener("resize", resizeThrottler);
  })()
});