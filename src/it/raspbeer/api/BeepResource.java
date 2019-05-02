package it.raspbeer.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import it.raspbeer.logic.Buzzer;

@Path("/1.0/beep")
public class BeepResource {
	
	@GET
	@Path("/")
	@Produces(MediaType.TEXT_HTML)
	public String getBeep(@QueryParam("millis") Integer millis){
		Buzzer.getInstance().beep(millis);
		return "ok";
	}
}
