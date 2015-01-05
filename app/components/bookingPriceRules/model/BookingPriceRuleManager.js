/**
 * Created by mongoose on 15/12/14.
 */

var bookingPriceRuleService = angular.module('bookingPriceRuleService', ['ngResource']);

bookingPriceRuleService.factory('BookingPriceRuleManager', ['$http', '$q', '$resource','API_CONFIG','BookingPriceRule', function($http, $q, $resource, API_CONFIG, BookingPriceRule) {

    var _resource = $resource(API_CONFIG.BOOKING_PRICE_RULE_URL+"/:establishmentTicker/:id",
        {establishmentTicker:'@establishmentTicker'}
    );

    var BookingPriceRuleManager = {
        _pool: {},
        _updateInstance: function(id, bookingPriceRuleData) {
            var instance = this._pool[id];

            if (instance) {
                instance.setData(bookingPriceRuleData);
            } else {
                instance = new BookingPriceRule(bookingPriceRuleData);
                this._pool[id] = instance;
            }

            return instance;
        },
        _find: function(id) {
            return this._pool[id];
        },
        _load: function(establishmentTicker,id, deferred) {
            var scope = this;
            _resource.get({establishmentTicker:establishmentTicker,id:id},
                function(bookingPriceRuleData){
                    var book = scope._updateInstance(bookingPriceRuleData.id, bookingPriceRuleData);
                    deferred.resolve(book);
                },
                function(error){
                    deferred.reject();
                }
            );
        },
        /* Public Methods */
        get: function(establishmentTicker,id) {
            var deferred = $q.defer();
            if(id){
                var book = this._find(id);
                if (book) {
                    deferred.resolve(book);
                } else {
                    this._load(establishmentTicker,id, deferred);
                }
            }else{
                var manager = this;
                _resource.query({establishmentTicker:establishmentTicker},
                    function(bookingPriceRulesData){
                        var bookingPriceRules = [];
                        bookingPriceRulesData.forEach(function(bookingPriceRuleData) {
                            var bookingPriceRule = manager._updateInstance(bookingPriceRuleData.id, bookingPriceRuleData);
                            bookingPriceRules.push(bookingPriceRule);
                        });
                        deferred.resolve(bookingPriceRules);
                    },
                    function(error){
                        deferred.reject();
                    }
                );
            }
            return deferred.promise;
        },
        delete: function(establishmentTicker,bookingPriceRule) {
            _resource.delete({establishmentTicker:establishmentTicker,id:bookingPriceRule.id});
            delete this._pool[bookingPriceRule.id];
            delete bookingPriceRule;
        },
        save: function(establishmentTicker,bookingPriceRule) {
            _resource.save({establishmentTicker:establishmentTicker},bookingPriceRule);
        },
        updateInstance: function(bookingPriceRuleData) {
            var book = this._updateInstance(bookingPriceRuleData.id,bookingPriceRuleData);
            return book;
        }
    };
    return BookingPriceRuleManager;
}]);