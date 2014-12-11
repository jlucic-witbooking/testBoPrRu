'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'ui.date',
    'ui.bootstrap',
    'pascalprecht.translate',
    'frapontillo.bootstrap-duallistbox',
    'checklist-model'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }]);