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
    .controller('editRule', ['$scope','$filter','COUNTRIES','CONDITION_TYPE', 'CONDITION_CLASS','DATE_TIME_FORMAT',
        function ($scope,$filter,COUNTRIES,CONDITION_TYPE,CONDITION_CLASS,DATE_TIME_FORMAT) {
        var defaultCurrency = null;
        $scope.data = {conditions:[]};
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

        /********************* COUNTRIES CONDITION GETTER SETTER***************************************/
/*
        "id": 5,
        "conditionType": {
            "INCLUDE": true
        },
        "countries": [
            "ES"
        ],
        "type": "CountryOfOriginCondition"
*/

        $scope.countries=COUNTRIES;

        function setMinus(A, B) {
            var map = {}, C = [];

            for (var i = B.length; i--;) {
                map[B[i]] = null;
            }
            for (var i = A.length; i--;) {
                if (!map.hasOwnProperty(A[i].id))
                    C.push(A[i].id);
            }
            return C;
        }

        function getIncludedCountries() {
            return setMinus(COUNTRIES, $scope.excludedCountries);
        }

        var _countryCondition={
            id:null,
            conditionType:{},
            type:CONDITION_CLASS.COUNTRY_OF_ORIGIN,
            countries:[]
        };
        _countryCondition.conditionType[CONDITION_TYPE.ALL] = true;
        $scope.$watch("excludedCountries.length",function(newValue,oldValue){
            if(oldValue===newValue){return;}
            var excludedCountries=$scope.excludedCountries;
            if (angular.isDefined(excludedCountries)) {
                if (excludedCountries.length===COUNTRIES.length){
                    $scope.bookingPriceRuleForm.excludedCountries.$setValidity("ALL_EXCLUDED", false);
                }else if(excludedCountries.length>COUNTRIES.length/2){
                    _countryCondition.conditionType={};
                    _countryCondition.conditionType[CONDITION_TYPE.INCLUDE] = true;
                    _countryCondition.countries=getIncludedCountries();
                }else if(excludedCountries.length===0){
                    _countryCondition.conditionType={};
                    _countryCondition.conditionType[CONDITION_TYPE.ALL] = true;
                }else{
                    _countryCondition.conditionType={};
                    _countryCondition.conditionType[CONDITION_TYPE.EXCLUDE] = true;
                    _countryCondition.countries=excludedCountries;
                }
            }
        });

        $scope.data.conditions.push(_countryCondition);


        /******************END COUNTRIES CONDITION GETTER SETTER***************************************/

        /********************* CONTRACT_DATE CONDITION GETTER SETTER***************************************/
        /*
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
         $scope.toggle = function($event) {
         $event.preventDefault();
         $event.stopPropagation();

         $scope.contractEntryDateOpen = true;
         };

         */

        $scope.toggle = function($event,element) {
            if(typeof $scope.datePickerStatus ==="undefined"){ $scope.datePickerStatus={} };
            if(typeof $scope.datePickerStatus[element] ==="undefined"){ $scope.datePickerStatus[element]=false};
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datePickerStatus[element]=!$scope.datePickerStatus[element];
            angular.element('#'+element).datepicker($scope.datePickerStatus[element] ? 'show' : 'hide')
        };

        var _contractDateTimeRangeCondition={
            id:null,
            start:null,
            end:null,
            timezone:null,
            conditionType:{},
            type:CONDITION_CLASS.DatetimeRangeCondition
        };
        _contractDateTimeRangeCondition.conditionType[CONDITION_TYPE.CONTRACT] = true;
        var _contractEntryDate;
        $scope.$watch("contractEntryDate",function(newValue,oldValue){
            if(oldValue===newValue){return;}
            if (angular.isDefined(newValue)) {
                _contractEntryDate=newValue;
            }else{
                _contractEntryDate=null;
            }
            _contractDateTimeRangeCondition.start = moment(_contractEntryDate).utc().format(DATE_TIME_FORMAT) || null;
        });

        var _contractExitDate;
        $scope.$watch("contractExitDate",function(newValue,oldValue){
            if(oldValue===newValue){return;}
            if (angular.isDefined(newValue)) {
                _contractExitDate=newValue;
            }else{
                _contractExitDate=null;
            }
            _contractDateTimeRangeCondition.end = moment(_contractExitDate).utc().format(DATE_TIME_FORMAT) || null;
        });

        $scope.data.conditions.push(_contractDateTimeRangeCondition);
        /******************END CONTRACT_DATE CONDITION GETTER SETTER***************************************/

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
