app.controller('VisualizationCtrl', function ($scope, game, EvalFactory, $timeout, $state, $stateParams) {
  $scope.game = game;

  var NODE_WIDTH = 80;
  var TOKEN_WITDH = 50;
  var RUN_INTERVAL = 400;

  var scrollCoords = $scope.game.scrollCoords;
  $scope.getNumberForNgRepeat = getNumberForNgRepeat;

  setScrollCoordinates(scrollCoords);
  $scope.scrollItemConnections = getScrollCoordinates($scope.game.scroll);

  $scope.tokens = getTokens();
  $scope.conditionals = getConditionals();
  $scope.isRunning = false;
  $scope.intervalId = null;

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
    // var paths = {};
    var arrayOfItems = Object.keys(scroll.items).map(k => scroll.items[k]);
    var allItems = [scroll.start].concat(arrayOfItems).concat(scroll.end);

    // for (let i = 0; i < allItems.length - 1; i++) {
    //   paths[i] = {
    //     pathBegin: i,
    //     pathEnd: i + 1,
    //     x1: allItems[i].coords[0] + TOKEN_WITDH / 2,
    //     y1: allItems[i].coords[1] + TOKEN_WITDH / 2,
    //     x2: allItems[i + 1].coords[0] + TOKEN_WITDH / 2,
    //     y2: allItems[i + 1].coords[1] + TOKEN_WITDH / 2
    //   };
    // }

    var paths = [];
    for (let i = 0; i < allItems.length - 1; i++) {
      if (i === 0) {
        paths.push({
          x1: allItems[0].coords[0] + TOKEN_WITDH / 2,
          y1: allItems[0].coords[1] + TOKEN_WITDH / 2,
          x2: allItems[1].coords[0] + TOKEN_WITDH / 2,
          y2: allItems[1].coords[1] + TOKEN_WITDH / 2,
          color: 'gray'
        });
      } else if (allItems[i].hasOwnProperty('next')) {
        let destination;
        if (allItems[allItems[i].next]) destination = arrayOfItems[allItems[i].next];
        else destination = allItems[i].next;
        paths.push({
          x1: allItems[i].coords[0] + TOKEN_WITDH / 2,
          y1: allItems[i].coords[1] + TOKEN_WITDH / 2,
          x2: destination.coords[0] + TOKEN_WITDH / 2,
          y2: destination.coords[1] + TOKEN_WITDH / 2,
          color: 'gray'
        });
      } else if (allItems[i].hasOwnProperty('truePath')) {
        let trueDestination;
        if (allItems[allItems[i].truePath]) trueDestination = arrayOfItems[allItems[i].truePath];
        else trueDestination = allItems[i].truePath;
        let falseDestination;
        if (allItems[allItems[i].falsePath]) falseDestination = arrayOfItems[allItems[i].falsePath];
        else falseDestination = allItems[i].falsePath;
        paths.push({
          x1: allItems[i].coords[0] + TOKEN_WITDH / 2,
          y1: allItems[i].coords[1] + TOKEN_WITDH / 2,
          x2: trueDestination.coords[0] + TOKEN_WITDH / 2,
          y2: trueDestination.coords[1] + TOKEN_WITDH / 2,
          color: 'green'
        });
        paths.push({
          x1: allItems[i].coords[0] + TOKEN_WITDH / 2,
          y1: allItems[i].coords[1] + TOKEN_WITDH / 2,
          x2: falseDestination.coords[0] + TOKEN_WITDH / 2,
          y2: falseDestination.coords[1] + TOKEN_WITDH / 2,
          color: 'red'
        });
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

  function getConditionals() {
    var arr = [];
    $scope.game.params.conditionals.forEach(function (conditional) {
      let text, color;
      if (!isNaN(conditional)) {
        text = conditional.toString();
        color = 'white';
      } else {
        text = '';
        color = conditional;
      }
      arr.push({
        text: text,
        color: color
      });
    });
    return arr;
  }

  function getNumberForNgRepeat(integer) { // hack for ng-repeat
    return Array(integer);
  }

  function checkTokenInsertion () {
    var items = [].slice.call($('.read-these'));
    var conditionals = [].slice.call($('.item-class-conditional'));
    var tokens = [].slice.call($('.read-these').children());
    if (items.length !== tokens.length) return false;
    return true;
      
  }

  function repeatFunc(func, interval) {
    var failure = "Goal not reached!";
    var success = "Level completed!";

    $scope.intervalId = setInterval(function () {
      $scope.isRunning = true;
      func();
      if ($scope.game.gameMessage === failure) {
        $scope.isRunning = false;
        window.clearInterval($scope.intervalId);
        $scope.reset();
        $scope.$digest();
        $scope.intervalId = null;
      }
      else if ($scope.game.gameMessage === success) {
        $scope.isRunning = false;
        window.clearInterval($scope.intervalId);
        $scope.intervalId = null;
      }
    }, interval);
  }

  $scope.repeatRun = function () {
    if (!$scope.isRunning && checkTokenInsertion()) $scope.isRunning = true;
    else {
      console.log("Please insert all tokens to continue");
      return;
    };
    repeatFunc($scope.run, RUN_INTERVAL);
  }

  $scope.pause = function () {
    window.clearInterval($scope.intervalId);
    $scope.isRunning = false;
    $scope.intervalId = null;
  }

  $scope.run = function () {
    var items = [].slice.call($('.read-these'));
    var conditionals = [].slice.call($('.item-class-conditional'));
    var tokens = [].slice.call($('.read-these').children());
    if (items.length !== tokens.length) {
      console.log("Please insert all tokens before clicking the Play button.");
    } else {
      $('.read-these').children().removeAttr('draggable');

      var current, currentNode, last, origin, destination, previousOrigin;

      items.forEach(function (item, index) {
        if (item.id.split('-')[0] === 'item') {
          $scope.game.scroll.items[index].color = tokens[index].style.backgroundColor;
        } else {
          if (tokens[index].firstChild.innerHTML) {
            $scope.game.scroll.items[index].condition = +tokens[index].firstChild.innerHTML;
          } else {
            $scope.game.scroll.items[index].condition = tokens[index].style.backgroundColor;
          }
        }
      });

      origin = $scope.game.scroll.pointer;
      let gemsCollected = $scope.game.map.gemsCollected;
      $scope.game.advance();
      if (gemsCollected !== $scope.game.map.gemsCollected) {
        var coin = document.getElementById('coin');
        coin.load();
        coin.play();
      }
      destination = $scope.game.scroll.pointer;
      animatePointer(origin, destination);
      animatePlayer();

      // experimental addition for player interaction
      // this is a terrible, idea, just hacked for visuals
      if ($scope.game.gameMessage === 'Level completed!') {
        $('#game-container').fadeOut('slow');
        $timeout(function () {
          $state.go('level', {
            levelNum: (Number($stateParams.levelNum)) + 1
          });
        }, 1000)
      }
    }
  };

  $scope.reset = function () {

    $scope.game.resetGame();
    setNodeCoordinates($scope.game.nodeCoords);
    // draws map connections
    drawMapConnections(getAllConnections($scope.game.map.nodes));
    setScrollCoordinates(scrollCoords);
    $scope.scrollItemConnections = getScrollCoordinates($scope.game.scroll);

    var items = [].slice.call($('.item-class'));
    items = items.concat([].slice.call($('.item-class-conditional')));
    items.forEach(function (item) {
      if (item.firstChild) item.removeChild(item.firstChild);
    });

    $scope.tokens = getTokens();
    $scope.conditionals = getConditionals();

    var pointer = $('#pointer');
    pointer.animate({
      top: ($scope.game.scroll.start.coords[1] - 15) + 'px',
      left: ($scope.game.scroll.start.coords[0] - 135) + 'px'
    });

  };

  // function initMap () { // lables nodes as start and end and applies styles with animations
  //   var startNode, endNode;

  //   startNode = document.getElementById('node-' + EvalFactory.map.current.id);
  //   endNode = document.getElementById('node-' + EvalFactory.map.end.id);
  // }

  // function checkState (stateString) {
  //   if $state.includes(stateString) return 'white';
  //   return null;
  // }

  // $scope.checkState = checkState;

  function animatePlayer() {
    var player = $('#player');
    var playerImg = $('#player-img');

    if ($scope.game.stepCounter >= 1 && $scope.game.validGame) {
      var destinationCoords = $scope.game.map.nodes[$scope.game.map.current.id].coords;
      player.css({
        top: (destinationCoords[1] + 26) + 'px',
        left: (destinationCoords[0] + 30) + 'px'
      });
      playerImg.animate({
        width: '400px'
      }, 200).animate({
        width: '70px'
      }, 200);
      var jump = document.getElementById('jump');
      jump.load();
      jump.play();
    } else if ($scope.game.stepCounter === 0) {
      var fanfare = document.getElementById('fanfare');
      fanfare.load();
      fanfare.play();
    } else if ($scope.game.gameMessage === 'Level completed!') {
      var warpPipe = document.getElementById('warp-pipe');
      warpPipe.load();
      warpPipe.play();
      playerImg.animate({
        width: '0px'
      });
    } else {
      var gameOver = document.getElementById('game-over');
      gameOver.load();
      gameOver.play();
      $scope.reset();
    }
  }

  function animatePointer(origin, destination) {
    var pointer = $('#pointer');
    // var pointer = document.getElementById('pointer');
    var positionKeyframes = [{
      motionOffset: '0%'
    }, {
      motionOffset: '100%'
    }];
    var positionTiming = {
      duration: 1000,
      iterations: 1
    };
    var originCoords, destinationCoords;
    if (origin.id === 'start') originCoords = $scope.game.scroll.start.coords;
    else if (origin.id === -1) originCoords = $scope.game.scroll.end.coords;
    else originCoords = $scope.game.scroll.items[origin.id].coords;
    if (destination.id === -1) destinationCoords = $scope.game.scroll.end.coords;
    else destinationCoords = $scope.game.scroll.items[destination.id].coords;

    //animate the dot
    // var motionPath = `M ${originCoords[0]}, ${originCoords[1]} L ${destinationCoords[0]}, ${destinationCoords[1]}`;
    // pointer.style.motionPath = `path("${motionPath}")`;
    // pointer.animate(positionKeyframes, positionTiming);
    pointer.animate({
      top: (destinationCoords[1] - 15) + 'px',
      left: (destinationCoords[0] - 135) + 'px'
    });
    // pointer.style.top = destinationCoords[1] + 'px';
    // pointer.style.left = destinationCoords[0] + 'px';
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
    }
    window.addEventListener("resize", resizeThrottler);
  })()
});