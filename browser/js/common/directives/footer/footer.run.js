app.run(function ($state, $rootScope) {
  $rootScope.$state = $state;
});

// app.run(function ($rootScope) {
//   $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
//     $rootScope.containerClass = toState.containerClass;
//     console.log("RAN!")
//   });
// });