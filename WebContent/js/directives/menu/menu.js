var menuModule = angular.module('page.menu', ['ngMaterial']);

servicesModule.directive('menu', function(){
	return{
		restrict: 'E',
		templateUrl: './js/directives/menu/menu.html',
		controller: "MenuController",
		controllerAs: "menuCtrl"
	}
});

servicesModule.controller('MenuController', function($scope,$rootScope,$mdSidenav) {
	$scope.toggleMenu = buildToggler("left");

	$scope.userInfos=userInfos;

	
	function initUser(){
		var newUserInfos = window.localStorage.getItem("pren.user.infovalues");
		if(newUserInfos)
			$scope.user = JSON.parse(newUserInfos);
	};


	function buildToggler(componentId) {
		return function() {
			$mdSidenav(componentId).toggle();
			window.localStorage.setItem("pren.user.infovalues",JSON.stringify($scope.user));
			var userInfos = window.localStorage.getItem("pren.user.infovalues");
			if(userInfos)
				userInfos = JSON.parse(userInfos);
		}
	};

	initUser();

});

