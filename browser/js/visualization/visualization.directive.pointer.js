app.directive('pointer', function () {
  return {
    restrict: 'E',
    template: '<circle r="100" cx="500" cy="500" fill="orange"><animateMotion dur="5s" repeatCount="indefinite"><mpath xlink:href="#scroll-path-0"/></animateMotion></circle>'
  };
});