package it.raspbeer.logic;

import org.apache.log4j.Logger;

import com.pi4j.io.gpio.GpioController;
import com.pi4j.io.gpio.GpioFactory;
import com.pi4j.io.gpio.GpioPinDigitalOutput;
import com.pi4j.io.gpio.PinState;
import com.pi4j.io.gpio.RaspiPin;

public class Buzzer {
	
	private static Logger logger = Logger.getLogger(Buzzer.class);

	final GpioController gpioBuzzer;
	final GpioPinDigitalOutput buzzer;

	private static Buzzer instance;
	
    public Buzzer() {
    	gpioBuzzer = GpioFactory.getInstance();
    	buzzer = gpioBuzzer.provisionDigitalOutputPin(RaspiPin.GPIO_29, "Buzzer", PinState.LOW);
    	
    	//to start buzzer
    	buzzer.high();
    	pause(5);
    	buzzer.low();
    }
    
    public static Buzzer getInstance() {
    	if(instance == null) {
    		instance = new Buzzer();
    	}
    	return instance;
    }
    
    public synchronized void  beep(int millis) {
    	 buzzer.high();
    	 try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {
			logger.error(e);
		}
    	 buzzer.low();
    }
    
    public void  pause(int millis) {
   	 try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {
			logger.error(e);
		}

   }

}
