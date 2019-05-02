var prenotamiApp = angular.module('MainModuleApp');

prenotamiApp.factory('messages', [function() {
	   var msgs = {
			   "calendar.close.txt":{"it":"Il negozio è chiuso nel giorno selezionato. Scegliere un altro giorno"},
			   "calendar.noavail.txt":{"it":"Nel giorno selezionato non ci sono spazi liberi per il servizio selezionato"},
			   "calendar.passed.txt":{"it":"Selezionare una data o un orario successivo all'attuale"},
			   "calendar.overlap.txt":{"it":"Si scelga un orario che non vada in sovrapposizione con altri eventi"},
			   
			   "summary.booked.txt":{"it":"L'appuntamento è stato registrato"},
			   "summary.booked.overlap.error":{"it":"Qualcuno ti ha appena soffiato l'appuntamento.. Siamo spiacenti, perfavore effettua una nuova prenotazione"},
			   "summary.calendar.txt":{"it":"L'appuntamento è stato aggiunto nel tuo calendario personale"},
			   "summary.calendar.error.txt":{"it":"OPS.. L'appuntamento non è stato salvato nel calendario"},
			   " calendar.connection.error.txt":{"it":"OPS.. C'è un problema di collegamento.. Perfavore provare più tardi."},
			  
			   
			   "request.delete.ok.txt":{"it":"L'appuntamento è stato cancellato"},
			   "request.delete.ko.txt":{"it":"OPS.. C'è stato un errore, perfavore riprova più tardi"},
			   
			  
			   
	   	
	   };
	   var language = "it";
	   return function(text) {
		   return msgs[text][language];
	   };
	 }]);
