'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'ui.date',
  'ui.bootstrap',
  'pascalprecht.translate',
    'frapontillo.bootstrap-duallistbox'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);