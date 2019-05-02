var summaryModule = angular.module('page.summary', ['ngMaterial']);

summaryModule.directive('summary', function(){
	return{
		restrict: 'E',
		templateUrl: './js/directives/summary/summary.html',
		controller: "SummaryController",
		controllerAs: "summaryCtrl"
	}
});

summaryModule.controller('SummaryController', function($scope,toaster,$http,$rootScope, messages) {

	$scope.hideBookButton = false;//vedi pulsante aggiungi a calendario solo 1 volta;
	
	$scope.getActualServiceName = function(){
		if($rootScope.actualServiceName)
			return $rootScope.actualServiceName;
		return "";
	};

	$scope.getStartDate = function(){
		if($rootScope.currentSelectedDate)
			return $scope.formatDate($rootScope.currentSelectedDate[0].startDate);
		return "";
	};

	$scope.getStartTime = function(){
		if($rootScope.currentSelectedDate)
			return $scope.formatTime($rootScope.currentSelectedDate[0].startDate);
		return "";
	};

	$scope.getEndDate = function(){
		if($rootScope.currentSelectedDate)
			return $scope.formatDate($rootScope.currentSelectedDate[0].endDate);
		return "";
	};

	$scope.getEndTime = function(){
		if($rootScope.currentSelectedDate)
			return $scope.formatTime($rootScope.currentSelectedDate[0].endDate);
		return "";
	};	

	$scope.formatDate = function(date,noHour){
    	var yyyy = date.getFullYear().toString();                                    
        var mm = (date.getMonth()+1).toString();        
        var dd  = (date.getDate()).toString();  
    	var hh = date.getHours().toString();
    	var mi = date.getMinutes().toString();
    	if(noHour){
    		return   (dd[1]?dd:"0"+dd[0])+ '-' + (mm[1]?mm:"0"+mm[0]) +"-"+yyyy;
    	}
    	return (dd[1]?dd:"0"+dd[0])+ '-' + (mm[1]?mm:"0"+mm[0]) +"-"+yyyy+"-"+(hh[1]?hh:"0"+hh[0])+":"+(mi[1]?mi:"0"+mi[0])+":00";
	};


	$scope.backCalendar = function(){
		$rootScope.activePage= 'calendar';
	};


	$scope.createEventOnMyCalendar = function(){

		if(!$scope.hideBookButton){
			$scope.hideBookButton = true;
			// create an event silently (on Android < 4 an interactive dialog is shown which doesn't use this options) with options: 
			var calOptions = window.plugins.calendar.getCalendarOptions(); // grab the defaults 
			calOptions.firstReminderMinutes = firstReminderMinutes; 
			calOptions.secondReminderMinutes = secondReminderMinutes;

			if(websiteUrl){
				// And the URL can be passed since 4.3.2 (will be appended to the notes on Android as there doesn't seem to be a sep field) 
				calOptions.url = websiteUrl;
			}


			// on iOS the success handler receives the event ID (since 4.3.6) 
			window.plugins.calendar.createEventWithOptions(eventTitle,eventLocation,$rootScope.actualServiceName,$rootScope.currentSelectedDate[0].startDate,$rootScope.currentSelectedDate[0].endDate,calOptions,eventSuccess,eventError);
			
		}

	};    


	$scope.doBooking = function(){

		var value = {
				inizio: $rootScope.currentSelectedDate[0].start,
				idEsercente:1,
				idServizio:$rootScope.actualServiceId,
				durata: $rootScope.actualServiceDuration,
				stato: 1,
				infoUtente:$scope.user["user.email"] //JSON.stringify($scope.user)
		};
		
		config = {};
	       config.headers = {'Content-Type': 'application/json'};

		if($scope.account.$valid){//se l'account è configurato
			$http.post( 'http://'+$rootScope.myhost+'/prenotami2/restful-services/1.0/prenotazione',(value),config).then(
					function(response){
						if(response.data.exception){
							toaster.error("", messages(response.data.exception));
						}else{
							toaster.success("", messages("summary.booked.txt"));
						}
						//aggiorna appuntamenti
						$scope.createEvents();
					}, function(response){
						toaster.error("", "Errore");
					});
		}else{
			$scope.toggleMenu();//apri il menu per mettere i valori
		}
	}


});