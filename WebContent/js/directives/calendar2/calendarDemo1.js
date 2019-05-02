var myApp = angular.module('calendarDemoApp', ['ui.calendar', 'ui.bootstrap','toaster', 'ngAnimate']);
        
myApp.controller('CalendarCtrl', CalendarCtrl);

	
function CalendarCtrl($scope, $compile, $timeout, uiCalendarConfig, toaster) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.currentSelectedDate=null;
    $scope.currentSelectedDateId="selectedDay";
    $scope.minSlot = 30;
    $scope.startAtMins = 0;
    $scope.openTime = "08:00:00",
    $scope.closeTime = "20:00:00",
    $scope.startAtMins = 0;
    
    //
    $scope.allowClick = true;
    
  //TO-DO devono non essere editabili: editable=false
    $scope.response = {
        	closed:["2017-0-1","2017-0-6","2017-0-8","2017-0-15","2017-0-22","2017-0-29"],
        	full: ["2017-0-2","2017-0-3","2017-0-4","2017-0-5"]
        };
    

    /* event source that contains custom events on the scope */
    $scope.events = {
    		color: "gray", 
    		events: [
      {title: 'All Day Event',start: new Date(y, m, 1)},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(2017, 0, 11, 10, 0),end: new Date(2017, 0, 11, 11, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(2017, 0, 11, 11, 0),end: new Date(2017, 0, 11, 12, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(2017, 0, 11, 12, 0),end: new Date(2017, 0, 11, 13, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(2017, 0, 11, 14, 0),end: new Date(2017, 0, 11, 15, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(2017, 0, 11, 17, 0),end: new Date(2017, 0, 11, 18, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(2017, 0, 11, 19, 0),end: new Date(2017, 0, 11, 22, 0),allDay: false},
      {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ]};
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
    
    
    /* Render Tooltip */
    $scope.getDayAdditionalClass = function( date ) {
        if($scope.isClosed(date)){
        	return ' closed ';
        }
        if($scope.isFull(date)){
        	return ' red ';
        }
        return ' green ';
    };
    
    $scope.isClosed = function(date){
    	var dateString = "";
    	var year = date.year(); 
    	var month = date.month();
    	var day = date.date();
    	dateString = year+"-"+month+"-"+day;
    	var closed = $scope.response.closed;
    	return date.day()==0 || closed.indexOf(dateString)>=0;
    };
    
    $scope.isFull = function(date){
    	var dateString = "";
    	var year = date.year();
    	var month = date.month();
    	var day = date.date();
    	dateString = year+"-"+month+"-"+day;
    	var closed = $scope.response.full;
    	return closed.indexOf(dateString)>=0;
    };

    $scope.dayClick = function(date, jsEvent, view) {
    	//se siamo nelal vista giorno aggiungi un appuntamento
    	if(view.name=="agendaDay"){
    		if(!$scope.allowClick){
    			$scope.allowClick = true;
    		}else{
        		$scope.allowClick = true;
        		var appLength = 45;
        		var title = "app";
       			$scope.addAppointment(date, appLength, title)  	
    		}
  		
    	}else{//altrimenti vai alla vista giorno
    		$scope.allowClick = false;
    		if( $scope.isClosed(date)){
    			toaster.error("", "Il negozio � chiuso nel giorno selezionato. Scegliere un altro giorno.");
    		}else if ($scope.isFull(date)){
    			toaster.error("", "Nel giorno selezionato non ci sono spazi liberi per il servizio selezionato.");
    		}else {
    			uiCalendarConfig.calendars['myCalendar1'].fullCalendar('changeView','agendaDay');
    			uiCalendarConfig.calendars['myCalendar1'].fullCalendar('gotoDate',date);
    		}
    		
    	}

    };

    /*
     * Aggiungi un appuntamento in questa data della lunghezza appLength (in minuti)
     */
    $scope.addAppointment = function(date,appLength,title){
    	
    	var startDate = $scope.getStartMoment(date);
    	var start = $scope.formtDate(startDate) ;
    	var endDate =  $scope.getEndMoment(startDate,appLength);
    	var end = $scope.formtDate(endDate) ;
    	
    	//rimuove l'appuntamento se ne è gia stato creato uno
    	if( $scope.currentSelectedDate){
    		uiCalendarConfig.calendars['myCalendar1'].fullCalendar('removeEventSource',$scope.currentSelectedDate);
    	}
    	
    	//crea nuovo appuntamemto
    	$scope.currentSelectedDate = [
    	              	  	        {
    	              	  	        	id: $scope.currentSelectedDateId,
    	              	  	            title  : title,
    	              	  	            start  : start,
    	              	  	            end: end,
    	              	  	        }
    	              	          ];
    	uiCalendarConfig.calendars['myCalendar1'].fullCalendar('addEventSource',$scope.currentSelectedDate);
    }
    
    $scope.formtDate = function(date){
    	var yyyy = date.getFullYear().toString();                                    
        var mm = (date.getMonth()+1).toString();        
        var dd  = (date.getDate()).toString();  
    	var hh = date.getHours().toString();
    	var mi = date.getMinutes().toString();
        return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0])+"T"+(hh[1]?hh:"0"+hh[0])+":"+(mi[1]?mi:"0"+mi[0])+":00";
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
    
    
    
    $scope.renderDay = function (date, cell) {
    	
        cell.addClass($scope.getDayAdditionalClass(date) );
    }
    
    //mostra gli eventi solo quando la view è giorno
    $scope.showEventsOnlyOnDay = function(event, element, view){
    	if(event.id==$scope.currentSelectedDateId){
    		return true;
    	}
    	return view.name=="agendaDay";
    }
    
    $scope.removeCurrentSelectedDate = function(event, element, view){
    	if(event.id==$scope.currentSelectedDateId){
    		uiCalendarConfig.calendars['myCalendar1'].fullCalendar('removeEventSource',$scope.currentSelectedDate);
    		currentSelectedDate=null;
    	}
    }
     
    
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
       // eventClick: $scope.removeCurrentSelectedDate

      }
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events];



   
    
    
};


