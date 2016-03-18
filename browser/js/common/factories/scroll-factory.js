app.factory('ScrollFactory', function () {
    function Scroll () {
        this.instructions = {};
        this.head;
    }

    Scroll.prototype.addInstruction = function (id, color) {
        this.instructions[id] = new Instruction(id, color);
    }

    Scroll.prototype.addConditional = function (id, condition) {
        this.instructions[id].condition = condition;
    }

    Scroll.prototype.setColor = function (id, color) {
        this.instructions[id].color = color;
    }

    function Instruction (id, color) {
        this.id = id;
        this.color = color || null;
        this.condition = null;
        this.path1 = null;
        this.path2 = null;
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




