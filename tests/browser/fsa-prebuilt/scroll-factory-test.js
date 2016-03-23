describe('ScrollFactory', function () {

  beforeEach(module('FullstackGeneratedApp'));

  var ScrollFactory;
  var scroll1;

  beforeEach('inject tools', inject(function (_ScrollFactory_) {
    ScrollFactory = _ScrollFactory_;
    scroll1 = ScrollFactory.createScroll();

  }));

  describe('Scroll', function () {
    describe('constructor function', function () {
      it('should create an object', function () {
        expect(scroll1).to.be.an('object');
      });
      it('should instantiate a Start item', function () {
        expect(scroll1.start).to.be.an('object');
        expect(scroll1.start.id).to.equal('start');
      });
      it('should instantiate an End item', function () {
        expect(scroll1.end).to.be.an('object');
        expect(scroll1.end.id).to.equal(-1);
      });
      it('should instantiate an Items object', function () {
        expect(scroll1.items).to.be.an('object');
      });
      it('should have a Pointer that initially points to Start', function () {
        expect(scroll1.pointer.id).to.equal('start');
      });
    });

    describe('addInstruction method', function () {
      it('should add instructions to the scroll', function () {
        scroll1.addInstruction(0);
        scroll1.addInstruction(1);
        scroll1.addInstruction(2);
        scroll1.addInstruction(3);
        var counter = 0;
        Object.keys(scroll1.items).forEach(function (key) {
          counter++;
        });
        expect(counter).to.equal(4);
      });
    });

    describe('addConditional method', function () {
      it('should add conditions to the scroll', function () {
        scroll1.addConditional(0);
        scroll1.addConditional(1);
        scroll1.addConditional(2);
        scroll1.addConditional(3);
        var counter = 0;
        Object.keys(scroll1.items).forEach(function (key) {
          counter++;
        });
        expect(counter).to.equal(4);
      });
    });

    describe('setColor method', function () {
      it('should set the color of an instruction', function () {
        scroll1.addInstruction(0);
        scroll1.setColor(0, 'red');
        expect(scroll1.items[0].color).to.equal('red');
      });
      it('should throw an error if called on a condition', function () {
        scroll1.addConditional(0);
        assert.throws(function () {
          scroll1.setColor('0, red');
        }, Error);
      });
    });

    describe('setCondition method', function () {
      it('should set the condition of, well, a condition', function () {
        scroll1.addConditional(0);
        scroll1.setCondition(0, 'purple');
        expect(scroll1.items[0].condition).to.equal('purple');
        scroll1.addConditional(1);
        scroll1.setCondition(1, 2);
        expect(scroll1.items[1].condition).to.equal(2);
      });
    });

    describe('setRoute method', function () {
      it('should connect a scroll', function () {
        var scroll10 = ScrollFactory.createScroll();
        scroll10.addInstruction(0);
        scroll10.addInstruction(1);
        scroll10.addInstruction(2);
        scroll10.addInstruction(3);
        scroll10.addConditional(4);
        scroll10.setRoute('start', {
          next: 0
        });
        scroll10.pointer = scroll10.items[scroll10.pointer.next];
        scroll10.setRoute(0, {
          next: 1
        });
        scroll10.pointer = scroll10.items[scroll10.pointer.next];
        scroll10.setRoute(1, {
          next: 2
        });
        scroll10.pointer = scroll10.items[scroll10.pointer.next];
        scroll10.setRoute(2, {
          next: 3
        });
        scroll10.pointer = scroll10.items[scroll10.pointer.next];
        scroll10.setRoute(3, {
          next: 4
        });
        scroll10.pointer = scroll10.items[scroll10.pointer.next];
        scroll10.setRoute(4, {truePath: -1, falsePath: 0});
        scroll10.pointer = scroll10.pointer.truePath;
        expect(scroll10.pointer.id).to.equal(-1);
      });
    });
  });

});