'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
          $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'editRule'
          });
}])

.controller('editRule', ['$scope',function($scope) {
        $scope.data={};
        $scope.defaultcurrency="EUR";
        $scope.list = [];

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

        $scope.data.days = [];
        $scope.daysList = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
        $scope.checkAll = function() {
            $scope.data.days = $scope.daysList.map(function(item) { return item; });
        };
        $scope.uncheckAll = function() {
            $scope.data.days = [];
        };

        $scope.data.countries=[];
        $scope.$watch('data.countries', function() {
            countriesListFillIn();
        });

        function countriesListFillIn(){
            $scope.data.country = setMinus($scope.list, $scope.data.countries);
        }

        function setMinus(A, B) {
            var map = {}, C = [];

            for (var i = B.length; i--;) {
                map[B[i]] = null;
            }
            for (var i = A.length; i--;) {
                if (!map.hasOwnProperty(A[i].id))
                    C.push(A[i]);
            }
            return C;
        }


        //TimePicker
        $scope.data.timeto = new Date();
        $scope.data.timeuntil = new Date();

        $scope.data.timeto.setHours(-1,0,0,0);
        $scope.data.timeuntil.setHours(-1,0,0,0);

        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.ismeridian = true;
        //DatePicker
        $scope.dateOptions = {
            regional: 'es'
        };
        $scope.data.contractEntryDate = new Date();
        $scope.data.contractExitDate = new Date();
        $scope.data.contractExitDate.setMonth($scope.data.contractExitDate.getMonth() + 1);

        $scope.data.stayEntryDate = new Date();
        $scope.data.stayExitDate = new Date();
        $scope.data.stayExitDate.setMonth($scope.data.stayExitDate.getMonth() + 1);
}]);