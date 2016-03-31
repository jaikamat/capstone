app.config(function ($stateProvider) {

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'js/login/login.html',
    controller: 'LoginCtrl'
  });

  $stateProvider.state('signup', {
    url: '/signup',
    templateUrl: 'js/login/login.html',
    controller: 'LoginCtrl'
  });

});

app.controller('LoginCtrl', function ($scope, AuthService, $state) {
  $scope.isLogin = $state.current.name === 'login';
  $scope.login = {};
  $scope.error = null;

  $scope.sendLogin = function (loginInfo) {

    if ($scope.isLogin) {
      AuthService.login(loginInfo).then(function () {
        $state.go('home');
      }).catch(function () {
        $scope.error = 'Invalid login credentials.';
      });

      AuthService.getLoggedInUser()
          .then(function(user) {
            if(user) {
              $state.go('home')
            }
          })
    } else { //state is signup
      $scope.error = null;

      AuthService.signup(loginInfo).then(function (user) {
        $state.go('home');
      }).catch(function () {
        $scope.error = 'A user already exists for that email.'
      });
    }
  }
});
