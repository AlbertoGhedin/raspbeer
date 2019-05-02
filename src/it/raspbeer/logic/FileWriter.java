package it.raspbeer.logic;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;

import org.apache.log4j.Logger;
import org.json.JSONObject;

public class FileWriter {

	
	private static Logger logger = Logger.getLogger(FileWriter.class);

	public static String writeRicetta(String content)  {
		try {
			File configDir = new File(System.getProperty("catalina.base"), "conf");
			File configFile = new File(configDir, "ricetta_out.xlsx");
			JSONObject jsonObj = new JSONObject(content);
			ExcelExporter.export(jsonObj, configFile);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "Errore nel salvataggio";
		}
		return "Ricetta salvata";
	}
	
	public static String writeFile(String fileName, String content)  {
		BufferedWriter buf = null;
		try {
			File configDir = new File(System.getProperty("catalina.base"), "conf");
			File configFile = new File(configDir, fileName);
			OutputStream os = new FileOutputStream(configFile);
			
			buf = new BufferedWriter(new OutputStreamWriter(os));

			buf.write(content);
		} catch (Exception e) {
			logger.error(e);
		}finally {
			if(buf!=null) {
				try {
					buf.close();
				} catch (IOException e) {
					logger.error(e);
				}
			}
		}
		return "ok";

	}
	
}
