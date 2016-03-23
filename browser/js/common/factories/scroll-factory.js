//[{itemType: 'i', conn: {next: 1}}, {itemType: 'c', conn:{truePath: 2, falsePath: 4}}, {itemType: 'i', conn: {next: 3}}, {itemType: 'i', conn:{next: -1}}, {itemType: 'i', conn:{next: 0}}]

/*
  A scroll initializes an empty object of items,
  a start and end node, and a current pointer
  is set to point at the start node.

  If a seed option is passed to the constructor,
  it will iterate through to generate all the items.
  Each item in the option array is expected to be given
  an item type of 'i' for instruction, or 'c' for
  conditional. Each item also has an item conn which is
  an object that defines that items connection nodes.

*/

app.factory('ScrollFactory', function () {

    function Instruction (id) {
        this.id = id;
        this.color = null;
        this.next = null;
    }

    function Conditional (id) {
        this.id = id;
        this.truePath = null;
        this.falsePath = null;
        this.condition = null;
    }

    function Start () {
        this.id = "start";
        this.next = null;
    }

    function End () {
        this.id = -1;
    }

    function Scroll (option) {
        this.items = {};
        this.start = new Start();
        this.end = new End();
        this.pointer = this.start;

        //If the seed option is given
        if (option) {
            var self = this;
            //Create all the elements
            option.forEach(function (element, index) {
                if (element.itemType === 'i') self.addInstruction(index);
                else self.addConditional(index);
            });
            //Create all the connections
            option.forEach(function (element, index) {
                self.setRoute(index, element.conn);
            });
            this.setStart('0');
        }
    }

    //Creates a new instruction in the items with an id
    Scroll.prototype.addInstruction = function (id) {
        this.items[id] = new Instruction(id);
    };

    //Creates a new conditional in the items with an id
    Scroll.prototype.addConditional = function (id) {
        this.items[id] = new Conditional(id);
    }

    //Expects a source id and an object of the connections
    Scroll.prototype.setRoute = function (sourceId, objectOfConnections) {                 // (3, {falsePath: 6, truePath: 7})
        if(sourceId === 'start') {this.start.next = objectOfConnections.next}
        else {
            var itemToConnect = this.items[sourceId];
            for (var key in objectOfConnections) {
                if (objectOfConnections[key] === -1) itemToConnect[key] = this.end;        // If the connection is the end connect the 'end' node.
                else itemToConnect[key] = objectOfConnections[key];                        // Else connect the node.
            };
        }
    };

    //Manually allows a user to change the starting node.
    Scroll.prototype.setStart = function (sourceId) {
        this.start.next = this.items[sourceId];
    };

    //Manually allows a user to change the ending node.
    Scroll.prototype.setEnd = function (sourceId) {
        this.items[sourceId].next = this.end;
    };

    Scroll.prototype.setColor = function (id, color) {                                    // (3, {color: 'red'})
        if ("color" in this.items[id]) this.items[id].color = color;
        else throw new Error("Cannot set color.");
    };

    Scroll.prototype.setCondition = function (id, condition) {                            // (3, {condition: 4}) or (5, {condition: 'orange'})
        if ("condition" in this.items[id]) this.items[id].condition = condition;
        else throw new Error("Cannot set condition.");
    };

    Scroll.prototype.removeData = function(id) {
        if ("color" in this.items[id]) this.items[id].color = null;
        else this.items[id].condition = null;
    }

    Scroll.prototype.getData = function (gameData) {
        if (this.pointer.id === "start") this.pointer = this.items[this.pointer.next];    //If the pointer is at start, move the pointer.
        if (this.pointer.constructor === Conditional) this.move(gameData);                //If you are then currently on a conditional, execute move
        if (this.pointer.constructor === Instruction) {                                   //If you are then currently on an Instruction,
            var data = this.pointer.color;                                                //Store the pointer data
            this.move();                                                                  //Move the pointer
            return data;                                                                  //Send the data
        }
        if (this.pointer.id === -1) {                                                     //If the node were on is the end
            return null;                                                                  //Notify that the game is over
        }
        else {
            this.getData(gameData);                                                       //We must have hit 2 conditionals, run this again.
        }
    };

    Scroll.prototype.move = function (gameData) {                                         //{trollStatus: 'orange', gemsCollected: 2}
        if (!gameData) this.pointer = this.items[this.pointer.next];
        else {
            if (gameData.trollStatus === this.pointer.condition || gameData.gemsCollected === this.pointer.condtion) {
                this.pointer = this.items[this.pointer.truePath];                         //move to True Path
            }
            else {
                this.pointer = this.items[this.pointer.falsePath];                        //move to False Path
            }
        }
    };

    var ScrollFactory = {
        createScroll: function (option) {
            return new Scroll(option);
        },

        createInstruction: function (id) {
            return new Instruction (id);
        },

        createConditional: function(id) {
            return new Conditional(id);
        }
    };

    return ScrollFactory;
});
