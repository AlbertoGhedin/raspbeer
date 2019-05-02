package it.raspbeer.logic;

import org.apache.log4j.Logger;

import com.pi4j.io.gpio.GpioController;
import com.pi4j.io.gpio.GpioFactory;
import com.pi4j.io.gpio.GpioPinDigitalOutput;
import com.pi4j.io.gpio.PinState;
import com.pi4j.io.gpio.RaspiPin;

public class Relay {
	
	private static Logger logger = Logger.getLogger(Relay.class);
	private static Relay instance = null; 
	
	private   GpioController gpioRelayLED1;   
	private   GpioPinDigitalOutput relayLED1;
	
	private   GpioController gpioRelayLED2;          
	private   GpioPinDigitalOutput relayLED2;
	        
	private   GpioController gpioRelayLED3;          
	private   GpioPinDigitalOutput relayLED3;
	        
	private   GpioController gpioRelayLED4;          
	private   GpioPinDigitalOutput relayLED4;
	
	public static synchronized Relay getInstance() {
		if(instance == null) {
			instance = new Relay();
		}
		return instance;
	}
	
    private Relay() {

    	gpioRelayLED1 = GpioFactory.getInstance();   
    	if(gpioRelayLED1.getProvisionedPin(RaspiPin.GPIO_27)==null)
    		relayLED1 = gpioRelayLED1.provisionDigitalOutputPin(RaspiPin.GPIO_27,"RelayLED1",PinState.HIGH); //OFF
    	else
    		relayLED1=(GpioPinDigitalOutput)gpioRelayLED1.getProvisionedPin(RaspiPin.GPIO_27);
    	
    	gpioRelayLED2 = GpioFactory.getInstance();          
    	if(gpioRelayLED2.getProvisionedPin(RaspiPin.GPIO_06)==null)
    		relayLED2 = gpioRelayLED2.provisionDigitalOutputPin(RaspiPin.GPIO_06,"RelayLED2",PinState.HIGH); //OFF
    	else
    		relayLED2=(GpioPinDigitalOutput)gpioRelayLED2.getProvisionedPin(RaspiPin.GPIO_06);
    	
    	gpioRelayLED3 = GpioFactory.getInstance();          
    	if(gpioRelayLED3.getProvisionedPin(RaspiPin.GPIO_05)==null)
    		relayLED3 = gpioRelayLED3.provisionDigitalOutputPin(RaspiPin.GPIO_05,"RelayLED3",PinState.HIGH); //OFF
    	else
    		relayLED3=(GpioPinDigitalOutput)gpioRelayLED3.getProvisionedPin(RaspiPin.GPIO_05);
    	
    	gpioRelayLED4 = GpioFactory.getInstance();          
    	if(gpioRelayLED4.getProvisionedPin(RaspiPin.GPIO_04)==null)
    		relayLED4 = gpioRelayLED4.provisionDigitalOutputPin(RaspiPin.GPIO_04,"RelayLED4",PinState.HIGH);
    	else
    		relayLED4=(GpioPinDigitalOutput)gpioRelayLED4.getProvisionedPin(RaspiPin.GPIO_04);
    	
    	off(1);
    	off(2);
    	off(3);
    	off(4);
    }
    
	
	
	public void on(int num)  {
		GpioPinDigitalOutput relayLED = null;
		logger.debug("lowing relay "+num);
		switch (num) {
		case 1:
			relayLED=relayLED1;
			break;
		case 2:
			relayLED=relayLED2;
			break;
		case 3:
			relayLED=relayLED3;
			break;
		case 4:
			relayLED=relayLED4;
			break;
		}
		
		if (relayLED.getState().isHigh()){
			relayLED.low();	
			logger.debug("relay set to low");
		}else {
			logger.debug("relay already low");
		}
		
	}
	
	public void off(int num)  {
		logger.debug("highing relay "+num);
		GpioPinDigitalOutput relayLED = null;
		switch (num) {
		case 1:
			relayLED=relayLED1;
			break;
		case 2:
			relayLED=relayLED2;
			break;
		case 3:
			relayLED=relayLED3;
			break;
		case 4:
			relayLED=relayLED4;
			break;
		}
		
		if (relayLED.getState().isLow()){
			relayLED.high();	
			logger.debug("relay set to high");
		}else {
			logger.debug("relay already high");
		}
		
	}
	
	public boolean isOn(int num)  {
		logger.debug("highing relay "+num);
		GpioPinDigitalOutput relayLED = null;
		switch (num) {
		case 1:
			relayLED=relayLED1;
			break;
		case 2:
			relayLED=relayLED2;
			break;
		case 3:
			relayLED=relayLED3;
			break;
		case 4:
			relayLED=relayLED4;
			break;
		}
		
		return relayLED.isLow();
		
	}

}
