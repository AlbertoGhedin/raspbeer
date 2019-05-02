var termometerModule = angular.module('page.termometer', []);


termometerModule.directive('tgThermometerVertical', ['$window', function($window) {
	
	return {
		restrict: 'E',
		scope: true,
		templateUrl: './js/directives/termometro/tg-thermometer-vertical.html',
		link: function(scope, elem, attrs) {
	
			scope.size = attrs.size;
			scope.height = attrs.height;
			scope.width = attrs.width;
			scope.attribute = attrs.percent;

			console.log(scope);
		},
		controller: "TermometroController"
	};
	

	

}]);

termometerModule.controller('TermometroController', function($scope,$http,$rootScope,$interval) {
		$interval(function() {
		$scope.percent = $rootScope[$scope.attribute];} 
		,3000);
	 });
