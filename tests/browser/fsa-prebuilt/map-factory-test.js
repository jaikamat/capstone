describe('MapFactory', function () {

  beforeEach(module('FullstackGeneratedApp'));

  var MapFactory;
  var level1;

  beforeEach('inject tools', inject(function (_MapFactory_) {
    MapFactory = _MapFactory_;
    level1 = new MapFactory.Board(6);
  }));

  describe('Board', function () {
    describe('constructor', function () {
      it('should be an object', function () {
        expect(level1).to.be.an('object');
      });

      it('should have as many nodes as the constructor call specifies', function () {
        expect(level1.nodes.length).to.be(6);
      });
    });

    describe('connect method', function () {
      it('connects nodes properly', function () {
        level1.connect(0, 1, 'red');
        level1.connect(0, 2, 'green');
        level1.connect(0, 4, 'blue');
        level1.connect(1, 0, 'red');
        level1.connect(1, 3, 'green');
        level1.connect(1, 2, 'blue');
        level1.connect(2, 5, 'red');
        level1.connect(2, 0, 'green');
        level1.connect(2, 1, 'blue');
        level1.connect(3, 4, 'red');
        level1.connect(3, 1, 'green');
        level1.connect(3, 5, 'blue');
        level1.connect(4, 3, 'red');
        level1.connect(4, 5, 'green');
        level1.connect(4, 0, 'blue');
        level1.connect(5, 2, 'red');
        level1.connect(5, 4, 'green');
        level1.connect(5, 3, 'blue');
        expect(level1.nodes[0].red).to.be(1);
        expect(level1.nodes[2].blue).to.be(1);
        expect(level1.nodes[4].red).to.be(3);
      });
    });

    describe('step method')
  });

});
