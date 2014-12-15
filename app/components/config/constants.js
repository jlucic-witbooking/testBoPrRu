/**
 * Created by mongoose on 15/12/14.
 */
'use strict';
angular.module('myApp.constants', [])
    .constant('API_CONFIG', (function() {
        var PROTOCOL = 'http://';
        var IP = 'localhost';
        var PORT = '8080';
        var PATH = 'WitBookerAPI-war/webresources';
        var BASE_URL= PROTOCOL+IP+":"+PORT+"/"+PATH;
        return {
            BASE_URL: BASE_URL,
            BOOKING_PRICE_RULE_URL: BASE_URL+"/"+"bookingPriceRule"
        }
    })());