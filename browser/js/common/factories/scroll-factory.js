app.factory('ScrollFactory', function () {
    function Scroll (option) {
        this.items = {};
        this.start = new Start();
        this.end = new End();
        this.pointer = this.start;
    }

    Scroll.prototype.addInstruction = function (id) {
        this.items[id] = new Instruction(id);
    }

    Scroll.prototype.addConditional = function (id) {
        this.items[id] = new Conditional(id);
    }

    Scroll.prototype.setRoute = function (sourceId, str, destination) { // (3, "falsePath", 7)
        this.items[sourceId][str] = destination;
    }

    Scroll.prototype.setColor = function (id, color) {
        if ("color" in this.items[id]) this.items[id].color = color;
        else throw new Error("Cannot set color.")
    }

    Scroll.prototype.setCondition = function (id, condition) {
        if("condition" in this.items[id]) this.items[id].condition = condition;
        else throw new Error("Cannot set condition.")
    }

    Scroll.prototype.peek = function () {
        if (this.pointer.next.constructor === Instruction) {
            return this.pointer.next;
        }
        else if (this.pointer.next.id === "end") {

        }
    }

    Scroll.prototype.move = function () {
        //if this this.pointer.next === 



        this.pointer = this.pointer.next;
    }

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
        this.id = "end";
    }









    var ScrollFactory = {
        createScroll: function () {
            return new Scroll();
        },

        createInstruction: function (id, conditional, data) {
            return new Instruction (id, conditional, data)
        }
    };

    return ScrollFactory;
});




