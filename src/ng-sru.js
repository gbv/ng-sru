'use strict';
/**
 * @ngdoc overview
 * @name ng-sru
 * @module ng-sru
 * @description
 *
 * Experimental SRU client as AngularJS module
 *
 * SRU server must support the "Access-Control-Allow-Origin" response header!
 */
angular.module('ngSRU',[])
.constant('ngSRU.version', '0.0.0');

angular.module('ngSRU').factory('SRUService', ['$http', function($http) {
    var searchRetrieve = function( baseURL, query ) {
        console.log("Search!");
        return $http.get( baseURL, {
            params: {
                operation: 'searchRetrieve',
                version: '1.2', // TODO: 1.1, 2.0 ?
                query: query.cqlQuery,
//            startRecord: 
//            maximumRecord:
//            recordSchema:
            }           
        });
    };
    return {
        searchRetrieve: searchRetrieve
    }
}]);
