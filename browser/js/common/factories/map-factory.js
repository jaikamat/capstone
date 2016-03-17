app.factory('MapFactory', function () {
  function Node(id) {
    this.id = id;
    this.red = null;
    this.blue = null;
    this.green = null;
    this.gems = 0;
    this.orange = false;
    this.purple = false;
  }

  Node.prototype.setGems = function (number) {
    this.gems = number;
  };

  Node.prototype.setTroll = function (color) {
    this[color] = true;
  };

  function Board(option) {
    this.nodes = {};
    this.current = null;
    this.end = null;

    if (Array.isArray(option)) { //[{red: 1, green: 5, blue: 6}, {}]
      var self = this;
      // creates all nodes
      option.forEach(function (element, index) {
        self.addNode(index);
      });
      // assigns the connections to those created nodes
      option.forEach(function (element, index) {
        self.connect(index, element);
      });
    }

    Node.prototype.setTroll = function (color) {
      this[color] = true;
    }

    function Board(option) {
      this.nodes = {};
      this.current = null;
      this.end = null;

      if (Array.isArray(option)) { //[{red: 1, green: 5, blue: 6}, {}]
        var self = this;
        // creates all nodes
        option.forEach(function (element, index) {
            self.addNode(index);
          })
          // assigns the connections to those created nodes
        option.forEach(function (element, index) {
          self.connect(index, element);
        })
      }
      if (typeof option === 'number') {
        for (let i = 0; i < option; i++) {
          this.addNode(i);
        }
      }

      console.log('MADE A BOARD');
    }

    Board.prototype.setGems = function (nodeId, number) {
      var num = number || 1;
      this.nodes[nodeId].gems += num;
    }

    Board.prototype.addNode = function (nodeId) {
        this.nodes[nodeId] = new Node(nodeId);
        console.log('ADDED A NODE', this.nodes[nodeId]);
      }
      // console.log(nodeToConnect + " IS CONNECTED TO " + nodeToConnect.red, nodeToConnect.green, nodeToConnect.blue);
  };

  var MapFactory = {
    createNewBoard: function (n) {
      return new Board(n);
    },
    createNewNode: function (nodeId) {
      return new Node(nodeId);
    }
  };

  Board.prototype.step = function (color) {
    if (this.current[color] !== null) {
      this.setCurrent(this.current[color]);
      console.log("STEP SUCCEEDED, MOVED TO ", this.current.id);
    } else console.log("PATH DOES NOT EXIST");
  }

  Board.prototype.connect = function (nodeId, objectOfConnections) { //(3, {red: 1, green: 5, blue: 6})
    var nodeToConnect = this.nodes[nodeId];
    for (var key in objectOfConnections) {
      nodeToConnect[key] = objectOfConnections[key];
    };
    console.log(nodeToConnect + " IS CONNECTED TO " + nodeToConnect.red, nodeToConnect.green, nodeToConnect.blue);
  }

  var MapFactory = {
    createNewBoard: function () {
      return new Board();
    },
    createNewNode: function (nodeId) {
      return new Node(nodeId);
    }
  };

  return MapFactory;
});
