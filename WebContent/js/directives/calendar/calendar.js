var calendarModule = angular.module('page.calendar', ['ngMaterial','ui.calendar', 'ui.bootstrap','toaster', 'ngAnimate']);

calendarModule.directive('calendar', function(){
	return{
		restrict: 'E',
		templateUrl: './js/directives/calendar/calendar.html',
		controller: "CalendarCtrl",
		controllerAs: "calendarCtrl"
	}
});

calendarModule.controller('CalendarCtrl', CalendarCtrl);

function CalendarCtrl($scope, $rootScope, $compile, $timeout,  uiCalendarConfig, toaster, $http, $timeout, messages) {
    
	
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// INIT
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $scope.currentSelectedDateId="selectedDay";
    $scope.minSlot = minSlot;
    $scope.startAtMins = startAtMins;
    $scope.openTime = openTime,
    $scope.closeTime = closeTime,
    $scope.serverCalendarData = {
        	closed:[],
        	full: {},
        	events: []
        };
    $scope.allowClick = true;

    $scope.mattina = false;
    $scope.pomeriggio = false;
    $scope.sera = false;
    
    /* event sources array*/
    $scope.eventSources = [];
    


    
    
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// STATE
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    
    $scope.getActualServiceDuration = function(){
    	return $rootScope.actualServiceDuration;
    }
    
    $scope.getCurrentSelectedDate = function(){
    	return !$rootScope.currentSelectedDate;
    }
    
    $scope.getActualServiceName = function(){
    	return $rootScope.actualServiceName;
    }

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// PAGES
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    $scope.prenota = function(){
    	$rootScope.activePage= 'summary';
    }

    $scope.backServices = function(){
    	$rootScope.activePage= 'services';
    }    
    
    $scope.isShowCalendar = function(){
    	return $rootScope.showCalendar;
    }
    
    $scope.getActivePage = function(){
    	return $rootScope.activePage;
    }
    
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// EVENT LOADING
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    $scope.createEvents = function(){
    	var startLoading= new Date();

    	
		var email = $scope.user["user.email"];

    	

    	$http.get( 'http://'+$rootScope.myhost+'/prenotami2/restful-services/1.0/prenotazione',{params:{info:email}}).then(function successCallback(response) {
    			$scope.serverCalendarData = response.data;
    			var finishLoading= new Date();
    			$scope.updateCalendario(finishLoading-startLoading);
    		  }, function errorCallback(response) {
    			  console.log(response);
    			  toaster.error("", messages("calendar.connection.error.txt"));
    			  //TO-DO devono non essere editabili: editable=false
    			   /* $scope.serverCalendarData = {
    			        	closed:["2017-0-1","2017-0-6","2017-0-8","2017-0-15","2017-0-22","2017-0-29"],
    			        	full: {"2017-0-2":[100,20,0,100],"2017-0-3":[600,20,600,100],"2017-0-4":[50,20,0,50],"2017-0-5":[30,30,0,10]},
    			        	events:[{color: "gray",title: '',start: new Date(2017, 0, 11, 10, 0),end: new Date(2017, 0, 11, 11, 0),allDay: false, editable: false}]
    			        };
    			    var finishLoading= new Date();
    			    $scope.updateCalendario(finishLoading-startLoading);*/
    		  });
    };
    
    $scope.updateCalendario = function(loadingTime){
		uiCalendarConfig.calendars['myCalendar1'].fullCalendar('removeEvents');
		uiCalendarConfig.calendars['myCalendar1'].fullCalendar('addEventSource', $scope.serverCalendarData.events);  
		$rootScope.stopLoading(loadingTime);
    };

    
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TRICK
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //necessario per aggiornare la pagina e disegnare i giorni di chiusura 
    $rootScope.$watch("activePage", function(newO,oldO){
    	if(newO=="calendar" && oldO){
    		$timeout(function(){
    			$scope.refresh();	
    			$rootScope.showCalendar= true;
    		});
    	}
    });

    
    //per fare refresh dei colori dei giorni, è necessario cambiare vista per poi tornare alla precedente
    $scope.refresh= function(){
    	var t = $scope.mattina;
		uiCalendarConfig.calendars['myCalendar1'].fullCalendar('changeView',"basicWeek");
		uiCalendarConfig.calendars['myCalendar1'].fullCalendar('changeView',"month"); 
    }
    
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// EVENT HANDLING
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    $scope.createEventOnMyCalendar = function(){
    	createEventOnMyCalendar();
    }    

    //hour dice se dobbiamo cercare a livello di giorno o di ora.. Giorno per dare uno srile ai giorni, ora controllare che non stiamo prenotando a un orario troppo vicino
    $scope.checkDay = function(date, noHour) {
    	if( $scope.isClosed(date)){
			toaster.error("", messages("calendar.close.txt"));
		}else if ($scope.isFull(date)){
			toaster.error("", messages("calendar.noavail.txt"));
		}else if (isPassed(date, noHour)){
			toaster.error("", messages("calendar.passed.txt"));
		}else{
			return true;
		}
    	return false;
    }

    $scope.dayClick = function(date, jsEvent, view) {
    	//se siamo nella vista giorno aggiungi un appuntamento
    	if(view.name=="agendaDay"){
    		if(!$scope.allowClick){
    			$scope.allowClick = true;
    		}else{
        		$scope.allowClick = true;
        		var appLength = $scope.getActualServiceDuration();
        		var title = $scope.getActualServiceName();
       			$scope.addAppointment(date, appLength, title)  	
    		}
  		
    	}else{//altrimenti vai alla vista giorno
    		$scope.allowClick = true;
    		if($scope.checkDay(date, true)){
    			uiCalendarConfig.calendars['myCalendar1'].fullCalendar('changeView','agendaDay');
    			uiCalendarConfig.calendars['myCalendar1'].fullCalendar('gotoDate',date);
    		}
    	}
    };

    /*
     * Aggiungi un appuntamento in questa data della lunghezza appLength (in minuti)
     */
    $scope.addAppointment = function(date,appLength,title){
    	
    	if($scope.checkDay(date)){
	    	var startDate = $scope.getStartMoment(date);
	    	var start = $scope.formtDate(startDate) ;
	    	var endDate =  $scope.getEndMoment(startDate,appLength);
	    	var end = $scope.formtDate(endDate) ;
	    	
	    	//rimuove l'appuntamento se ne è gia stato creato uno
	    	if( $rootScope.currentSelectedDate){
	    		uiCalendarConfig.calendars['myCalendar1'].fullCalendar('removeEventSource',$rootScope.currentSelectedDate);
	    	}
	    	
	    	//crea nuovo appuntamemto
	    	var newEvent = {
  	  	        	id: $scope.currentSelectedDateId,
  	  	            title  : title,
  	  	            start  : start,
  	  	            startDate: startDate,
  	  	            end: end,
  	  	            endDate: endDate
  	  	        };

	    	if($scope.isOverlapping(newEvent)){
	    		toaster.error("", messages("calendar.overlap.txt"));
	    	}else{
		    	$rootScope.currentSelectedDate = [newEvent];
	    		uiCalendarConfig.calendars['myCalendar1'].fullCalendar('addEventSource',$rootScope.currentSelectedDate);
	    	}
	    	
    	}
    }
    
    $scope.cleanEvents = function(){
    	if($rootScope.currentSelectedDate){
    		uiCalendarConfig.calendars['myCalendar1'].fullCalendar('removeEventSource',$rootScope.currentSelectedDate);
    		$rootScope.currentSelectedDate = null;
    	}
    }
    
    //cancella l'evento se uno cambia il servizio
    $rootScope.$watch("actualServiceName", function(newO,oldO){
    	if(oldO && newO!=oldO){
    		$scope.cleanEvents();
    	}
    });
    
    
    //vedi se non ci sono overlap
    $scope.isOverlapping = function(appointment){
    	var events = $scope.serverCalendarData.events;
    	for(var i = 0; i<events.length; i++){
    		var event = events[i];
    		if(event.stato>=-1){
        		var sameDay = compareEvenDays(appointment, event);
        		if(sameDay==0) {
        			if(isOverlapping(appointment, event)){
            			return true;
            		}
        		}
        		//sono ordinati quindi se vado al giorno successivo mi fermo
        		if(sameDay<0){
        			return false;
        		}
    		}
    	}
    	return false;
    }
    
    function compareEvenDays(appointDay,event){
    	if(event.start.substr(0,10) == appointDay.start.substr(0,10))
    		return 0;
    	if(event.start.substr(0,10) < appointDay.start.substr(0,10))
    		return 1;
    	return -1;
    }
    
    function isOverlapping(appointDay, event){
    	var startApp = appointDay.start;
    	var  endApp= appointDay.end;
    	var startEvent = (event.start);
    	var endEvent = (event.end);
    	//l'appuntamento comincia in mezzo a un altro evento
    	if(startApp>startEvent && startApp<endEvent){
    		return true;
    	}
    	//l'appuntamento finisce in mezzo a un altro evento
    	if(endApp>startEvent && endApp<endEvent){
    		return true;
    	}
    	//l'appuntamento contiene un altro
    	if(startApp<startEvent && endApp>endEvent){
    		return true;
    	}
    	
    	return false;
    }
    
    
    
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// RENDERING
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    $scope.getDayAdditionalClass = function( date ) {
    	if(isPassed(date)){
        	return ' passed ';
        }
    	if($scope.isClosed(date)){
        	return ' closed ';
        }
    	if($scope.isFull(date)){
        	return ' red ';
        }
         return ' green ';
    };
    
    function isPassed( date, noHour ) {
    	var start = $scope.getStartMoment(date);
	    var check = $scope.formtDate(start,noHour );
        var today = $scope.formtDate(new Date(), noHour);
        return check<today;

    };

    
    $scope.isClosed = function(date){
    	var dateString = "";
    	var year = date.year(); 
    	var month = date.month();
    	var day = date.date();
    	dateString = year+"-"+month+"-"+day;
    	var closed = $scope.serverCalendarData.closed;
    	return date.day()==0 || closed.indexOf(dateString)>=0;
    };
    
    $scope.isFull = function(date){
    	var isFullNot= false;
    	var dateString = $scope.formatMoment(date);
    	var full = $scope.serverCalendarData.full;
    	//se nessun pulsante è selezionato
    	if(!$scope.mattina && !$scope.pomeriggio && !$scope.sera ){
    		return full[dateString] && full[dateString][0]<$rootScope.actualServiceDuration;
    	}
    	if($scope.mattina){
    		isFullNot = isFullNot || !(full[dateString] && full[dateString][1]<$rootScope.actualServiceDuration);
    	}
    	if($scope.pomeriggio){
    		isFullNot = isFullNot || !(full[dateString] && full[dateString][2]<$rootScope.actualServiceDuration);
    	}
    	if($scope.sera){
    		isFullNot = isFullNot || !(full[dateString] && full[dateString][3]<$rootScope.actualServiceDuration);
    	}
    	return !isFullNot;
    	
    };
    
    $scope.renderDay = function (date, cell) {
    	$scope.addDayClass(cell, date);
    }

    //mostra gli eventi solo quando la view è giorno
    $scope.showEventsOnlyOnDay = function(event, element, view){
    	if(event.id==$scope.currentSelectedDateId){
    		return true;
    	}
    	return view.name=="agendaDay";
    }
    
    $scope.viewRender = function(view, element){
    	if(view.name=="agendaDay"){
    		$scope.addDayClass(element, view.start);
    	}
    }
    
    $scope.addDayClass= function(element,date){
		element.removeClass('red');
    	element.removeClass('closed');
    	element.removeClass('green');
    	element.removeClass('passed');
		element.addClass($scope.getDayAdditionalClass(date, element));
    }
    
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// UTILS
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    $scope.formtDate = function(date, noHour){
    	var yyyy = date.getFullYear().toString();                                    
        var mm = (date.getMonth()+1).toString();        
        var dd  = (date.getDate()).toString();  
    	var hh = date.getHours().toString();
    	var mi = date.getMinutes().toString();
    	if(noHour){
    		return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
    	}
    	return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0])+"T"+(hh[1]?hh:"0"+hh[0])+":"+(mi[1]?mi:"0"+mi[0])+":00";
    }
    
    $scope.formatMoment = function(date, noHour, notFrom0){
    	var dateString = "";
    	var year = ""+date.year();
    	var mm = ""+(date.month()+1);
    	var dd = ""+date.date();
   		return year + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
    }
    
    
    $scope.getStartMoment = function(appDay){
    	var year = appDay.year();
    	var month = appDay.month();
    	var day = appDay.date();
    	var minutes = appDay.minute();
    	var hours = appDay.hour();
    	
    	//fissa appuntamento a inizio ora o alle $scope.minSlot
    	if(minutes < $scope.minSlot ){
    		minutes = $scope.startAtMins;
    	}else{
    		minutes = $scope.minSlot;
    	}
    	
    	var d = new Date(year, month, day, hours, minutes, 0, 0);
    	return d;
    }
    
    $scope.getEndMoment= function(date, minutes){
    	return new Date(date.getTime() + minutes*60000);
    }
      
    
    $scope.getView= function(){
    	try{
    		return uiCalendarConfig.calendars['myCalendar1'].fullCalendar('getView').name;
    	}catch(e){
    		return "month";
    	}
    	
    }
    
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// MATTINA SERA POMERIGGIO
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    
    
    

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// START ACTION
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    $scope.createEvents();
    
    
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 // CONFIG
 //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
          
     /* config object */
     $scope.uiConfig = {
       calendar:{
         height: 450,
         editable: true,
         eventDurationEditable: false,
         allDaySlot: false,
         header:{
           left: 'title',
           center: '',
           right: 'today prev,next'
         },
         lang: "it",
         minTime: $scope.openTime,
         maxTime: $scope.closeTime,
         locale: 'it',
         lazyFetch: false,
         eventClick: $scope.alertOnEventClick,
         eventDrop: $scope.alertOnDrop,
         eventResize: $scope.alertOnResize,
         eventRender: $scope.eventRender,
         dayClick : $scope.dayClick,
         getDayAdditionalClass: $scope.getDayAdditionalClass,
         dayRender: $scope.renderDay,
         eventRender: $scope.showEventsOnlyOnDay,
         eventOverlap: function(stillEvent, movingEvent) {
             return false;
         },

         selectOverlap: false,
         viewRender:  $scope.viewRender,
         views: {
             month: { // name of view
                 titleFormat: 'MMMM YYYY'
                 // other view-specific options here
             },
             agenda: { // name of view
                 titleFormat: 'DD MMM YYYY'
                     // other view-specific options here
                 }
         }

//         businessHours: [ // specify an array instead
//                          {
//                              dow: [ 1, 2, 3 ], // Monday, Tuesday, Wednesday
//                              start: '08:00', // 8am
//                              end: '18:00' // 6pm
//                          },
//                          {
//                              dow: [ 4, 5 ], // Thursday, Friday
//                              start: '10:00', // 10am
//                              end: '16:00' // 4pm
//                          }
//                      ]
        // eventClick: $scope.removeCurrentSelectedDate

       }
     };
         
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// NOT USED
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      $timeout(function() {
        if(uiCalendarConfig.calendars[calendar]){
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      });
    };
    
    $scope.removeCurrentSelectedDate = function(event, element, view){
    	if(event.id==$scope.currentSelectedDateId){
    		uiCalendarConfig.calendars['myCalendar1'].fullCalendar('removeEventSource',$rootScope.currentSelectedDate);
    		currentSelectedDate=null;
    	}
    }
     
    
};


