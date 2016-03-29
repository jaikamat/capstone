app.config(function ($stateProvider) {
  $stateProvider.state('level-select', {
    url: '/level-select/:userId',
    templateUrl: 'js/level-select/level-select.html',
    controller: 'LevelSelectCtrl',
    resolve: {
      userStats: function(UserStatsFactory, $stateParams) {
        return UserStatsFactory.fetchUserStatsByUserId($stateParams.userId);
      }
    }
  });
});
