package it.raspbeer.logic;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.log4j.Logger;

public class FileReader {

	private static Logger logger = Logger.getLogger(FileReader.class);

	public static String readRicetta(String fileName)  {
		String note = readFile(fileName+"_note.txt");
		note = note.replace("\n", "");
		if(note==null) {
			note = "";
		}
		String ricetta = readFile(fileName+".json");
		return "{\"ricetta\":"+ricetta+", \"note\":\""+note+"\"}";
	}

	public static String readFile(String fileName)  {
		String toreturn = null;
		BufferedReader buf = null;
		try {
			File configDir = new File(System.getProperty("catalina.base"), "conf");
			File configFile = new File(configDir, fileName);
			InputStream is = new FileInputStream(configFile);
			
			buf = new BufferedReader(new InputStreamReader(is));

			String json = buf.readLine();
			StringBuilder sb = new StringBuilder();

			while(json != null){
				sb.append(json).append("\n");
				json = buf.readLine();
			}
			
			toreturn =  sb.toString();
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


		return toreturn;

	}
	
	
	


	
}
