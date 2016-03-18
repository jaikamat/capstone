app.factory('ScrollFactory', function () {
    function Scroll () {
        this.instructions = {};
        this.currentInstruction = null;
    }

    Scroll.prototype.addInstruction = function (id, color) {
        var instruction = new Instruction(id, color);
        if(!this.currentInstruction) {
            this.currentInstruction = instruction;
        }
        else {
            this.currentInstruction.path1 = instruction;
        }
    }

    Scroll.prototype.addConditional = function (id, condition) {
        this.instructions[id].condition = condition;
    }

    Scroll.prototype.setColor = function (id, color) {
        this.instructions[id].color = color;
    }

    Scroll.prototype.proceed = function ()

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