'use strict';

angular.module('myApp.view1', ['ngRoute'

])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'editRule'
        });
    }])
    .controller('editRule', ['$scope', function ($scope) {
        var defaultCurrency = null;
        $scope.data = {};
        $scope.list = [];
        $scope.currency = defaultCurrency || "EUR";
        $scope.priorities = [
            {id: '1', label: 'HIGH'},
            {id: '2', label: 'MEDIUM'},
            {id: '3', label: 'LOW'}
        ];
        $scope.signs = [
            {id: '1', label: '+'},
            {id: '2', label: '-'}
        ];
        $scope.data.operation=$scope.signs[0];

        $scope.variationTypes = [
            {id: '1', label: $scope.currency },
            {id: '2', label: '%'}
        ];
        $scope.data.percentage=$scope.variationTypes[0];


        var lastIndex = 5;
        var updateList = function () {
            for (var i = $scope.list.length; i <= lastIndex; i++) {
                $scope.list.push({
                    'id': '_' + (i + 1),
                    'text': 'element ' + (i + 1)
                });
            }
        };
        updateList();

        $scope.data.days = [];
        $scope.data.stayDays = [];
        $scope.daysList = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        $scope.checkAll = function () {
            $scope.data.days = $scope.daysList.map(function (item) {
                return item;
            });
        };
        $scope.uncheckAll = function () {
            $scope.data.days = [];
        };

        $scope.checkAllStay = function () {
            $scope.data.stayDays = $scope.daysList.map(function (item) {
                return item;
            });
        };
        $scope.uncheckAllStay = function () {
            $scope.data.stayDays = [];
        };


        $scope.data.countries = [];
        $scope.$watch('data.countries', function () {
            countriesListFillIn();
        });

        function countriesListFillIn() {
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


/*
        {
            "ticker": "TestName",
            "formula": "c1 && c2 && c3 && c4 && c5",
            "rulePriority": "LOW",
            "priceVariation": 55.5,
            "percentage": true,
            "stackable": false,
            "conditions": [
            {
                "days": [
                    "MONDAY",
                    "FRIDAY",
                    "TUESDAY"
                ],
                "id": 1,
                "conditionType": {
                    "CONTRACT": true,
                    "INCLUDE": true
                },
                "type": "WeekDayCondition"
            },
            {
                "start": "09:00:00.000",
                "end": "21:22:00.000",
                "timezone": "Europe/Madrid",
                "id": 2,
                "conditionType": {
                    "CONTRACT": true
                },
                "type": "HourRangeCondition"
            },
            {
                "dataValueHolderTickers": [
                    "stand_1a_SA_nr"
                ],
                "id": 3,
                "conditionType": {
                    "INCLUDE": true,
                    "EXACT": true
                },
                "type": "TickerCondition"
            },
            {
                "start": "2013-01-01T00:00:00.000+01:00",
                "end": "2014-01-01T00:00:00.000+01:00",
                "timezone": "Europe/Madrid",
                "id": 4,
                "conditionType": {
                    "STAY": true
                },
                "type": "DatetimeRangeCondition"
            },
            {
                "countries": [
                    "ES"
                ],
                "id": 5,
                "conditionType": {
                    "INCLUDE": true
                },
                "type": "CountryOfOriginCondition"
            }
        ],
            "order": 100
        }
*/

        //TimePicker
        $scope.data.timeto = new Date(0, 0, 0, 0, 0, 0, 0);
        $scope.data.timeuntil = new Date(0, 0, 0, 0, 0, 0, 0);
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