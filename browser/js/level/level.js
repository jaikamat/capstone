app.config(function ($stateProvider) {
  $stateProvider.state('level', {
    cache: false,
    url: '/level/:levelNum',
    templateUrl: 'js/level/level.html',
    controller: 'VisualizationCtrl',
    resolve: {
      game: function (EvalFactory, $stateParams) {
        return EvalFactory.initializeGame($stateParams.levelNum)
          .then(function () {
            return EvalFactory;
          })
      }
    }
  });
});