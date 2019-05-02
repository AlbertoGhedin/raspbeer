var infoModule = angular.module('page.info', ['ngMaterial']);

infoModule.directive('info', function(){
	return{
		scope: {
			details: '=',
			next: '=',
			moltiplicatore: '=',
			indice: '='
		},
		restrict: 'E',
		templateUrl: './js/directives/info/info.html',
		controller: "InfoController",
		controllerAs: "infoCtrl"
	}
});

infoModule.controller('InfoController', function($scope,$http,$rootScope,$interval) {
	$scope.pausa= false;
	$scope.startValue =0;
	$scope.intervallo;
	$scope.time;
	$scope.inizio =0;
	$scope.fine =0;
	$scope.tMosto = $rootScope.tMosto;

	
	$interval(function() {
			$scope.tMosto = $rootScope.tMosto;
			//go to next
			if($scope.next){
				if(!$scope.details.tempo && $scope.fine==0 ){
					if($scope.next.temperatura+0.5<=$scope.tMosto){
						$scope.stop();
					}
				}
			}
		}, 
		2000);
	
	
	$scope.$watch('details.avvia', function(newValue, oldValue) {
	    if(newValue){
	    	$scope.startButton();
	    	$scope.details.avvia = false;
	    }
	});

	$scope.startTime = function(minutes){
		var d = (new Date()).getTime()+minutes*60*1000;
		$scope.intervallo = $interval(function() { 
			var d1= Math.round(((d-(new Date()).getTime())/1000));
			$scope.time = Math.floor((d1/60));
			var m = "0"+(d1%60);
			var h = "0"+Math.floor((d1/60));
			$scope.countDown = h.substring(h.length-2)+":"+m.substring(m.length-2);
			if(d1<60 && d1>58){
				$rootScope.beep(3000);
			}
			
			
			//go next
			if(d1<0){
				$scope.stop();	
			}

		}, 
		1000, $scope.stopValue);
	};
	
	$scope.startButton = function(value) {
		
		$rootScope.actualId =  $scope.details.phaseId;
		
		if(!value){
			value = $scope.details.tempo;
		}
		
		$rootScope.tdaRaggiungere = $scope.details.temperatura;
		if($scope.intervallo){
			$interval.cancel($scope.intervallo);
		}
		$scope.stopValue =0;
		$scope.inesecuzione = true;
        $scope.startTime(value);
		var data = new Date();
		var s = ("0"+data.getSeconds());
		var m = ("0"+data.getMinutes());
		var h = ("0"+data.getHours());
		$scope.inizio = h.substring(h.length-2)+":"+m.substring(m.length-2)+":"+s.substring(s.length-2);
		$scope.details.inizio = $scope.inizio;
    }
	$scope.pause = function() {
		if(!$scope.pausa){
			$interval.cancel($scope.intervallo);
			$scope.pausa= true;
		}else{
			$scope.startTime($scope.time);
			$scope.pausa= false;
		}
		
    }	
	$scope.stop = function(value) {
		$rootScope.tdaRaggiungere = null;
		$scope.inesecuzione = false;
		var data = new Date();
		var s = ("0"+data.getSeconds());
		var m = ("0"+data.getMinutes());
		var h = ("0"+data.getHours());
		$scope.fine = h.substring(h.length-2)+":"+m.substring(m.length-2 )+":"+s.substring(s.length-2 );
		$scope.details.fine = $scope.fine;
		$scope.pause();
		
		//go to next
		if($scope.next && $rootScope.actualId==($scope.next.phaseId-1)){
			$scope.next.avvia=true;
		}
    }
	
	$scope.mute = function() {
		if($rootScope.mute == 1){
			$rootScope.mute = 0;
		}else{
			$rootScope.mute = 1;
		}
		
    }
	


	
  });


