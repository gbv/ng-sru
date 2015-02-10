angular.module('sruDemo', ['ngSRU'])

// optional configuration of SRU version
.config( function (SRUServiceProvider) {
    SRUServiceProvider.version = '1.2';
})

.controller('sruDemoController', ['$scope','SRUService', 'ngSRU.version',
function ($scope, SRUService, version) {
    $scope.version = version;
    $scope.baseURL = "http://sru.gbv.de/gso";

    $scope.search = function() {
        $scope.error = null;
        SRUService.searchRetrieve( $scope.baseURL, {
            cql: $scope.cqlQuery,
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
