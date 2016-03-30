app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html'
    });

    $stateProvider.state('home.rules', {
        url: '/',
        templateUrl: 'js/home/home.rules.html'
    });
});