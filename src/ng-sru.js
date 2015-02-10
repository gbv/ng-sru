'use strict';
/**
 * @ngdoc overview
 * @name ng-sru
 * @module ng-sru
 * @description
 *
 * Experimental SRU 1.2 client as AngularJS module
 */
angular.module('ngSRU',[])
.constant('ngSRU.version', '0.0.0');

angular.module('ngSRU').factory('SRUService', ['$http', function($http) {
    var searchRetrieve = function( baseURL, query ) {
        console.log("Search!");
        return $http.get( baseURL, {
            operation: 'searchRetrieve',
            version: '1.2',
//            startRecord: 
//            maximumRecord:
//            recordSchema:
        });
    };
    return {
        searchRetrieve: searchRetrieve
    }
}]);
