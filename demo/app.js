angular.module('sruDemo', ['ngSRU'])

// should not be required anymore:
.config( function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // CORS requires IE >= 10
})

.controller('sruDemoController', ['$scope','SRUService', 'ngSRU.version',
function ($scope, SRUService, version) {
    $scope.version = version;
    $scope.baseURL = "http://sru.gbv.de/gso";

    $scope.search = function() {
        $scope.error = null;
        SRUService.searchRetrieve( $scope.baseURL, {
            cqlQuery: $scope.cqlQuery
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
