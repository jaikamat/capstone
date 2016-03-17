app.factory('MapFactory', function () {
    function Board (option) {
        this.nodes = {};
        this.current = null;
        this.end = null;

        if (Array.isArray(option)) {  //[{red: 1, green: 5, blue: 6}, {}]
            var self = this;
            // creates all nodes
            option.forEach(function (element, index) {
                self.addNode(index);
            })
            // assigns the connections to those created nodes
            option.forEach(function (element, index) {
                self.connect(index, element)
            })
        }
        if (typeof option === 'number') {
            for (let i = 0; i < option; i++) {
                this.addNode(i);
            }
        }

        console.log('MADE A BOARD');
    }

    Board.prototype.addNode = function (nodeId) {
        this.nodes[nodeId] = new Node(nodeId);
        console.log('ADDED A NODE', this.nodes[nodeId])
    }

    Board.prototype.setCurrentAndEnd = function (currentId, endId) {
        this.current = this.nodes[currentId];
        if (endId) this.end = this.nodes[endId];
        console.log('SET CURRENT AND END', this.current, this.end)
    }

    Board.prototype.setCurrent = function (currentId) {
        this.current = this.nodes[currentId];
    }

    function Node (id) {
        this.id = id;
        this.red = null;
        this.blue = null;
        this.green = null;
        this.gems = 0;
        this.orange = false;  
        this.purple = false;  
    }

    Board.prototype.connect = function (nodeId, objectOfConnections) {   //(3, {red: 1, green: 5, blue: 6})
        var nodeToConnect = this.nodes[nodeId];
        for (var key in objectOfConnections) {
            nodeToConnect[key] = objectOfConnections[key];
        }
        console.log(nodeToConnect + " IS CONNECTED TO " + nodeToConnect.red, nodeToConnect.green, nodeToConnect.blue);
    }

    Node.prototype.setGems = function (number) {
        this.gems = number;
    }

    Node.prototype.setTroll = function (color) {
        this[color] = true;
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





for(var i = 0; i < 10; i++) {
    console.log(i)
}