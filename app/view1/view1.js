'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
          $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
          });
}])

.controller('View1Ctrl', ['$scope',function($scope) {
        var defaultCurrency=null;
        $scope.list = [];
        $scope.currency= defaultCurrency || "EUR";
        $scope.priorities = [
            {id:'1', label:'HIGH'},
            {id:'2', label:'MEDIUM'},
            {id:'3', label:'LOW'}
        ];

        var lastIndex=5;
        var updateList = function() {
            for (var i = $scope.list.length; i <= lastIndex; i++) {
                $scope.list.push({
                    'id': '_' + (i+1),
                    'text': 'element ' + (i+1)
                });
            }
        };
        updateList();
}]);