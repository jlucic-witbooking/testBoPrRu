/**
 * Created by mongoose on 15/12/14.
 */
var bookingPriceRuleModel = angular.module('bookingPriceRuleModel', []);

bookingPriceRuleModel.factory('BookingPriceRule',  function() {

    function BookingPriceRule(bookingPriceRuleData) {
        if (bookingPriceRuleData) {
            this.setData(bookingPriceRuleData);
        }
    };
    BookingPriceRule.prototype = {
        setData: function(bookingPriceRuleData) {
            angular.extend(this, bookingPriceRuleData);
        },
        isValid:function(){
            return true ;
        }
    };
    return BookingPriceRule;
});