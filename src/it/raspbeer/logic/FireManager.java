package it.raspbeer.logic;

import org.apache.log4j.Logger;

public class FireManager {
	

	private static Logger logger = Logger.getLogger(FireManager.class);
	
	private static double difference = 0.5d;
	
	public static void checkFire(double asIs, double toBe, boolean on, boolean mote) {
		logger.debug(asIs+" "+toBe+" "+on+" "+mote);
		if(on) {

			if(toBe>0 && asIs+difference>toBe) {
				fireOff();
			} else if(toBe>0 && asIs-difference<toBe) {
				fireOn();
			}			
		}

	}
	
	public FireManager() {
		
	}
	
	public static void fireOn() {
		if(!Relay.getInstance().isOn(1)) {
			Buzzer.getInstance().beep(2000);
			Buzzer.getInstance().pause(200);
			Buzzer.getInstance().beep(2000);
			Relay.getInstance().on(1);
			spark();
		}

	}
	
	public static void fireOff() {
		if(Relay.getInstance().isOn(1)) {
			Buzzer.getInstance().beep(200);
			Buzzer.getInstance().pause(200);
			Buzzer.getInstance().beep(200);
			Buzzer.getInstance().pause(200);
			Buzzer.getInstance().beep(200);
			Relay.getInstance().off(1);	
		}

	}
	
	private static void spark() {
		Relay.getInstance().on(2);
		Buzzer.getInstance().pause(10000);
		Relay.getInstance().off(2);
	}
	
}
