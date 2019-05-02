package it.raspbeer.api;


import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.log4j.Logger;

import it.raspbeer.logic.FireManager;
//import it.raspbeer.logic.FireManager;
import it.raspbeer.logic.RaspberryTemperature;

@Path("/1.0/temperatura")
public class TemperatureResource {
	
	private static Logger logger = Logger.getLogger(TemperatureResource.class);
	
	@GET
	@Path("/")
	@Produces(MediaType.TEXT_HTML)
	public String getTemperatura(@QueryParam("id") String id){

		
		return ""+RaspberryTemperature.getTemperature(0);

	}
	
	@GET
	@Path("/list")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Double> getTemperatures(@QueryParam("tdaRaggiungere") String tdaRaggiungere, @QueryParam("mute") int mute){
		logger.debug("Servizio "+tdaRaggiungere);
		
		Double toBe = 0d;
		try {
			toBe = new Double(tdaRaggiungere);
		} catch (Exception e) {
			toBe = -1d;
		}
		
		List<Double> toReturn = RaspberryTemperature.getTemperaturesList();
		Double asIs = toReturn.get(0);

		FireManager.checkFire(asIs, toBe, true, mute==1);
		
		return toReturn;

	}
	
	@GET
	@Path("/a")
	@Produces(MediaType.TEXT_HTML)
	public String getTemperature(){
		return RaspberryTemperature.getTemperatures();
	}
	

	
}
