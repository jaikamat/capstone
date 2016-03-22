app.factory('ParametersFactory', function () {
    function Parameters (params) {      //{startNode: 4, endNode: 0, redTokens: 1, blueTokens: 2, greenTokens: 1, gems: [0, 5, 5], conditionals: ['orange', 2, 3] }
        this.startNode = params.startNode;
        this.endNode = params.endNode;
        this.redTokens = params.redTokens;
        this.greenTokens = params.greenTokens;
        this.blueTokens = params.blueTokens;
        this.gems = params.gems;
        this.conditionals = params.conditionals;   
    }

    Parameters.prototype.initBoard = function (map) {
        var self = this;
        //Set the start and end node.
        map.setCurrentAndEnd(self.startNode, self.endNode);
        //Set the node gems.
        this.gems.forEach(function (element) {
            map.setGems(element);
        });
    }

    var ParametersFactory = {
        createParameters: function (params) {
            return new Parameters(params);
        }
    };

    return ParametersFactory;
});
