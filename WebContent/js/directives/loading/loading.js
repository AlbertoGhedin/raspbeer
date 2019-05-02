var loadingModule = angular.module('page.loading', ['ngMaterial']);

loadingModule.directive('loading', function(){
	return{
		restrict: 'E',
		templateUrl: './js/directives/loading/loading.html'
	}
});

