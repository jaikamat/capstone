app.config(function ($stateProvider) {
    $stateProvider.state('visualization', {
        url: '/visualization',
        templateUrl: 'js/visualization/visualization.html',
        controller: 'VisualizationCtrl',
        resolve: {
        	game: function (EvalFactory) {
        		return EvalFactory.initializeGame(1)
        		.then(function(){
        			return EvalFactory;
        		})
        	}
        }
    });
});