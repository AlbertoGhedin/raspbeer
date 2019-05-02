var servicesModule = angular.module('page.requests', ['toaster','ngMaterial','ngMdIcons']);

servicesModule.directive('requests', function(){
	return{
		restrict: 'E',
		templateUrl: './js/directives/requests/requests.html',
		controller: "RequestsController",
		controllerAs: "requestsCtrl"
	}
});

servicesModule.controller('RequestsController', function($scope,$http,toaster,$rootScope, messages) {
	$scope.myReservations=[];

	$scope.loadTemperatura = function(id){
		$http.get( 'http://'+$rootScope.myhost+'/www/restful-services/1.0/x?id='+id).then(function successCallback(response) {
			$rootScope.temperatura = response;
		}, function errorCallback(response) {
			toaster.success("", messages("Errore"));
		});
	};


});