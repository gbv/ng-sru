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
// requires MicroXML!!
function SRUService(version, $http, $q) {
    this.version = version;

    this.getXML = function( baseURL, params, transform ) {
        return $http.get( baseURL, {
            params: params,
            transformResponse: function(x) {
                console.log(x);
                var microxml = new MicroXML();
                return transform( microxml.parse(x) );
            }
        } );
        // TODO: catch SRU diagnostics response and return error message instead
    };

    this.simplifySearchRetrieveResponse = function(response) {
        var xml = (new MicroXML()).simplify(response,4);
        var result = { 
            count: xml.numberOfRecords * 1,
            next: xml.nextRecordPosition,
            records: xml.records.map(function(xmlRecord) { 
                var record = xmlRecord.record[0];
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
            }),
        };
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

        return this.getXML(baseURL, params, this.simplifySearchRetrieveResponse);
    };
    
    this.simplifyExplainResponse = function(response) {
        var xml = (new MicroXML()).simplify(response,-1); // this will skip some details
        xml = xml.record[0].recordData[0].explain[0];
        var explain = xml;
        var schemaInfo = explain.schemaInfo;
        if (delete explain.schemaInfo) {
            explain.schema = {};
            var schemas = schemaInfo[0].schema;
            //explain.schema = schemas;
            for (var i=0; i<schemas.length; i++) {
                explain.schema[schemas[i].name] = schemas[i].title; // TODO: multiple languages
            }
        }
        // TODO: transform indexInfo
        return explain;
    };

    this.explain = function( baseURL ) {
        return this.getXML( baseURL, {
            params: {
                operation: 'explain',
                version: this.version,
            }, 
        }, this.simplifyExplainResponse);
    };
}

angular.module('ngSRU').provider('SRUService', function() {
    this.version = '1.1';
    this.$get = ['$http','$q',function($http, $q) {
        return new SRUService(this.version, $http, $q);
    }];
});
