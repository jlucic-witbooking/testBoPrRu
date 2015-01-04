'use strict';
var scopi;
var bookingPriceRuleManager;
angular.module('myApp.view1', ['ngRoute'

])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/bookingPriceRule/:establishmentTicker/new', {
                templateUrl: 'bookingPriceRule/bookingPriceRule.html',
                controller: 'editRule'
            })
            .when('/bookingPriceRule/:establishmentTicker/list', {
                templateUrl: 'bookingPriceRule/bookingPriceRuleList.html',
                controller: 'BookingPriceRuleListController'
            })
            .when('/bookingPriceRule/:establishmentTicker/:id', {
                templateUrl: 'bookingPriceRule/bookingPriceRule.html',
                controller: 'editRule'
            })
    }])
    .controller('editRule', ['$scope', '$filter','$routeParams','BookingPriceRuleManager','BookingPriceRule','COUNTRIES', 'CONDITION_TYPE', 'CONDITION_CLASS', 'DEFAULT_DATE_PICKER_SETTINGS',
        'DATE_TIME_FORMAT','TIMEZONES','DATE_TIME_FORMAT_NO_OFFSET','TIME_FORMAT','WEEKDAYS','DATE_FORMAT',
        function ($scope, $filter,$routeParams,BookingPriceRuleManager,BookingPriceRule, COUNTRIES, CONDITION_TYPE, CONDITION_CLASS,DEFAULT_DATE_PICKER_SETTINGS, DATE_TIME_FORMAT,
                  TIMEZONES,DATE_TIME_FORMAT_NO_OFFSET,TIME_FORMAT,WEEKDAYS,DATE_FORMAT) {

            scopi=$scope;
            bookingPriceRuleManager=BookingPriceRuleManager;
            var establishmentTicker=$routeParams.establishmentTicker;
            var bookingPriceRuleID=$routeParams.id || null;

            if (bookingPriceRuleID){
                BookingPriceRuleManager.get(establishmentTicker,bookingPriceRuleID)
                    .then(
                    function(result){
                        initialize(result)
                    },function(){
                        alert("Error Occured. Please try again later")
                    });
            }else{
                initialize(null);
            }


            function initialize(bookingPriceRule){
                var defaultCurrency = null;
                var currentOffset = moment().format("Z");
                var locale="es";

                /*It would be much faster to calculate the offset between timezones and apply it to the new Date*/
                var convertToUTC=function(value,offset){
                    var sameTimeWithNewTimezone=moment(value).format(DATE_TIME_FORMAT_NO_OFFSET)+offset;
                    var dateObjectWithGivenTimezone=moment(sameTimeWithNewTimezone,DATE_TIME_FORMAT);
                    return dateObjectWithGivenTimezone.utc();
                };

                var convertFromUTC=function(value,offset){
                    return moment(value+offset,TIME_FORMAT).toDate();
                };

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

                function getDefaultTimezone(offset, timezones) {
                    for (var i = 0; i < timezones.length; i++) {
                        if (timezones[i].offset === offset) {
                            return  {index: i, timezone: timezones[i]};
                        }
                    }
                    return timezones[0];
                }

                function getTimezoneByValue(value, timezones) {
                    for (var i = 0; i < timezones.length; i++) {
                        if (timezones[i].value === value) {
                            return timezones[i];
                        }
                    }
                    return timezones[0];
                }

                $scope.setter=function(property){
                    if (property.indexOf(".")>0){
                        var objectProperties=property.split('.');
                        var caller=$scope;
                        for(var i=0;i<objectProperties.length-1;i++){
                            caller=caller[objectProperties[i]];
                        }
                        return caller[objectProperties.length-1+"Setter"](caller[objectProperties.length-1])
                    }
                    $scope[property+"Setter"]($scope[property]);
                };

                var defaultTimezone = getDefaultTimezone(currentOffset, TIMEZONES);

                var bookingPriceRule=bookingPriceRule? bookingPriceRule: new BookingPriceRule();
                var conditions = bookingPriceRule && bookingPriceRule.getConditionsMap() || false;

                $scope.data = {conditions: []};
                $scope.list = [];

                $scope.currency = defaultCurrency || "EUR";

                $scope.priorities = [
                    {id: '1', label: 'HIGH'},
                    {id: '2', label: 'MEDIUM'},
                    {id: '3', label: 'LOW'}
                ];
                for(var i=0;i<$scope.priorities.length;i++){
                    if($scope.priorities[i].label===bookingPriceRule.rulePriority){
                        $scope.rulePriority=$scope.priorities[i];
                        break;
                    }
                }

                $scope.ticker=bookingPriceRule.ticker || null;

                /****************** PRICEVARIATION GETTER SETTER***************************************/
                var _priceVariation = bookingPriceRule.priceVariation  || 0;
                $scope.priceVariation = function (newPriceVariation) {
                    if (angular.isDefined(newPriceVariation)) {
                        var sign = $scope.sign().id === "POSITIVE" ? 1 : -1;
                        bookingPriceRule.priceVariation = Math.abs(newPriceVariation) * sign;
                    }
                    return Math.abs( bookingPriceRule.priceVariation  || 0);
                };
                /******************END PRICEVARIATION GETTER SETTER************************************/


                /********************* SIGN GETTER SETTER***************************************/
                $scope.signs = [
                    {id: 'POSITIVE', label: '+'},
                    {id: 'NEGATIVE', label: '-'}
                ];
                var _sign =  bookingPriceRule.priceVariation >=0 ? $scope.signs[0]:$scope.signs[1];
                $scope.sign = function (newValue) {
                    if (angular.isDefined(newValue)) {
                        _sign = newValue;
                        var sign = newValue.id === "POSITIVE" ? 1 : -1;
                        bookingPriceRule.priceVariation = Math.abs(bookingPriceRule.priceVariation) * sign;
                    }
                    return _sign;
                };
                /******************END PERCENTAGE GETTER SETTER***************************************/


                /**********************PERCENTAGE GETTER SETTER***************************************/
                $scope.variationTypes = [
                    {id: 'AMOUNT', label: $scope.currency},
                    {id: 'PERCENT', label: '%'}
                ];
                var _percentage =typeof bookingPriceRule.percentage !== "undefined" ? bookingPriceRule.percentage ? $scope.variationTypes[1]: $scope.variationTypes[0]  : $scope.variationTypes[0];

                $scope.percentage = function (newValue) {
                    if (angular.isDefined(newValue)) {
                        bookingPriceRule.percentage = newValue.id === "PERCENT";
                    }
                    return  bookingPriceRule.percentage ? $scope.variationTypes[1]: $scope.variationTypes[0];
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

                $scope.countries = COUNTRIES;


                function getIncludedCountries() {
                    return setMinus(COUNTRIES, $scope.excludedCountries);
                }
                $scope.excludedCountriesSetter=function () {
                    var excludedCountries = $scope.excludedCountries;
                    if (angular.isDefined(excludedCountries)) {
                        if (excludedCountries.length === COUNTRIES.length) {
                            $scope.bookingPriceRuleForm.excludedCountries.$setValidity("ALL_EXCLUDED", false);
                        } else if (excludedCountries.length > COUNTRIES.length / 2) {
                            _countryCondition.conditionType = {};
                            _countryCondition.conditionType[CONDITION_TYPE.INCLUDE] = true;
                            _countryCondition.countries = getIncludedCountries();
                        } else if (excludedCountries.length === 0) {
                            _countryCondition.conditionType = {};
                            _countryCondition.conditionType[CONDITION_TYPE.ALL] = true;
                        } else {
                            _countryCondition.conditionType = {};
                            _countryCondition.conditionType[CONDITION_TYPE.EXCLUDE] = true;
                            _countryCondition.countries = excludedCountries;
                        }
                    }
                };

                var _countryCondition;
                if(conditions[CONDITION_CLASS.COUNTRY_OF_ORIGIN]){
                    _countryCondition = conditions[CONDITION_CLASS.COUNTRY_OF_ORIGIN][0];
                    $scope.excludedCountries=_countryCondition.countries;
                    $scope.excludedCountriesSetter();
                }else{
                    _countryCondition = {
                        id: null,
                        conditionType: {},
                        type: CONDITION_CLASS.COUNTRY_OF_ORIGIN,
                        countries: []
                    };
                    _countryCondition.conditionType[CONDITION_TYPE.ALL] = true;
                }

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
                //DatePicker
                if(!bookingPriceRule){
                    $scope.rangeStartDatePickerOptions = angular.extend({},DEFAULT_DATE_PICKER_SETTINGS,{regional:locale,minDate: 0});
                    $scope.rangeEndDatePickerOptions   = angular.extend({},DEFAULT_DATE_PICKER_SETTINGS,{regional:locale,minDate: 1});
                }else{
                    $scope.rangeStartDatePickerOptions = angular.extend({},DEFAULT_DATE_PICKER_SETTINGS,{regional:locale});
                    $scope.rangeEndDatePickerOptions   = angular.extend({},DEFAULT_DATE_PICKER_SETTINGS,{regional:locale});
                }

                $scope.rangeStartSet =function(startModel,endModel){
                    var startDate=$scope.bookingPriceRuleForm[startModel].$viewValue;
                    var endDate=$scope.bookingPriceRuleForm[endModel].$viewValue;
                    var newEndModelMinDate=moment(startDate).add(1,'days').toDate();
                    if(startDate>=endDate){
                        $scope[endModel](newEndModelMinDate);
                    }
                    $scope.rangeEndDatePickerOptions.minDate=newEndModelMinDate;
                };


                $scope.rangeEndSet =function(startModel,endModel){
                    var startDate=$scope.bookingPriceRuleForm[startModel].$viewValue;
                    var endDate=$scope.bookingPriceRuleForm[endModel].$viewValue;
                    var newStartModelMinDate=moment(startDate).add(-1,'days').toDate();
                    if(startDate>=endDate){
                        $scope[startModel](newStartModelMinDate);
                    }
                };


                $scope.toggle = function ($event, element) {
                    if (typeof $scope.datePickerStatus === "undefined") {
                        $scope.datePickerStatus = {}
                    }
                    if (typeof $scope.datePickerStatus[element] === "undefined") {
                        $scope.datePickerStatus[element] = false
                    }
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.datePickerStatus[element] = !$scope.datePickerStatus[element];
                    angular.element('#' + element).datepicker($scope.datePickerStatus[element] ? 'show' : 'hide')
                };

                var _contractDateTimeRangeCondition = {
                    id: null,
                    start: null,
                    end: null,
                    timezone: defaultTimezone.timezone.value,
                    conditionType: {},
                    type: CONDITION_CLASS.DATE_TIME_RANGE
                };
                _contractDateTimeRangeCondition.conditionType[CONDITION_TYPE.CONTRACT] = true;

                if(conditions[CONDITION_CLASS.DATE_TIME_RANGE]){
                    for(var i=0; i<conditions[CONDITION_CLASS.DATE_TIME_RANGE].length ;i++){
                        if(conditions[CONDITION_CLASS.DATE_TIME_RANGE][i].conditionType[CONDITION_TYPE.CONTRACT]){
                            _contractDateTimeRangeCondition=conditions[CONDITION_CLASS.DATE_TIME_RANGE][i];break;
                        }
                    }
                }


                var _contractEntryDate=_contractDateTimeRangeCondition.start && _contractDateTimeRangeCondition.timezone ? moment(_contractDateTimeRangeCondition.start,DATE_TIME_FORMAT).toDate() : null;

                $scope.contractEntryDate=function (newValue) {
                    if (angular.isDefined(newValue)) {
                        _contractEntryDate = newValue;
                        _contractDateTimeRangeCondition.start =_contractEntryDate? convertToUTC(_contractEntryDate,$scope.contractDateTimezone.offset).format(DATE_TIME_FORMAT) : null;
                    }
                    return _contractEntryDate;
                };
                var _contractExitDate=_contractDateTimeRangeCondition.end && _contractDateTimeRangeCondition.timezone ? moment(_contractDateTimeRangeCondition.end,DATE_TIME_FORMAT).toDate() : null;
                $scope.contractExitDate=function (newValue) {
                    if (angular.isDefined(newValue)) {
                        _contractExitDate = newValue;
                    }
                    _contractDateTimeRangeCondition.end =_contractExitDate? convertToUTC(_contractExitDate,$scope.contractDateTimezone.offset).format(DATE_TIME_FORMAT) : null;
                    return _contractExitDate;
                };

                $scope.timezones = TIMEZONES;
                $scope.contractDateTimezone= _contractDateTimeRangeCondition.timezone ? getTimezoneByValue(_contractDateTimeRangeCondition.timezone,TIMEZONES)   : defaultTimezone.timezone;
                $scope.contractDateTimezoneSetter=function(value){
                    _contractDateTimeRangeCondition.timezone=value.value;
                    if(_contractDateTimeRangeCondition.start){
                        _contractDateTimeRangeCondition.start=convertToUTC($scope.contractEntryDate,$scope.contractDateTimezone.offset).format(TIME_FORMAT);
                    }
                    if(_contractDateTimeRangeCondition.end){
                        _contractDateTimeRangeCondition.end=convertToUTC($scope.contractExitDate,$scope.contractDateTimezone.offset).format(TIME_FORMAT);
                    }
                };

                $scope.data.conditions.push(_contractDateTimeRangeCondition);
                /******************END CONTRACT_DATE CONDITION GETTER SETTER***************************************/

                /********************* CONTRACT_HOUR_RANGE CONDITION GETTER SETTER***************************************/
                /*
                 {
                 "start": "09:00:00.000",
                 "end": "21:22:00.000",
                 "timezone": "Europe/Madrid",
                 "id": 2,
                 "conditionType": {
                 "CONTRACT": true
                 },
                 "type": "HourRangeCondition"
                 }
                 */

                var _contractHourRangeCondition = {
                    id: null,
                    start: null,
                    end: null,
                    timezone: defaultTimezone.timezone.value,
                    conditionType: {},
                    type: CONDITION_CLASS.HOUR_RANGE
                };
                _contractDateTimeRangeCondition.conditionType[CONDITION_TYPE.CONTRACT] = true;

                if(conditions[CONDITION_CLASS.HOUR_RANGE]){
                    for(var i=0; i<conditions[CONDITION_CLASS.HOUR_RANGE].length ;i++){
                        if(conditions[CONDITION_CLASS.HOUR_RANGE][i].conditionType[CONDITION_TYPE.CONTRACT]){
                            _contractHourRangeCondition=conditions[CONDITION_CLASS.HOUR_RANGE][i];break;
                        }
                    }
                }

                //TimePicker
                $scope.timeto = null;
                $scope.timeuntil = null;
                $scope.hstep = 1;
                $scope.mstep = 15;
                $scope.ismeridian = true;
                $scope.contractHourRangeTimezone= _contractHourRangeCondition.timezone ? getTimezoneByValue(_contractHourRangeCondition.timezone,TIMEZONES)   : defaultTimezone.timezone;

                $scope.contractHourRangeTimezoneSetter=function(value){
                    _contractHourRangeCondition.timezone =value.value;
                    if(_contractHourRangeCondition.start){
                        _contractHourRangeCondition.start=convertToUTC($scope.contractHourRangeConditionStart,$scope.contractHourRangeTimezone.offset).format(TIME_FORMAT);
                    }
                    if(_contractHourRangeCondition.end){
                        _contractHourRangeCondition.end=convertToUTC($scope.contractHourRangeConditionEnd,$scope.contractHourRangeTimezone.offset).format(TIME_FORMAT);
                    }
                };

                $scope.contractHourRangeConditionStart=_contractHourRangeCondition.start ? convertFromUTC(_contractHourRangeCondition.start,$scope.contractHourRangeTimezone.offset):null;
                $scope.contractHourRangeConditionStartSetter=function(value){
                    _contractHourRangeCondition.start=convertToUTC(value,$scope.contractHourRangeTimezone.offset).format(TIME_FORMAT);
                };

                $scope.contractHourRangeConditionEnd=_contractHourRangeCondition.end ? convertFromUTC(_contractHourRangeCondition.end,$scope.contractHourRangeTimezone.offset):null;
                $scope.contractHourRangeConditionEndSetter=function(value){
                    _contractHourRangeCondition.end=convertToUTC(value,$scope.contractHourRangeTimezone.offset).format(TIME_FORMAT);
                };
                $scope.data.conditions.push(_contractHourRangeCondition);
                /******************END CONTRACT_HOUR_RANGE CONDITION GETTER SETTER***************************************/


                /********************* CONTRACT WEEKDAY CONDITION GETTER SETTER***************************************/
                /*
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
                 }
                 */
                $scope.days={};
                $scope.weekDays=WEEKDAYS;
                $scope.checkAll = function (property) {
                    /*Emptying array to keep reference*/
                    while($scope.days[property].length) {$scope.days[property].pop();}
                    $scope.weekDays.map(function(item){
                        $scope.days[property].push(item);
                    });
                };
                $scope.uncheckAll = function (property) {
                    /*Emptying array to keep reference*/
                    while($scope.days[property].length) {$scope.days[property].pop();}
                };

                var _contractWeekDayCondition = {
                    id: null,
                    days: [],
                    conditionType: {},
                    type: CONDITION_CLASS.WEEK_DAY
                };
                _contractWeekDayCondition.conditionType[CONDITION_TYPE.CONTRACT] = true;
                _contractWeekDayCondition.conditionType[CONDITION_TYPE.INCLUDE] = true;

                if(conditions[CONDITION_CLASS.WEEK_DAY]){
                    for(var i=0; i<conditions[CONDITION_CLASS.WEEK_DAY].length ;i++){
                        if(conditions[CONDITION_CLASS.WEEK_DAY][i].conditionType[CONDITION_TYPE.CONTRACT]){
                            _contractWeekDayCondition=conditions[CONDITION_CLASS.WEEK_DAY][i];break;
                        }
                    }
                }

                $scope.days.contractWeekDaysConditionDays=_contractWeekDayCondition.days;

                $scope.data.conditions.push(_contractWeekDayCondition);

                /******************END CONTRACT WEEKDAY CONDITION GETTER SETTER***************************************/

                /********************* STAY WEEKDAY CONDITION GETTER SETTER***************************************/
                var _stayWeekDayCondition = {
                    id: null,
                    days: [],
                    conditionType: {},
                    type: CONDITION_CLASS.WEEK_DAY
                };
                _stayWeekDayCondition.conditionType[CONDITION_TYPE.STAY] = true;
                _stayWeekDayCondition.conditionType[CONDITION_TYPE.INCLUDE] = true;
                if(conditions[CONDITION_CLASS.WEEK_DAY]){
                    for(var i=0; i<conditions[CONDITION_CLASS.WEEK_DAY].length ;i++){
                        if(conditions[CONDITION_CLASS.WEEK_DAY][i].conditionType[CONDITION_TYPE.STAY]){
                            _stayWeekDayCondition=conditions[CONDITION_CLASS.WEEK_DAY][i];break;
                        }
                    }
                }
                $scope.days.stayWeekDaysConditionDays=_stayWeekDayCondition.days;
                $scope.data.conditions.push(_stayWeekDayCondition);
                /******************END STAY WEEKDAY CONDITION GETTER SETTER***************************************/


                /********************* STAY_DATE CONDITION GETTER SETTER***************************************/


                var _stayDateTimeRangeCondition = {
                    id: null,
                    start: null,
                    end: null,
                    timezone: defaultTimezone.timezone.value,
                    conditionType: {},
                    type: CONDITION_CLASS.DATE_TIME_RANGE
                };
                _stayDateTimeRangeCondition.conditionType[CONDITION_TYPE.STAY] = true;

                if(conditions[CONDITION_CLASS.DATE_TIME_RANGE]){
                    for(var i=0; i<conditions[CONDITION_CLASS.DATE_TIME_RANGE].length ;i++){
                        if(conditions[CONDITION_CLASS.DATE_TIME_RANGE][i].conditionType[CONDITION_TYPE.STAY]){
                            _stayDateTimeRangeCondition=conditions[CONDITION_CLASS.DATE_TIME_RANGE][i];break;
                        }
                    }
                }

                var _stayEntryDate=_stayDateTimeRangeCondition.start && _stayDateTimeRangeCondition.timezone ? moment(_stayDateTimeRangeCondition.start,DATE_TIME_FORMAT).toDate() : null;
                $scope.stayEntryDate=function (newValue) {
                    if (angular.isDefined(newValue)) {
                        _stayEntryDate = newValue;
                    }
                    _stayDateTimeRangeCondition.start =_stayEntryDate? convertToUTC(_stayEntryDate,$scope.contractDateTimezone.offset).format(DATE_TIME_FORMAT) : null;
                    return _stayEntryDate;
                };
                var _stayExitDate=_stayDateTimeRangeCondition.end && _stayDateTimeRangeCondition.timezone ? moment(_stayDateTimeRangeCondition.end,DATE_TIME_FORMAT).toDate() : null;
                $scope.stayExitDate=function (newValue) {
                    if (angular.isDefined(newValue)) {
                        _stayExitDate = newValue;
                    }
                    _stayDateTimeRangeCondition.end =_stayExitDate? convertToUTC(_stayExitDate,$scope.contractDateTimezone.offset).format(DATE_TIME_FORMAT) : null;
                    return _stayExitDate;
                };

                $scope.timezones = TIMEZONES;
                $scope.stayDateTimezone= _stayDateTimeRangeCondition.timezone ? getTimezoneByValue(_stayDateTimeRangeCondition.timezone,TIMEZONES)   : defaultTimezone.timezone;
                $scope.stayDateTimezoneSetter=function(value){
                    _stayDateTimeRangeCondition.timezone=value.value;
                    if(_stayDateTimeRangeCondition.start){
                        _stayDateTimeRangeCondition.start=convertToUTC($scope.stayEntryDate,$scope.contractDateTimezone.offset).format(TIME_FORMAT);
                    }
                    if(_stayDateTimeRangeCondition.end){
                        _stayDateTimeRangeCondition.end=convertToUTC($scope.stayExitDate,$scope.contractDateTimezone.offset).format(TIME_FORMAT);
                    }
                };

                $scope.data.conditions.push(_stayDateTimeRangeCondition);
                /******************END CONTRACT_DATE CONDITION GETTER SETTER***************************************/

                /********************* CODE CONDITION GETTER SETTER***************************************/

                var _codeCondition = {
                    id: null,
                    supportedCodes:[],
                    conditionType: {},
                    type: CONDITION_CLASS.CODE
                };
                _codeCondition.conditionType[CONDITION_TYPE.EXACT] = true;

                if(conditions[CONDITION_CLASS.CODE]){
                    _codeCondition=conditions[CONDITION_CLASS.CODE];
                }

                $scope.code=function (newValue) {
                    if (angular.isDefined(newValue)) {
                        _codeCondition.supportedCodes = newValue.split(',');
                    }
                    return _codeCondition.supportedCodes.join(',');
                };
                $scope.data.conditions.push(_codeCondition);

                /******************END CODE CONDITION GETTER SETTER***************************************/
            }

        }])
    .controller('BookingPriceRuleListController', ['$scope','$routeParams', 'BookingPriceRuleManager', '$modal', function ($scope,$routeParams, BookingPriceRuleManager, $modal) {
        var establishmentTicker = $routeParams.establishmentTicker;

        $scope.establishmentTicker = establishmentTicker;

        $scope.sortableOptions = {
            stop: function (e, ui) {
                var totalRules = $scope.bookingPriceRules.length;
                for (var index in $scope.bookingPriceRules) {
                    var newOrder = totalRules - parseInt(index);
                    $scope.bookingPriceRules[index].order = newOrder * 100;
                }
            }
        };

        $scope.deleteRule = function (bookingPriceRule, index) {
            var ModalInstanceCtrl = ['$scope', '$modalInstance', function ($scope, $modalInstance) {
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
                BookingPriceRuleManager.delete(establishmentTicker, bookingPriceRule);
                $scope.bookingPriceRules.splice(index, 1);
            }, function () {

            });
        };
        $scope.rulesMap = BookingPriceRuleManager._pool;

        BookingPriceRuleManager.get(establishmentTicker).then(function (bookingPriceRules) {
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
