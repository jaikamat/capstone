describe('MapFactory', function () {

  beforeEach(module('FullstackGeneratedApp'));

  var MapFactory;
  var level1;

  beforeEach('inject tools', inject(function (_MapFactory_) {
    MapFactory = _MapFactory_;
    level1 = new MapFactory.createNewBoard(6);
  }));

  describe('Board', function () {
    describe('constructor method', function () {
      it('should be an object', function () {
        expect(level1).to.be.an('object');
      });

      it('should have as many nodes as the constructor call specifies', function () {
        var counter = 0;
        Object.keys(level1.nodes).forEach(function (key) {
          counter++;
        });
        expect(counter).to.equal(6);
      });
    });

    describe('connect method', function () {
      it('connects nodes properly', function () {
        level1.connect(0, {
          red: 1,
          green: 2,
          blue: 4
        });
        level1.connect(1, {
          red: 0,
          green: 3,
          blue: 2
        });
        level1.connect(2, {
          red: 5,
          green: 0,
          blue: 1
        });
        level1.connect(3, {
          red: 4,
          green: 1,
          blue: 5
        });
        level1.connect(4, {
          red: 3,
          green: 5,
          blue: 0
        });
        level1.connect(5, {
          red: 2,
          green: 4,
          blue: 3
        });
        expect(level1.nodes[0].red).to.equal(1);
        expect(level1.nodes[2].blue).to.equal(1);
        expect(level1.nodes[4].red).to.equal(3);
      });
    });

    describe('other methods', function () {
      beforeEach('connect board', function () {
        level1.connect(0, {
          red: 1,
          green: 2,
          blue: 4
        });
        level1.connect(1, {
          red: 0,
          green: 3,
          blue: 2
        });
        level1.connect(2, {
          red: 5,
          green: 0,
          blue: 1
        });
        level1.connect(3, {
          red: 4,
          green: 1,
          blue: 5
        });
        level1.connect(4, {
          red: 3,
          green: 5,
          blue: 0
        });
        level1.connect(5, {
          red: 2,
          green: 4,
          blue: 3
        });
      });

      describe('setCurrentAndEnd method', function () {
        it('sets current and end correctly', function () {
          level1.setCurrentAndEnd(5, 3);
          expect(level1.current.id).to.equal(5);
          expect(level1.end.id).to.equal(3);
        });
      });

      describe('setCurrent', function () {
        it('sets current correctly', function () {
          level1.setCurrent(5);
          expect(level1.current.id).to.equal(5);
        });
      });

      describe('step', function () {
        it('steps forward', function () {
          level1.setCurrentAndEnd(5, 3);
          console.log(level1.current.id);
          console.log(level1.current);
          level1.step('red');
          console.log(level1.current.id);
          console.log(level1.current);
          level1.step('green');
          console.log(level1.current.id);
          level1.step('red');
          console.log(level1.current.id);
          level1.step('green');
          console.log(level1.current.id);
          expect(level1.current.id).to.equal(3);
        });
      });
    });
  });

});
