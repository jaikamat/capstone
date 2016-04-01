app.config(function ($stateProvider) {
  $stateProvider.state('trialEnded', {
    url: '/endtrial',
    templateUrl: 'js/level-access/level-access-nonuser.html'
  });
  $stateProvider.state('unauthorizedLevel', {
    url: '/unauthorizedlevel',
    templateUrl: 'js/level-access/level-access-user.html'
  })
});
