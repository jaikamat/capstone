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
        console.dir("LEVEL 1 NODES: ", level1.nodes);
        expect([].slice.call(level1.nodes).length).to.be(6);
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
        expect(level1.nodes[0].red).to.be(1);
        expect(level1.nodes[2].blue).to.be(1);
        expect(level1.nodes[4].red).to.be(3);
      });
    });

    // describe('step method')
  });

});
