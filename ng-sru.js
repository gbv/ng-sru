'use strict';
/**
 * @ngdoc overview
 * @name ng-sru
 * @module ng-sru
 * @description
 *
 * Experimental SRU client as AngularJS module.
 *
 * *SRU server must support the "Access-Control-Allow-Origin" response header!*
 *
 * Supported methods:
 *
 * * `searchRetrieve( baseURL, query )` where `query` is an object with
 *   keys `cqlQuery` (mandatory) and `version`, `startRecord`, `maximumRecord`
 *   (all optional)
 * * `explain( baseURL )`
 */
angular.module('ngSRU',[])
.constant('ngSRU.version', '0.0.0');

// This service wraps the $http service
angular.module('ngSRU').factory('SRURequest', ['$http','$q',function($http,$q) {
    return {
        // perform HTTP GET request and transform XML response
        request: function(url, config) {
            return $http.get( url, {
                params: config.params,
            } ).then(function(result) { // transform response, catch diagnostics
                console.debug(result); 
                console.log(result.data);
                var MX = new MicroXML();
                var xml = MX.parse(result.data,1);
                if (xml.diagnostics instanceof Array) {
                    var errors = MX.simplify(xml.diagnostics[0],-1).diagnostic;
                    result.data = errors.map(function(diagnostic) {
                        console.log(diagnostic);
                        var msg = diagnostic.message || "";
                        if (diagnostic.details) {
                            if (msg) msg += ": ";
                            msg += diagnostic.details;
                        }
                        if (!msg) message = diagnostic.uri;
                        return msg;
                    }).join("\n");
                    return $q.reject(result);
                } else {
                    result.data = config.transformResponse(xml);
                }
                return result;
            });
        },
    };
}]);

// This JavaScript class could be refactored to be used with node.js as well
// requires MicroXML!!
function SRUService(version, SRURequest) {
    this.version = version;

    this.simplifySearchRetrieveResponse = function(response) {
        var result = {
            count: response.numberOfRecords * 1,
            next: response.nextRecordPosition,
        };

        // TODO: simplify in MicroXML
        var xml = (new MicroXML()).simplify(response.records[0],3);
        var records = xml.record || [];
        result.records = records.map(function(record) { 
                var recordData = record.recordData[0];
                var data; // assume that XML response has a root element
                for (var root in recordData) { 
                    data = recordData[root][0];
                }
                return { 
                    schema: record.recordSchema,
                    position: record.recordPosition * 1,
                    data: data,
                };
            });

        return result;
    };

    this.searchRetrieve = function( baseURL, query ) {
        var params = { 
            operation: 'searchRetrieve',
            version: this.version,
            query: query.cql,
        };
        if (query['startRecord'] > 0) params['startRecord'] = query['startRecord'];
        if (query['maximumRecords'] > 0) params['maximumRecords'] = query['maximumRecords'];
        if (query['recordSchema']) params['recordSchema'] = query['recordSchema'];

        return SRURequest.request(baseURL, {
            params: params,
            transformResponse: this.simplifySearchRetrieveResponse,
        });
    };
    
    this.simplifyExplainResponse = function(response) {
        // TODO: simplify in MicroXML
        var xml = response.record; xml.unshift({}); xml.unshift('root');

        xml = (new MicroXML()).simplify(xml,-1); // this will skip some details
        console.log(xml);
        xml = xml.record[0].recordData[0].explain[0];
        var explain = xml;
        var schemaInfo = explain.schemaInfo;
        if (delete explain.schemaInfo) {
            explain.schemas = {};
            var schemas = schemaInfo[0].schema;
            for (var i=0; i<schemas.length; i++) {
                // TODO: multiple languages
                explain.schemas[schemas[i].name] = schemas[i].title;
            }
        }
        // TODO: transform indexInfo
        return explain;
    };

    this.explain = function(baseURL) {
        return SRURequest.request(baseURL, {
            params: {
                operation: 'explain',
                version: this.version,
            }, 
            transformResponse: this.simplifyExplainResponse,
        });
    };
}

angular.module('ngSRU').provider('SRUService', function() {
    this.version = '1.1';
    this.$get = ['SRURequest',function(SRURequest) {
        return new SRUService(this.version, SRURequest);
    }];
});
