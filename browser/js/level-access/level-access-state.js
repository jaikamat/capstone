app.config(function ($stateProvider) {
  $stateProvider.state('trialEnded', {
    url: '/endtrial',
    templateUrl: 'js/level-access/level-access-nonuser.html',
    controller: 'levelAccessCtrl'
  });
  $stateProvider.state('unauthorizedLevel', {
    url: '/unauthorizedlevel',
    templateUrl: 'js/level-access/level-access-user.html',
    controller: 'levelAccessCtrl'
  })
});
