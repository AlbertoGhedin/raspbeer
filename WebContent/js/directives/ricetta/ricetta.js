var ricettaModule = angular.module('page.ricetta', ['ngMaterial']);

ricettaModule.directive('ricetta', function(){
	return{
		scope: {
			ingredienti: '=',
			moltiplicatore: '=',
			nome: '=',
			ricetta: '=',
			note: '='
		},
		restrict: 'E',
		templateUrl: './js/directives/ricetta/ricetta.html',
		controller: "ListCtrl"
	}
});

ricettaModule.controller('ListCtrl', function($scope,$http,$rootScope,$interval, $compile) {
	
	if(document.getElementById('_notes').innerHTML.length<20){
		angular.element(document.getElementById('_notes')).append($scope.note);
	}
	
	
	$scope.save = function() {
		
		var ricettaCompleta = {
				ricetta:$scope.ricetta,
				nome: $scope.nome,
				note : $scope.note,
				moltiplicatore: $scope.moltiplicatore
		};
		
		$http.post( 'http://'+$rootScope.myhost+'/raspbeer/restful-services/1.0/ricetta?file=ricetta', ricettaCompleta).then(function successCallback(response) {
			alert(response.data);
			}, function errorCallback(response) {
				
			});
		}
	
	

	
  });


