'use strict';

app.factory('UserFactory', function($http, $log) {

  return {
    fetchById: function(id) {
      return $http.get('/users' + id)
          .then(function(response) {
            return response.data;
          })
          .catch($log.error);
    }
  }
});
