app.factory('ScrollFactory', function () {
    function Scroll () {
        this.instructions = [];
        this.head;
    }

    Scroll.prototype.

    function Instruction (id, color) {
        this.id = id;
        this.color = color;
        this.next = null;
    }

    function Conditional (condition) {
        this.condition = condition;
        this.next = null;
        this.isFalse = null;
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




