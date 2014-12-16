'use strict';

angular.module('myApp.view1', ['ngRoute'

])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/bookingPriceRule/new', {
                templateUrl: 'bookingPriceRule/bookingPriceRule.html',
                controller: 'editRule'
            })
            .when('/bookingPriceRule/list', {
                templateUrl: 'bookingPriceRule/bookingPriceRuleList.html',
                controller: 'BookingPriceRuleListController'
            })
            .when('/bookingPriceRule/:id', {
                templateUrl: 'bookingPriceRule/bookingPriceRule.html',
                controller: 'editRule'
            })
    }])
    .controller('editRule', ['$scope','COUNTRIES', function ($scope,COUNTRIES) {
        var defaultCurrency = null;
        $scope.data = {};
        $scope.list = [];

        $scope.currency = defaultCurrency || "EUR";

        $scope.priorities = [
            {id: '1', label: 'HIGH'},
            {id: '2', label: 'MEDIUM'},
            {id: '3', label: 'LOW'}
        ];

        /****************** PRICEVARIATION GETTER SETTER***************************************/
        $scope.data.priceVariation = 0;
        $scope.priceVariation = function (newPriceVariation) {
            if (angular.isDefined(newPriceVariation)) {
                var sign = $scope.sign().id === "POSITIVE" ? 1 : -1;
                $scope.data.priceVariation =  Math.abs(newPriceVariation) * sign;
            }else{
                newPriceVariation=Math.abs($scope.data.priceVariation);
            }
            return newPriceVariation;
        };
        /******************END PRICEVARIATION GETTER SETTER************************************/


        /********************* SIGN GETTER SETTER***************************************/
        $scope.signs = [
            {id: 'POSITIVE', label: '+'},
            {id: 'NEGATIVE', label: '-'}
        ];
        var _sign=$scope.signs[0];
        $scope.sign = function (newValue) {
            if (angular.isDefined(newValue)) {
                _sign=newValue;
                var sign = newValue.id === "POSITIVE" ? 1 : -1;
                $scope.data.priceVariation =  Math.abs($scope.data.priceVariation) * sign;
            }
            return _sign;
        };
        /******************END PERCENTAGE GETTER SETTER***************************************/



        /**********************PERCENTAGE GETTER SETTER***************************************/
        $scope.variationTypes = [
            {id: 'AMOUNT', label: $scope.currency },
            {id: 'PERCENT', label: '%'}
        ];
        var _percentage=$scope.variationTypes[0];
        $scope.percentage = function (newValue) {
            if (angular.isDefined(newValue)) {
                _percentage=newValue;
            }
            $scope.data.percentage = _percentage.id === "PERCENT";
            return _percentage;
        };
        /******************END PERCENTAGE GETTER SETTER***************************************/




        $scope.countries=COUNTRIES;
        $scope.data.countries = [];

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
    }])
    .controller('BookingPriceRuleListController', ['$scope', 'BookingPriceRuleManager','$modal', function($scope, BookingPriceRuleManager,$modal) {
        var establishmentTicker="hoteldemo.com.v6";

        $scope.sortableOptions = {
            stop: function(e, ui) {
                var totalRules=$scope.bookingPriceRules.length;
                for (var index in $scope.bookingPriceRules) {
                    var newOrder=totalRules-parseInt(index);
                    $scope.bookingPriceRules[index].order = newOrder*100;
                }
            }
        };

        $scope.deleteRule = function(bookingPriceRule,index){
            var ModalInstanceCtrl = ['$scope','$modalInstance',function ($scope, $modalInstance) {
                $scope.ok = function () {
                    $modalInstance.close();
                };
                $scope.cancel = function () {
                    $modalInstance.close();
                };

            }];

            var modalInstance = $modal.open({
                templateUrl: 'bookingPriceRuleDeleteModal.html',
                controller: ModalInstanceCtrl
            });

            modalInstance.result.then(function () {
                BookingPriceRuleManager.delete(establishmentTicker,bookingPriceRule);
                $scope.bookingPriceRules.splice(index, 1);
            }, function () {

            });
        };
        $scope.rulesMap=BookingPriceRuleManager._pool;

        BookingPriceRuleManager.get(establishmentTicker).then(function(bookingPriceRules) {
            bookingPriceRules.sort(function (a, b) {
                return a.order < b.order;
            });
            $scope.bookingPriceRules = bookingPriceRules;
        });


    }]);

/*
{
    "operation": {
    "id": "1",
        "label": "+"
},
    "percentage": {
    "id": "1",
        "label": "EUR"
},
    "days": [],
    "stayDays": [],
    "countries": [],
    "timeto": "1899-12-30T23:00:00.000Z",
    "timeuntil": "1899-12-30T23:00:00.000Z",
    "contractEntryDate": "2014-12-16T07:10:59.370Z",
    "contractExitDate": "2015-01-16T07:10:59.370Z",
    "stayEntryDate": "2014-12-16T07:10:59.370Z",
    "stayExitDate": "2015-01-16T07:10:59.370Z",
    "country": [
    {
        "id": "_6",
        "text": "element 6"
    },
    {
        "id": "_5",
        "text": "element 5"
    },
    {
        "id": "_4",
        "text": "element 4"
    },
    {
        "id": "_3",
        "text": "element 3"
    },
    {
        "id": "_2",
        "text": "element 2"
    },
    {
        "id": "_1",
        "text": "element 1"
    }
]
}
    */
