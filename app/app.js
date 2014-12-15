'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.constants',
    'ui.date',
    'ui.sortable',
    'ui.bootstrap',
    'pascalprecht.translate',
    'frapontillo.bootstrap-duallistbox',
    'checklist-model',
    'bookingPriceRuleModel',
    'bookingPriceRuleService'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/bookingPriceRule/list'});
    }]);