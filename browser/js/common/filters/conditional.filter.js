app.filter('items', function () {
    return function (item, constructor) {
        var result = {};
        var tester = constructor === 'Instruction' ? 'next' : 'truePath';
        angular.forEach(item, function (value, key) {
            if(value.hasOwnProperty(tester)){
                result[key] = value;
            }
        });
        return result;
    };
});