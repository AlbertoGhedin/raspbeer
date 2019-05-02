package it.raspbeer.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import it.raspbeer.logic.Relay;

@Path("/1.0/realy")
public class RelayResource {

	@GET
	@Path("/on1")
	@Produces(MediaType.TEXT_HTML)
	public String on1(){
		Relay.getInstance().on(1);
		return "ok";
	}
	
	@GET
	@Path("/off1")
	@Produces(MediaType.TEXT_HTML)
	public String off1(){
		Relay.getInstance().off(1);
		return "ok";
	}
	
	@GET
	@Path("/on2")
	@Produces(MediaType.TEXT_HTML)
	public String on2(){
		Relay.getInstance().on(2);
		return "ok";
	}
	
	@GET
	@Path("/off2")
	@Produces(MediaType.TEXT_HTML)
	public String off2(){
		Relay.getInstance().off(2);
		return "ok";
	}
	
	@GET
	@Path("/on3")
	@Produces(MediaType.TEXT_HTML)
	public String on3(){
		Relay.getInstance().on(3);
		return "ok";
	}
	
	@GET
	@Path("/off3")
	@Produces(MediaType.TEXT_HTML)
	public String off3(){
		Relay.getInstance().off(3);
		return "ok";
	}
	
	@GET
	@Path("/on4")
	@Produces(MediaType.TEXT_HTML)
	public String on4(){
		Relay.getInstance().on(4);
		return "ok";
	}
	
	@GET
	@Path("/off4")
	@Produces(MediaType.TEXT_HTML)
	public String off4(){
		Relay.getInstance().off(4);
		return "ok";
	}
	
	
}
