'use strict';

app.controller('LevelSelectCtrl', function($scope, userStats) {
  var levelStats = userStats.levelStats;

  var numBeginnerComplete = 0;
  var numIntermediateComplete = 0;
  var numAdvancedComplete = 0;
  var numExpertComplete = 0;

  var numLevelsPerDifficulty = levelStats.length / 4;
  for (var i = 0; i < levelStats.length; i++) {
    var levelStat = levelStats[i];
      if (levelStat.levelId <= numLevelsPerDifficulty) {
        numBeginnerComplete += levelStat.completed ? 1 : 0;
        levelStat.difficulty = 'beginner';
      } else if (levelStat.levelId <= numLevelsPerDifficulty * 2) {
        numIntermediateComplete += levelStat.completed ? 1 : 0;
        levelStat.difficulty = 'intermediate';
      } else if (levelStat.levelId <= numLevelsPerDifficulty * 3) {
        numAdvancedComplete += levelStat.completed ? 1 : 0;
        levelStat.difficulty = 'advanced';
      } else {
        numExpertComplete += levelStat.completed ? 1 : 0;
        levelStat.difficulty = 'expert';
      }
  }

  $scope.levelStats = levelStats;

  $scope.difficultyLevelModels = [
    {
      difficulty: 'Beginner',
      numComplete: numBeginnerComplete,
      numLevels: numLevelsPerDifficulty,
      fontColor: 'lime'
    },
    {
      difficulty: 'Intermediate',
      numComplete: numIntermediateComplete,
      numLevels: numLevelsPerDifficulty,
      fontColor: 'yellow'
    },
    {
      difficulty: 'Advanced',
      numComplete: numAdvancedComplete,
      numLevels: numLevelsPerDifficulty,
      fontColor: 'orange'
    },
    {
      difficulty: 'Expert',
      numComplete: numExpertComplete,
      numLevels: numLevelsPerDifficulty,
      fontColor: 'red'
    }
  ];

});


