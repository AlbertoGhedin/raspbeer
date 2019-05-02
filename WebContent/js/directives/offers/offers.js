var servicesModule = angular.module('page.offers', ['ngMaterial']);

servicesModule.directive('offers', function(){
	return{
		restrict: 'E',
		templateUrl: './js/directives/offers/offers.html',
		controller: "OffersController",
		controllerAs: "offersCtrl"
	}
});

servicesModule.controller('OffersController', function($scope,$http,$rootScope,$sce) {
	$scope.offers =[{
		imgstyle: "width: 200px; padding-left: 5px;" ,
		img:"offers.png",
    	title: "Promozioni ed Eventi",
    	content:$sce.trustAsHtml("<p>"+

                "In questa sezione si possono inserire offerte promozionali (foto e testo) alle quali un cliente può aderire cliccando su un pulsante alla fine della presentazione "+

                "Sempre in questa sezione si possono creare delle offerte di partecipazione ad eventi o dimostrazioni a cui ci si puo' prenotare per partecipare"+

              "</p><p>"+

                "È possibile inviare notifiche per le promozioni e gli eventi tramite notifiche push direttamente sul terminale del cliente che le visualizzerà come messaggio dell'applicazione"+

              "</p>")
    	
    }];
   
   /* function loadOffers(){
        	
   		$http.get( 'http://'+$rootScope.myhost+'/prenotami2/restful-services/1.0/servizio').then(function successCallback(response) {
   		 $scope.offers = response.data;
   		  }, function errorCallback(response) {
	  });
   	
    };

    loadOffers();*/
    
  });