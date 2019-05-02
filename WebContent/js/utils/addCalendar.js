
createEventOnMyCalendar = function(apointment){
	try{
//		prep some variables 
		var startDate = new Date(2017,2,19,18,30,0,0,0); // beware: month 0 = january, 11 = december 
		var endDate = new Date(2017,2,19,19,30,0,0,0);
		/*	var title = "My nice event";
		var eventLocation = "Vazzola via gemona 2, 31028";
		var notes = "Some notes about this event.";
		var success = function(message) { alert("Success: " + JSON.stringify(message)); };
		var error = function(message) { alert("Error: " + message); };*/



		// create an event silently (on Android < 4 an interactive dialog is shown which doesn't use this options) with options: 
		var calOptions = window.plugins.calendar.getCalendarOptions(); // grab the defaults 
		calOptions.firstReminderMinutes = firstReminderMinutes; 
		calOptions.secondReminderMinutes = secondReminderMinutes;

		if(websiteUrl){
			// And the URL can be passed since 4.3.2 (will be appended to the notes on Android as there doesn't seem to be a sep field) 
			calOptions.url = websiteUrl;
		}


		// on iOS the success handler receives the event ID (since 4.3.6) 
		window.plugins.calendar.createEventWithOptions(evetTitle,eventLocation,notes,startDate,endDate,calOptions,eventSuccess,eventError);
	}catch(err){
		//alert("Errore",err)
	}
}