var servicesModule = angular.module('page.services', ['ngMaterial']);

servicesModule.directive('services', function(){
	return{
		restrict: 'E',
		templateUrl: './js/directives/services/services.html',
		controller: "ServicesController",
		controllerAs: "servicesCtrl"
	}
});

servicesModule.controller('ServicesController', function($scope,$http,$rootScope) {
    $scope.messages =[];
   
    function loadServices(){
        	
   		$http.get( 'http://'+$rootScope.myhost+'/prenotami2/restful-services/1.0/servizio').then(function successCallback(response) {
   		 $scope.messages = response.data;
   		  }, function errorCallback(response) {
	  });
   	
    };
    
    $scope.setService = function(id, name,duration){
    	$rootScope.actualServiceDuration =duration;
    	$rootScope.actualServiceId = id;
    	$rootScope.actualServiceName = name;
    	$rootScope.activePage= 'calendar';
    };
    
    $scope.openRequests = function(){
    	$rootScope.activePage= 'requests';
    };
    
    $scope.openOffers = function(){
    	$rootScope.activePage= 'offers';
    };

    $scope.openInfo = function(){
    	$rootScope.activePage= 'info';
    };
    
    
    loadServices();
    
  });