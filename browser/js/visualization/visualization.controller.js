app.controller('VisualizationCtrl', function ($scope, MapFactory, ParametersFactory, ScrollFactory) {
  
  console.log('Visualization Controller Initialized');

  var options = [{
      red: 1,
      green: 2,
      blue: 4
    },
    {
      red: 0,
      green: 3,
      blue: 2
    },
    {
      red: 5,
      green: 0,
      blue: 1
    },
    {
      red: 4,
      green: 1,
      blue: 5
    },
    {
      red: 3,
      green: 5,
      blue: 0
    },
    {
      red: 2,
      green: 4,
      blue: 3
    }];

  function getConnections (nodes) {
    var connections = [];

    for (var nodeId in nodes) {
      let node = nodes[nodeId];
      ['red', 'green', 'blue'].forEach(function (color) {
        if (node[color] !== null) {
          connections.push([+nodeId, node[color], color])
        }
      })
    }
    return connections
  }

  // this function takes coordinate inputs (with optional bezier curve anchor points)
  // to draw lines
  function drawSvgLine (x1, y1, x2, y2, color, bx1, by1, bx2, by2) {
    if (bx1 && bx2) {
      //<path d="M10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/>
      var newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      var attr = 'M' + x1 + " " + y1 + " C" + " " + bx1 + " " + by1 + ", " + bx2 + " " + by2 + ", " + x2 + " " + y2;
      newPath.setAttribute('d', attr);
      newPath.setAttribute('id','curved-routes');
      newPath.setAttribute('fill','transparent');
      newPath.setAttribute('stroke', color);
      newPath.setAttribute('stroke-width', 20);
      $("#lines").append(newPath);
    }
    else {
      var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      newLine.setAttribute('id','straight-routes');
      newLine.setAttribute('x1',x1);
      newLine.setAttribute('y1',y1);
      newLine.setAttribute('x2',x2);
      newLine.setAttribute('y2',y2);
      newLine.setAttribute('stroke', color);
      newLine.setAttribute('stroke-width', 20);
      $("#lines").append(newLine);
    }
  }

  var lastNode;
  function currentNodeStyle (color) {
    if (lastNode) lastNode.css('background-color', 'white')
    // this is the current node on the DOM
    $scope.board.step(color);
    var currentDOMnode = $scope.board.current.id;
    // this is the element we are isolating
    var element = $('#node' + currentDOMnode);
    // we then change the color to black 
    element.css('background-color', 'black');
    // and then move
    // now the current has changed
    lastNode = $('#node' + currentDOMnode)
    console.log($scope.board);
  }

  setTimeout(function () {
    currentNodeStyle('green')
  }, 1000)
  setTimeout(function () {
    currentNodeStyle('red')
  }, 2000)
  setTimeout(function () {
    currentNodeStyle('blue')
  }, 3000)
  setTimeout(function () {
    currentNodeStyle('green')
  }, 4000)
  setTimeout(function () {
    currentNodeStyle('green')
  }, 5000)
  setTimeout(function () {
    currentNodeStyle('green')
  }, 6000)
  setTimeout(function () {
    currentNodeStyle('red')
  }, 7000)

  $scope.board = MapFactory.createNewBoard(options);
  console.log('THE BOARD', $scope.board);
  $scope.connections = getConnections($scope.board.nodes);
  console.log('NODE CONNECTIONS', $scope.connections);
  $scope.board.setCurrentAndEnd(0,5);
  $scope.currentNodeStyle = currentNodeStyle;

  // width: 600px
  // height: 400px
  // TODO: set these to be percentage coordinates of the parent div pixel size
  $scope.board.nodes[0].coords = [100, 100];
  $scope.board.nodes[1].coords = [300, 100];
  $scope.board.nodes[2].coords = [500, 100];
  $scope.board.nodes[3].coords = [100, 300];
  $scope.board.nodes[4].coords = [300, 300];
  $scope.board.nodes[5].coords = [500, 300];

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
    var color = array[2]
    // console.log('NODE\n', array[0], array[1], 'COLOR\n', color)

    if (array[0] === 0 && array[1] === 2) {
      drawSvgLine(x1, y1, x2, y2, color, x1 + 20, y1 - 100, x2 - 20, y2 - 100)
    }
    else if (array[0] === 3 && array[1] === 5) {
      drawSvgLine(x1, y1, x2, y2, color, x1 + 20, y1 + 100, x2 - 20, y2 + 100)
    }
    else if (array[0] === 5 && array[1] === 3); // do nothing
    else if (array[0] === 2 && array[1] === 0); // do nothing
    else {
      drawSvgLine(x1, y1, x2, y2, color)
    }
  })

  // need to link up some of the back end functions with changing the DOM


});