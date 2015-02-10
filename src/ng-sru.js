'use strict';
/**
 * @ngdoc overview
 * @name ng-sru
 * @module ng-sru
 * @description
 *
 * Experimental SRU client as AngularJS module.
 *
 * SRU server must support the "Access-Control-Allow-Origin" response header!
 *
 * Method `searchRetrieve( baseURL, query )` where `query` is an object with
 * keys `cqlQuery` (mandatory) and `version`, `startRecord`, `maximumRecord`
 * (all optional).
 */
angular.module('ngSRU',[])
.constant('ngSRU.version', '0.0.0');

// This JavaScript class could be refactored to be used with node.js as well
function SRUService(version, $http) {
    this.version = version;
    this.searchRetrieve = function( baseURL, query ) {
        var params = { 
            operation: 'searchRetrieve',
            version: this.version,
            query: query.cql,
        };
        if (query['startRecord'] > 0) params['startRecord'] = query['startRecord'];
        if (query['maximumRecord'] > 0) params['maximumRecord'] = query['maximumRecord'];

        // TODO: recordSchema
        return $http.get( baseURL, { params: params } );
    };
    
    this.explain = function( baseURL ) {
        return $http.get( baseURL, {
            params: {
                operation: 'explain',
                version: this.version,
            }
        });
    };
}

angular.module('ngSRU').provider('SRUService', function() {
    this.version = '1.1';
    this.$get = ['$http', function($http) {
        return new SRUService(this.version, $http);
    }];
});
