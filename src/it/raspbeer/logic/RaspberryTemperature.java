package it.raspbeer.logic;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;

import com.pi4j.component.temperature.TemperatureSensor;
import com.pi4j.component.temperature.impl.TmpDS18B20DeviceType;
import com.pi4j.io.w1.W1Device;
import com.pi4j.io.w1.W1Master;

public class RaspberryTemperature {
	private static Logger logger = Logger.getLogger(RaspberryTemperature.class);
	private static Logger audit = Logger.getLogger("TempAudit");
	
	
	public static double getTemperature(int index) {
		logger.debug("IN:"+ index);
		W1Master master = new W1Master();
		List<W1Device> w1Devices = master.getDevices(TmpDS18B20DeviceType.FAMILY_CODE);
		W1Device device = w1Devices.get(index);
		double temp = ((TemperatureSensor) device).getTemperature();
		logger.debug("OUT:"+ temp);
		try {
			logger.debug("OUT:"+ device.getId()+" "+device.getValue());
		} catch (IOException e) {
			logger.error("Error reading the value of the device",e);
		}
		return temp;
	}
	
	public static String getTemperatures() {
		W1Master master = new W1Master();
		List<W1Device> w1Devices = master.getDevices(TmpDS18B20DeviceType.FAMILY_CODE);
		String s = "";
		for (W1Device device : w1Devices) {
		    //this line is enought if you want to read the temperature
		     s =s+"\n"+ ("Temperature: " + ((TemperatureSensor) device).getTemperature());
		    //returns the temperature as double rounded to one decimal place after the point

		    try {
		        s = s+"      "+("1-Wire ID: " + device.getId() +  " value: " + device.getValue());
		        //returns the ID of the Sensor and the  full text of the virtual file
		    } catch (IOException e) {
		        e.printStackTrace();
		    }
		}
		return s;

	}
	
	
	public static List<Double> getTemperaturesList() {
		W1Master master = new W1Master();
		List<W1Device> w1Devices = master.getDevices(TmpDS18B20DeviceType.FAMILY_CODE);
		List<Double> s = new ArrayList<Double>();
		String auditString = "";

		for (W1Device device : w1Devices) {
		    //this line is enought if you want to read the temperature
		     double temp = (((TemperatureSensor) device).getTemperature()) ;

		     auditString = auditString+device.getId()+","+ temp+",";
		     
		     s.add(temp);
		}
		
		audit.info(auditString);
		
		return s;

	}
	

}


