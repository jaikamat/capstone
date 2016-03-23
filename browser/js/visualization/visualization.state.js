app.config(function ($stateProvider) {
    $stateProvider.state('visualization', {
        url: '/visualization',
        templateUrl: 'js/visualization/visualization.html',
        controller: 'VisualizationCtrl'
    });
});