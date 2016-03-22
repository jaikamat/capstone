app.factory('ParametersFactory', function () {
    function Parameters (params) {      //{startNode: 4, endNode: 0, redTokens: 1, blueTokens: 2, greenTokens: 1, gems: [0, 5, 5], conditionals: ['orange', 2, 3] }
        if (params) {
            this.startNode = params.startNode;
            this.endNode = params.endNode;
            this.redTokens = params.redTokens;
            this.greenTokens = params.greenTokens;
            this.blueTokens = params.blueTokens;
            this.gems = params.gems;
            this.conditionals = params.conditionals;   
        }
        else {
            this.startNode = null;
            this.endNode = null;
            this.redTokens = 0;
            this.greenTokens = 0;
            this.blueTokens = 0;
            this.gems = [];
            this.conditionals = [];  
        }
    };

    Parameters.prototype.defineStartAndEnd = function (startId, endId) {
        this.startNode = startId;
        this.endNode = endId;
    };

    Parameters.prototype.addTokens = function (objOfTokenCount) {   // {redTokens: 2, blueTokens: 4, greenTokens: 1}
        for (var key in objOfTokenCount) {
            this[key] += objOfTokenCount[key];
        };
    };

    Parameters.prototype.addGems = function (gemsArray) { // [4, 3, 3]
        this.gems.concat(gemsArray);
    };

    Parameters.prototype.addConditionals = function (conditionalArray) {
        this.conditionals.concat(conditionalArray);
    };

    Parameters.prototype.initBoard = function (map) {
        var self = this;
        //Set the start and end node.
        map.setCurrentAndEnd(self.startNode, self.endNode);
        //Set the node gems.
        this.gems.forEach(function (element) {
            map.setGems(element);
        });
    };

    var ParametersFactory = {
        createParameters: function (params) {
            return new Parameters(params);
        }
    };

    return ParametersFactory;
});
