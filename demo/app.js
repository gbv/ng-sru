angular.module('sruDemo', ['ngSRU'])

// optional configuration of SRU version
.config( function (SRUServiceProvider) {
    SRUServiceProvider.version = '1.1';
})

.controller('sruDemoController', ['$scope','SRUService', 'ngSRU.version',
function ($scope, SRUService, version) {
    $scope.version = version;
    $scope.baseURL = "http://gsoapiwww.gbv.de/sru/gvk";
    $scope.recordSchema  = "dc";

    $scope.search = function() {
        $scope.error = null;
        SRUService.searchRetrieve( $scope.baseURL, {
            cql: $scope.cqlQuery,
            maximumRecords: 10,
            recordSchema: $scope.recordSchema,
        } ).then(
            function (response) {
                $scope.response = response;
            },
            function (error) {
                $scope.error = error;
            }
        );
    };

    $scope.explain = function() {
        $scope.error = null;
        SRUService.explain( $scope.baseURL )
        .then(
            function (response) {
                $scope.response = response;
            },
            function (error) {
                $scope.error = error;
            }
        );
    };

}]);
