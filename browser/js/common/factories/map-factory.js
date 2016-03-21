app.factory('MapFactory', function () {
    function Node (id) {
        this.id = id;
        this.red = null;
        this.blue = null;
        this.green = null;
        this.gems = 0;
        this.troll = null;   
    }

    function Board (option) {
        this.nodes = {};
        this.current = null;
        this.end = null;
        this.gemsCollected = 0;

        if (Array.isArray(option)) {  //[{red: 1, green: 5, blue: 6, troll: 'orange'}, {red: 2, green: 5, blue: 6}]
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
    }

    Board.prototype.setTroll = function (nodeId, color) {
        this.nodes[nodeId].troll = color;
    }

    Board.prototype.setGems = function (nodeId, number) {
        var num = number || 1;
        this.nodes[nodeId].gems += num;
    }

    Board.prototype.addNode = function (nodeId) {
        this.nodes[nodeId] = new Node(nodeId);
    }

    Board.prototype.setCurrentAndEnd = function (currentId, endId) {
        this.current = this.nodes[currentId];
        if (endId) this.end = this.nodes[endId];
    }

    Board.prototype.setCurrent = function (currentId) {
        this.current = this.nodes[currentId];
    }

    Board.prototype.step = function (color) {
        if (this.current[color] !== null) {
            this.setCurrent(this.current[color]);
            if (this.current.gems > 0) {
                this.gemsCollected++;
                this.current.gems--;
            }
        }
        else return null; //This is one of the things that can end the run
    }

    Board.prototype.connect = function (nodeId, objectOfConnections) {   //(3, {red: 1, green: 5, blue: 6, troll: 'orange'})
        var nodeToConnect = this.nodes[nodeId];
        for (var key in objectOfConnections) {
            nodeToConnect[key] = objectOfConnections[key];
        };
    }

    var MapFactory = {
        createNewBoard: function (option) {
            return new Board(option);
        },
        createNewNode: function (nodeId) {
            return new Node(nodeId);
        }
    };

    return MapFactory;
});