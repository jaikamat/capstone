app.directive('footer', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/directives/footer/footer.directive.html',
  };
});