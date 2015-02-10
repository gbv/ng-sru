angular.module('sruDemo', ['ngSRU'])
.controller('sruDemoController', ['$scope','SRUService', 'ngSRU.version',
function ($scope, SRUService, version) {
    $scope.version = version;
    $scope.baseURL = "http://sru.gbv.de/gso";

    $scope.search = function() {
        $scope.error = null;
        SRUService.searchRetrieve( $scope.baseURL, {
            query: $scope.cqlQuery
        } ).then(
            function (response) {
                $scope.response = response;
            },
            function (error) {
                $scope.error = error;
            }
        );
    };
}]);
