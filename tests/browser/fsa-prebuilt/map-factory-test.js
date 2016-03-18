describe('MapFactory', function () {

  beforeEach(module('FullstackGeneratedApp'));

  var MapFactory;
  var level1;

  beforeEach('inject tools', inject(function (_MapFactory_) {
    MapFactory = _MapFactory_;
    level1 = new MapFactory.createNewBoard(6);
    var level2Obj = [{
      red: 2,
      green: 4,
      blue: 1
    }, {
      red: 5,
      green: 2,
      blue: 0
    }, {
      red: 0,
      green: 1,
      blue: 3
    }, {
      red: 4,
      green: 5,
      blue: 2
    }, {
      red: 3,
      green: 0,
      blue: 5
    }, {
      red: 1,
      green: 3,
      blue: 4
    }];
    level2 = new MapFactory.createNewBoard(level2Obj);
  }));

  describe('Board', function () {
    describe('constructor method', function () {
      it('should create an object', function () {
        expect(level1).to.be.an('object');
        expect(level2).to.be.an('object');
      });

      it('should create as many nodes as the constructor call specifies', function () {
        var counter = 0;
        Object.keys(level1.nodes).forEach(function (key) {
          counter++;
        });
        expect(counter).to.equal(6);

        counter = 0;
        Object.keys(level2.nodes).forEach(function (key) {
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
        expect(level2.nodes[0].red).to.equal(2);
        expect(level2.nodes[2].blue).to.equal(3);
        expect(level2.nodes[4].red).to.equal(3);
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

      describe('setCurrent method', function () {
        it('sets current correctly', function () {
          level1.setCurrent(5);
          expect(level1.current.id).to.equal(5);
        });
      });

      describe('step method', function () {
        it('steps forward', function () {
          level1.setCurrentAndEnd(5, 3);
          level1.step('red');
          level1.step('green');
          level1.step('red');
          level1.step('green');
          expect(level1.current.id).to.equal(3);
        });
      });

      describe('setGems method', function () {
        it('sets gems', function () {
          level2.setGems(0);
          expect(level2.nodes[0].gems).to.equal(1);
          level1.setGems(1, 2);
          expect(level1.nodes[1].gems).to.equal(2);
        });
      });

      describe('setTroll method', function () {
        it('sets trolls', function () {
          level1.setTroll(4, 'purple');
          expect(level1.nodes[4].purple).to.equal(true);
        });
      });
    });
  });

});
