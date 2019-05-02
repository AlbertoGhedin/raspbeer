var prenotamiApp = angular.module('MainModuleApp', ["page.ricetta","page.calendar","page.termometer","page.summary","page.services","page.menu","page.requests","page.info",'uiGmapgoogle-maps']);

prenotamiApp.controller('MainCtrl', prenotamiAppCtrl);

prenotamiApp.config(function($mdThemingProvider) {
	  $mdThemingProvider.theme('default')
	    .primaryPalette('red')
	    .accentPalette('orange');
	});

function prenotamiAppCtrl($scope, $rootScope, $timeout, messages, $interval,$http) {
 
    //$rootScope.myhost = "localhost:8080";//'169.254.200.144:8080';
    $rootScope.myhost = '169.254.200.144:8080';
    $rootScope.tdaRaggiungere = null;
	$rootScope.tMosto = 0;
	$rootScope.tAcqua = 0;
	$rootScope.mute = 0;
	$rootScope.actualId = 0;
	$scope.ora = "";
	
	
$interval(function() { 
$scope.getTemperatura(30)} ,3000);


	$rootScope.beep = function(millis) {
		$http.get( 'http://'+$rootScope.myhost+'/raspbeer/restful-services/1.0/beep/millis='+millis).then(function successCallback(response) {

		}, function errorCallback(response) {
			
		});
	} 		

	$scope.getTemperatura = function(sensore) {
		$http.get( 'http://'+$rootScope.myhost+'/raspbeer/restful-services/1.0/temperatura/list?tdaRaggiungere='+$rootScope.tdaRaggiungere+'&mute='+$rootScope.mute).then(function successCallback(response) {
				$rootScope.tMosto = response.data[0];
				$rootScope.tAcqua = response.data[1];
			}, function errorCallback(response) {
				
			});
		} 

	$scope.getRicetta = function() {
		$http.get( 'http://'+$rootScope.myhost+'/raspbeer/restful-services/1.0/ricetta?file=ricetta').then(function successCallback(response) {
				$scope.ricetta= response.data.ricetta;
				$scope.note= response.data.note;
			}, function errorCallback(response) {
				
			});
		} 

	$scope.getRicetta();
	
	var data = new Date();
	
	var y = data.getFullYear();
	var m = ("0"+data.getMonth()+1);
	var d = ("0"+data.getDate());
	var s = ("0"+data.getSeconds());
	var m = ("0"+data.getMinutes());
	var h = ("0"+data.getHours());
	
	$scope.ora =  d.substring(d.length-2)+"/"+m.substring(m.length-2)+"/"+y+" "+h.substring(h.length-2)+":"+m.substring(m.length-2)+":"+s.substring(s.length-2);
	


};
