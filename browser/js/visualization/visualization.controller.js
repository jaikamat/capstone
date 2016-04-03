app.controller('VisualizationCtrl', function ($scope, game, EvalFactory, UserStatsFactory, $location, $timeout, $state, $stateParams) {
  $scope.game = game;

  var NODE_WIDTH = 80;
  var TOKEN_WIDTH = 50;
  var RUN_INTERVAL = 1000;

  var scrollCoords = $scope.game.scrollCoords;
  $scope.getNumberForNgRepeat = getNumberForNgRepeat;

  setScrollCoordinates(scrollCoords);
  $scope.scrollItemConnections = getScrollCoordinates($scope.game.scroll);

  $scope.tokens = getTokens();
  $scope.conditionals = getConditionals();
  $scope.isRunning = false;
  $scope.intervalId = null;
  // this allows the SVG arrowheads to work, by exposing the absolute URL
  $scope.absUrl = $location.absUrl();
  $scope.repeatRun = repeatRun;
  $scope.reset = reset;
  $scope.run = run;
  $scope.pause = pause;
  $scope.checkConditionalsForNodeColor = checkConditionalsForNodeColor;

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
      var ncolor = singleConnection.color;
      if (nstart === nend) singleConnection.bidirectional = true; // TODO: for Jai to troubleshoot
      arrOfConnections.forEach(function (e, idx) {
        if (e.start === nstart && e.end === nend && nstart !== nend && e.color === ncolor) {
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
          var obj = {
            start: +nodeId,
            end: node[color],
            color: color,
            bidirectional: false
          }
          connections.push(obj);
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
  function drawSvgLine(x1, y1, x2, y2, color, dist, isUnidirectional) { // dist is the amount of curvature needed
    var attr, bx1, by1, bx2, by2;
    var newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var check = false;

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
    newPath.setAttribute('id', 'routes ' + attr);
    newPath.setAttribute('fill', 'transparent');
    newPath.setAttribute('stroke', color);
    newPath.setAttribute('stroke-width', 20);

    if (isUnidirectional) {
      var uniAttr = "";
      var baseUniAttrStart = "M " + x1 + " " + y1 + " ";
      var baseUniAttrEnd = " " + x2 + " " + y2;
      var totalLength = newPath.getTotalLength();
      var increment = 15;
      var queryString = '#routes' + attr;

      for (let i = 0; i < totalLength; i += increment) {
        let point = newPath.getPointAtLength(i);
        uniAttr += point.x + " " + point.y + " ";
      }

      newPath.setAttribute('d', baseUniAttrStart + uniAttr + baseUniAttrEnd);
      newPath.setAttribute('id', 'routes ' + attr);
      newPath.setAttribute('fill', 'transparent');
      newPath.setAttribute('stroke', '');
      newPath.setAttribute('stroke-width', '');
      newPath.setAttribute('marker-start', "url(" + $scope.absUrl + "#chevron-" + color + ")");
      newPath.setAttribute('marker-mid', "url(" + $scope.absUrl + "#chevron-" + color + ")");
      newPath.setAttribute('marker-end', "url(" + $scope.absUrl + "#chevron-" + color + ")");
    }

    $("#lines").append(newPath);
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

      if (!object.bidirectional) {
        if (object.curvature) drawSvgLine(x1, y1, x2, y2, color, object.curvature, true);
        else drawSvgLine(x1, y1, x2, y2, color, null, true);
      } else {
        if (object.curvature) drawSvgLine(x1, y1, x2, y2, color, object.curvature, false);
        else drawSvgLine(x1, y1, x2, y2, color, null, false);
      }
    });
  }

  function setNodeCoordinates(objOfNodeCoords) { //is invoked with an objOfNodeCoords ex. { 0: [0.5, 0.6], 1: [0.5, 0.6], 2: [0.5, 0.6] }
    var bW = document.getElementById('board').offsetWidth;
    var bH = document.getElementById('board').offsetHeight;
    for (var nodeCoords in objOfNodeCoords) {
      $scope.game.map.nodes[nodeCoords].coords = [bW * objOfNodeCoords[nodeCoords][0] - NODE_WIDTH / 2, bH * objOfNodeCoords[nodeCoords][1]];
    }
  }

  function createScrollCoordObj(source, destination, color, tokenWidth, arrowPosition) {
    var destination, P1, P2;
    P1 = 1 + arrowPosition;
    P2 = 1 - arrowPosition;

    return {
      x1: source.coords[0] + tokenWidth / 2,
      y1: source.coords[1] + tokenWidth / 2,
      x2: destination.coords[0] + tokenWidth / 2,
      y2: destination.coords[1] + tokenWidth / 2,
      x3: ((source.coords[0] + tokenWidth / 2) * P1 + (destination.coords[0] + tokenWidth / 2) * P2) / 2,
      y3: ((source.coords[1] + tokenWidth / 2) * P1 + (destination.coords[1] + tokenWidth / 2) * P2) / 2,
      color: color
    }
  };

  function getScrollCoordinates(scroll) { //takes in the $scope.scroll object
    var arrayOfItems = Object.keys(scroll.items).map(k => scroll.items[k]);
    var allItems = [scroll.start].concat(arrayOfItems).concat(scroll.end);

    var paths = [];
    for (let i = 0; i < allItems.length - 1; i++) {
      if (i === 0) {
        let afterStart = allItems[1];
        paths.push(createScrollCoordObj(allItems[i], afterStart, 'grey', TOKEN_WIDTH, 0.1));
      } else if (allItems[i].hasOwnProperty('next')) {
        let dest;
        dest = allItems[allItems[i].next] ? arrayOfItems[allItems[i].next] : allItems[i].next;
        paths.push(createScrollCoordObj(allItems[i], dest, 'grey', TOKEN_WIDTH, 0.1));
      } else if (allItems[i].hasOwnProperty('truePath')) {
        let trueDest, falseDest;
        trueDest = allItems[allItems[i].truePath] ? arrayOfItems[allItems[i].truePath] : allItems[i].truePath;
        falseDest = allItems[allItems[i].falsePath] ? arrayOfItems[allItems[i].falsePath] : allItems[i].falsePath;
        paths.push(createScrollCoordObj(allItems[i], trueDest, 'green', TOKEN_WIDTH, 0.1));
        paths.push(createScrollCoordObj(allItems[i], falseDest, 'red', TOKEN_WIDTH, 0.1));
      }
    }
    return paths;
  }

  function setScrollCoordinates(object) { //is invoked with an object of key id and value array { 0: [0.5, 0.6], 1: [0.5, 0.6], 2: [0.5, 0.6] }
    var sW = document.getElementById('scroll').offsetWidth;
    var sH = document.getElementById('scroll').offsetHeight;
    var calc = (param, w, h) => [w * object[param][0] - NODE_WIDTH / 2, h * object[param][1]]
    for (var key in object) {
      if (key === 'start' || key === 'end') {
        $scope.game.scroll[key].coords = calc(key, sW, sH);
      } else $scope.game.scroll.items[key].coords = calc(key, sW, sH);
    }
  }

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
        color = '#333333';
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

  function checkTokenInsertion() {
    var items = [].slice.call($('.read-these'));
    var tokens = [].slice.call($('.read-these').children());
    if (items.length !== tokens.length) return false;
    return true;
  }

  function repeatRun() {
    $scope.isRunning = true;
    $scope.intervalId = window.setInterval(function () {
      $scope.run();
      if ($scope.game.gameMessage === "Level completed!" || $scope.game.gameMessage === "Goal not reached!") {
        pause();
      }
      $scope.$digest();
    }, RUN_INTERVAL)
  }

  function pause() {
    window.clearInterval($scope.intervalId);
    $scope.isRunning = false;
    $scope.intervalId = null;
  }

  function run() {
    var items = [].slice.call($('.read-these'));
    items.sort(function (a, b) {
      var aId = a.id.split('-')[1];
      var bId = b.id.split('-')[1];
      return aId > bId;
    });
    var tokens = [].slice.call($('.read-these').children());
    if (items.length !== tokens.length) {
      var error = document.getElementById('error');
      error.load();
      error.play();
    } else {
      $('.read-these').children().removeAttr('draggable');

      var current, currentNode, last, origin, destination, previousOrigin;

      items.forEach(function (item, index) {
        if (item.id.split('-')[0] === 'item') {
          $scope.game.scroll.items[index].color = item.firstChild.style.backgroundColor;
        } else {
          if (item.firstChild.firstElementChild.innerHTML) {
            $scope.game.scroll.items[index].condition = +item.firstChild.firstElementChild.innerHTML;
          } else {
            $scope.game.scroll.items[index].condition = item.firstChild.style.backgroundColor;
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
      // this is a terrible idea, just hacked for visuals
      if ($scope.game.gameMessage === 'Level completed!') {
        $('#game-container').fadeOut('slow');
        UserStatsFactory.completeLevel(Number($stateParams.levelNum));
        $timeout(function () {
          $state.go('level', {
            levelNum: (Number($stateParams.levelNum)) + 1
          });
        }, 2200)
      }
    }
  };

  function reset() {
    var resetSound = document.getElementById('reset');
    resetSound.load();
    resetSound.play();
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
      top: ($scope.game.scroll.start.coords[1] - 20) + 'px',
      left: ($scope.game.scroll.start.coords[0] - 170) + 'px'
    });
  };

  function animatePlayer() {
    var player = $('#player');
    var playerImg = $('#player-img');
    var jump, fanfare, gameOver, win;

    if ($scope.game.stepCounter >= 1 && $scope.game.validGame) {
      var destinationCoords = $scope.game.map.nodes[$scope.game.map.current.id].coords;
      player.css({
        top: (destinationCoords[1] + 26) + 'px',
        left: (destinationCoords[0] + 30) + 'px'
      });
      playerImg.animate({
        width: '300px'
      }, 200).animate({
        width: '70px'
      }, 200);
      jump = document.getElementById('jump');
      jump.load();
      jump.play();
    } else if ($scope.game.stepCounter === 0) {
      fanfare = document.getElementById('fanfare');
      fanfare.load();
      fanfare.play();
    } else if ($scope.game.gameMessage === 'Level completed!') {
      win = document.getElementById('win');
      win.load();
      win.play();
      playerImg.animate({
        width: '0px'
      });
    } else {
      gameOver = document.getElementById('game-over');
      gameOver.load();
      gameOver.play();
      $scope.reset();
    }
  }

  function animatePointer(origin, destination) {
    var pointer = $('#pointer');
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

    pointer.animate({
      top: (destinationCoords[1] - 20) + 'px',
      left: (destinationCoords[0] - 170) + 'px'
    });
  }

  function checkConditionalsForNodeColor(scopeParams) {
    var listOfColors = [];
    var isString = false;
    scopeParams.forEach(function (scopeParam) {
      listOfColors.push(scopeParam);
    })
    listOfColors.forEach(function (element) {
      if (typeof element === "string") isString = true;
    })
    return isString;
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