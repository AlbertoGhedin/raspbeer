package it.raspbeer.logic;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ExcelExporter {


	public static void export(JSONObject ricettaCompleta, File outfile) throws JSONException, ParseException, IOException {

		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet andamentoSheet = workbook.createSheet("Andamento");
		andamentoSheet.setColumnWidth(0, 20000);
		
		XSSFSheet ricettaSheet = workbook.createSheet("Ricetta");
		ricettaSheet.setColumnWidth(0, 7000);
		ricettaSheet.setColumnWidth(1, 10000);
		ricettaSheet.setColumnWidth(2, 10000);
		ricettaSheet.setColumnWidth(3, 10000);
		ricettaSheet.setColumnWidth(4, 10000);
		ricettaSheet.setColumnWidth(5, 10000);
		ricettaSheet.setColumnWidth(6, 10000);
		ricettaSheet.setColumnWidth(7, 10000);
		ricettaSheet.setColumnWidth(8, 10000);
		
		
		Object[][] datatypes = new Object[400][10] ;

		
		JSONObject ricetta = ricettaCompleta.getJSONObject("ricetta");
		String note = ricettaCompleta.getString("note");
		String moltiplicatore = ricettaCompleta.getString("moltiplicatore");
		String nome = ricettaCompleta.getString("nome");
		
		int rowNum = 0;
		System.out.println("Creating excel");


		datatypes[rowNum][0] = "MASHING";
		rowNum++;
		datatypes[rowNum][0] = "Nome";
		datatypes[rowNum][1] = "Inizio";
		datatypes[rowNum][2] = "Fine";
		datatypes[rowNum][3] = "Durata Ipotizzata";
		datatypes[rowNum][4] = "Durata Effettiva";
		datatypes[rowNum][5] = "Temperatura";
		rowNum++;

		//get the phases
		JSONArray mashing = ricetta.getJSONObject("fasi").getJSONObject("mashing").getJSONArray("sottofasi");
		for(int i=0; i<mashing.length();i++) {
			JSONObject jo = mashing.getJSONObject(i);
			datatypes[rowNum][0] = jo.optString("nome");
			datatypes[rowNum][1] = jo.optString("inizio");
			datatypes[rowNum][2] = jo.optString("fine");
			datatypes[rowNum][3] = jo.optString("tempo");
			datatypes[rowNum][4] = compareDates(jo.optString("fine"),jo.optString("inizio"));
			datatypes[rowNum][5] = jo.optString("temperatura");
			rowNum++;
		}
		datatypes[rowNum][0] = "";
		rowNum++;
		datatypes[rowNum][0] = "";
		rowNum++;


		datatypes[rowNum][0] = "SPARGING";
		rowNum++;
		datatypes[rowNum][0] = "Nome";
		datatypes[rowNum][1] = "Inizio";
		datatypes[rowNum][2] = "Fine";
		datatypes[rowNum][3] = "Durata Ipotizzata";
		datatypes[rowNum][4] = "Durata Effettiva";
		datatypes[rowNum][5] = "Temperatura";

		rowNum++;

		//get the phases
		JSONArray sparging = ricetta.getJSONObject("fasi").getJSONObject("sparging").getJSONArray("sottofasi");
		for(int i=0; i<sparging.length();i++) {
			JSONObject jo = sparging.getJSONObject(i);
			datatypes[rowNum][0] = jo.optString("nome");
			datatypes[rowNum][1] = jo.optString("inizio");
			datatypes[rowNum][2] = jo.optString("fine");
			datatypes[rowNum][3] = jo.optString("tempo");
			datatypes[rowNum][4] = compareDates(jo.optString("fine"),jo.optString("inizio"));
			datatypes[rowNum][5] = jo.optString("temperatura");

			rowNum++;
		}

		datatypes[rowNum][0] = "";
		rowNum++;
		datatypes[rowNum][0] = "";
		rowNum++;

		datatypes[rowNum][0] = "BOLLITURA";
		rowNum++;
		datatypes[rowNum][0] = "Nome";
		datatypes[rowNum][1] = "Inizio";
		datatypes[rowNum][2] = "Fine";
		datatypes[rowNum][3] = "Durata Ipotizzata";
		datatypes[rowNum][4] = "Durata Effettiva";
		datatypes[rowNum][5] = "Luppolo";
		datatypes[rowNum][6] = "Grammi";
		datatypes[rowNum][7] = "Tempo";
		rowNum++;

		//get the phases
		JSONArray bollitura = ricetta.getJSONObject("fasi").getJSONObject("bollitura").getJSONArray("sottofasi");
		for(int i=0; i<bollitura.length();i++) {
			JSONObject jo = bollitura.getJSONObject(i);
			datatypes[rowNum][0] = jo.optString("nome");
			datatypes[rowNum][1] = jo.optString("inizio");
			datatypes[rowNum][2] = jo.optString("fine");
			datatypes[rowNum][3] = jo.optString("durata");
			datatypes[rowNum][4] = compareDates(jo.optString("fine"),jo.optString("inizio"));
			datatypes[rowNum][5] = jo.optString("luppolo");
			datatypes[rowNum][6] = jo.optString("grammi");
			datatypes[rowNum][7] = jo.optString("tempo");
			rowNum++;
		}

		rowNum = 0;
		for (Object[] datatype : datatypes) {
			Row row = ricettaSheet.createRow(rowNum++);
			int colNum = 0;
			for (Object field : datatype) {
				Cell cell = row.createCell(colNum++);
				if (field instanceof String) {
					cell.setCellValue((String) field);
				} else if (field instanceof Integer) {
					cell.setCellValue((Integer) field);
				}
			}
		}

		
		
		
		Row row = andamentoSheet.createRow(0);
				Cell cell = row.createCell(0);
		cell.setCellValue((String) "Ricetta: "+nome);
		
		
		SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");

		String dateString = format.format( new Date()   );
		row = andamentoSheet.createRow(1);
		cell = row.createCell(0);
		cell.setCellValue((String) "Data: "+dateString);
		
		
		row = andamentoSheet.createRow(2);
		cell = row.createCell(0);
		cell.setCellValue((String) "Fatta litri: "+23*new Integer(moltiplicatore));
		
		row = andamentoSheet.createRow(3);
		cell = row.createCell(0);
		cell.setCellValue((String) "Note: "+note);
		
		
		
		
		
		
		
		
		FileOutputStream outputStream = new FileOutputStream(outfile);

		
		
		
		
		workbook.write(outputStream);
		workbook.close();

		System.out.println("Done");
	}

	private static String compareDates(String d1, String d2) throws ParseException {
		if(d1==null || d2==null || d1.length()==0 || d2.length()==0) {
			return "NA";
		}
		d1 = "01/01/2001 "+ d1;
		d2 = "01/01/2001 "+ d2;
		SimpleDateFormat parser = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		long milliseconds =  (parser.parse(d1).getTime()- parser.parse(d2).getTime());

		return Math.round(Math.floor(milliseconds/(1000*60*60)))+":"+Math.round((milliseconds/(1000*60))%(60))+":"+Math.round((milliseconds/1000)%(60));
	}



	//    private static void createRowsForObject(JSONObject json, int rowNum) {
	//    	for(int i=0; i<json.length(); i++) {
	//    		String aProperty = json.keys()
	//    	}
	//    	Row row = sheet.createRow(rowNum++);
	//    }

}