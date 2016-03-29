'use strict';

app.factory('UserStatsFactory', function($http) {
  return {
    fetchUserStatsByUserId: function(userId) {
      return $http.get('/api/user-stats/' + userId)
          .then(function(response) {
            return response.data;
          });
    }
  }
});
