

//tempo minimo visibilità pagina intro
minIntroTime =2000; 


//evento su calendar
firstReminderMinutes = 180;
secondReminderMinutes = 30;
eventLocation = "Conegliano via XX settembre, 2";
eventSuccess = function(message) { alert("L'evento è stato registrato nel tuo calendario"); };
eventError = function(message) { alert("C'è stato un errore nella creazione dell'evento nel tuo calendario"); };
eventTitle = "ACME barbiere";
websiteUrl = "www.google.it";


//calendar configs
minSlot = 30;
startAtMins = 0;
openTime = "08:00:00";
closeTime = "20:00:00";



userInfos = [
             {	
            	 text: "Nome",
            	 property: "user.name",
            	 type: "text"
             },
             {	
            	 text: "Email",
            	 property: "user.email",
            	 type: "email"
             },
             {	
            	 text: "Telefono",
            	 property: "user.telefono",
            	 type: "text"
             }];