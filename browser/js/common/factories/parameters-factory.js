app.factory('ParametersFactory', function () {
    function Parameters (startNode, endNode, redTokens, greenTokens, blueTokens, gemsArray) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.redTokens = redTokens;
        this.greenTokens = greenTokens;
        this.blueTokens = blueTokens;
        this.gemsArray = gemsArray;    
    }

    Parameters.prototype.initBoard = function (board) {
        // where board is a valid Board object
        var self = this;
        board.setCurrentAndEnd(self.startNode, self.endNode);
        this.gemsArray.forEach(function (element) {
            self.setGems(element);
        });
    }

    Parameters.prototype.initScroll = function (scroll) {
        // where scroll is a valid Scroll object
        var self = this;
        board.setCurrentAndEnd(self.startNode, self.endNode);
        this.gemsArray.forEach(function (element) {
            self.setGems(element);
        });
    }

    var ParametersFactory = {
        createParameters: function (startNode, endNode, redTokens, greenTokens, blueTokens, gemsArray) {
            return new Parameters(startNode, endNode, redTokens, greenTokens, blueTokens, gemsArray);
        }
    };

    return ParametersFactory;
});




