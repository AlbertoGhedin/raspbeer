package it.raspbeer.api;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import it.raspbeer.logic.FileReader;
import it.raspbeer.logic.FileWriter;

@Path("/1.0/ricetta")
public class RicettaResource {
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public String getFile(@QueryParam("file") String file){
		return FileReader.readRicetta(file);
	}
	
	@POST
	@Path("/")
	@Produces(MediaType.TEXT_HTML)
	public String setFile(String content){
		return FileWriter.writeRicetta(content);
	}
}
