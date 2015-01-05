/**
 * Created by mongoose on 15/12/14.
 */
var bookingPriceRuleModel = angular.module('bookingPriceRuleModel', []);

bookingPriceRuleModel.factory('BookingPriceRule',['CONDITION_CLASS','CONDITION_TYPE','COUNTRIES',  function(CONDITION_CLASS,CONDITION_TYPE,COUNTRIES) {

    function BookingPriceRule(bookingPriceRuleData) {
        var _conditions;
        this.getConditionsMap=function(){
            return _conditions;
        };
        this.setConditionsMap=function(conditions){
            _conditions=conditions;
        };
        if (bookingPriceRuleData) {
            this.setData(bookingPriceRuleData);
        }
    }

    BookingPriceRule.prototype = {
        setData: function(bookingPriceRuleData) {
            angular.extend(this, bookingPriceRuleData);
            var conditionList=this.conditions;
            this.setConditionsMap({});
            var conditions=this.getConditionsMap();
            for (var i=0;i<conditionList.length;i++){
                if(!conditions.hasOwnProperty(conditionList[i].type)){
                    conditions[conditionList[i].type]=[];
                }
                conditions[conditionList[i].type].push(conditionList[i]);
            }
        },
        isValid:function(){
            return true ;
        },
        addCondition:function(condition){
            var validation=this.isConditionValid(condition);
            if(validation.error){
                return validation;
            }
            var ruleConditions=this.getConditionsMap();
            var conditionTypeList=[];
            if(!ruleConditions.hasOwnProperty(condition.type)){
                ruleConditions[condition.type]=conditionTypeList;
            }else{
                conditionTypeList=ruleConditions[condition.type];
            }
            var index=-1;
            for(var i=0;i<conditionTypeList.length;i++){
                if( condition.conditionType[CONDITION_TYPE.STAY] && conditionTypeList[i].conditionType[CONDITION_TYPE.STAY]){
                    index=i;
                    break;
                }else if(condition.conditionType[CONDITION_TYPE.CONTRACT]  && conditionTypeList[i].conditionType[CONDITION_TYPE.CONTRACT]){
                    index=i;
                    break;
                }else if(!conditionTypeList[i].conditionType[CONDITION_TYPE.CONTRACT] && !conditionTypeList[i].conditionType[CONDITION_TYPE.STAY]
                    && !condition.conditionType[CONDITION_TYPE.CONTRACT] && condition.conditionType[CONDITION_TYPE.STAY]){
                    index=0;
                }
            }
            if(index>=0){
                conditionTypeList.splice(index,1);
            }
            conditionTypeList.push(condition);
        },
        isConditionValid:function(condition){
            if( !condition.hasOwnProperty("id") || !condition.hasOwnProperty("conditionType") || !condition.hasOwnProperty("type") ){
                return {error:true, message:"Invalid Condition Object", code:"INVALID"};
            }
            if(condition.type===CONDITION_CLASS.COUNTRY_OF_ORIGIN){
                if (!condition.hasOwnProperty("countries") || Object.prototype.toString.call( condition.countries ) !== '[object Array]'  ){
                    return {error:true, message:"Invalid Country Condition", code:"INVALID_COUNTRY_CONDITION"};
                }
                if (condition.countries.length===0 && condition.conditionType[CONDITION_TYPE.INCLUDE]) {
                    return {error:true, message:"At least one country must be included", code:"NO_COUNTRY_POSSIBLE"};
                }
                if (condition.countries.length===COUNTRIES.length && condition.conditionType[CONDITION_TYPE.EXCLUDE]) {
                    return {error:true, message:"At least one country must be included", code:"NO_COUNTRY_POSSIBLE"};
                }
            }else if(condition.type===CONDITION_CLASS.DATE_TIME_RANGE || condition.type===CONDITION_CLASS.HOUR_RANGE){
                if (!condition.hasOwnProperty("start") || !condition.hasOwnProperty("end") || !condition.start || !condition.end ){
                    return {error:true, message:"Invalid Range Condition", code:"INVALID_RANGE_CONDITION"};
                }
            }else if(condition.type===CONDITION_CLASS.WEEK_DAY){
                if (!condition.hasOwnProperty("days") || Object.prototype.toString.call( condition.days ) !== '[object Array]'  ){
                    return {error:true, message:"Invalid WeekDay Condition", code:"INVALID_WEEK_DAY_CONDITION"};
                }
                if (condition.days.length===0 && condition.conditionType[CONDITION_TYPE.INCLUDE]) {
                    return {error:true, message:"At least one weekday must be included", code:"NO_COUNTRY_POSSIBLE"};
                }
            }else if(condition.type===CONDITION_CLASS.CODE){

            }else{
                return {error:true, message:"Invalid Condition Type", code:"INVALID_TYPE"};
            }
            return {valid:true};
        },
        save:function(conditionsMap){
            if(!conditionsMap){
                conditionsMap=this.getConditionsMap();
            }
            if(!this.conditions || Object.prototype.toString.call( this.conditions ) !== '[object Array]' ){
                this.conditions=[];
            }
            var formula = "";
            var conditions = this.conditions = [];
            var c=0;
            for (var type in conditionsMap) {
                if( conditionsMap.hasOwnProperty( type ) ) {
                    conditionsMap[type].map(function(condition){
                        c++;
                        condition.id=c;
                        formula+="c"+condition.id+" && ";
                        conditions.push(condition);
                    });
                }
            }
            if(!conditions.length>0){
                return false;
            }
            formula=formula.substring(0,formula.length-3);
            this.formula=formula;
            return true;
        }
    };
    return BookingPriceRule;
}]);