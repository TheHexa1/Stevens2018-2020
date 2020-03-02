package queryProcessing;

import dbConnection.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Engine {

public static void main(String[] args) {
		
		Helper helper = new Helper();
		
		Set<String> vars = new HashSet<String>();	
		List<String> fileContent = Collections.emptyList();;
		
		try {			
			fileContent = helper.readTextFile("InputQuery.txt");
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		//list of selection attributes
		ArrayList<String> ls_selection_attrs = new ArrayList<>(Arrays.asList(fileContent.get(0).split(",")));
		ls_selection_attrs.replaceAll(String::trim);
		vars.addAll(ls_selection_attrs);
		
		//list of grouping attributes
		ArrayList<String> ls_grouping_attrs = new ArrayList<>(Arrays.asList(fileContent.get(2).split(",")));
		ls_grouping_attrs.replaceAll(String::trim);
				
		//list of aggregates
		ArrayList<String> ls_aggregates = new ArrayList<>(Arrays.asList(fileContent.get(3).split(",")));
		ls_aggregates.replaceAll(String::trim);
		vars.addAll(ls_aggregates);		
		
		List<String> ls_all_vars = new ArrayList<>(vars);		
		
		for(int i=0; i<ls_all_vars.size(); i++) {
			String s = ls_all_vars.get(i);
			
			if(s.contains("avg")) {
				ls_all_vars.add(s.replace("avg", "count"));
				
				if(!ls_all_vars.contains(s.replace("avg", "sum")))
					ls_all_vars.add(s.replace("avg", "sum"));
			}			
			
		}		
		
		for(int i=0; i<ls_all_vars.size(); i++) {
			String s = ls_all_vars.get(i);
			if(s.contains("avg")) {
				ls_all_vars.remove(i);
				ls_all_vars.add(s);
			}
			if(s.contains("/")) {				
				ls_all_vars.remove(i);
			}
		}
		
		ArrayList<String> gv0 = new ArrayList<>();
		for(int i=0; i<ls_all_vars.size(); i++) {
			if(ls_all_vars.get(i).contains("0"))
				gv0.add(ls_all_vars.get(i));			
		}
		
		//invoke DbConnector class to connect to database
		DBConnector dbc = new DBConnector();
		
		String output0 = "package queryProcessing; \n\nclass Mftable {\r\n" + "\r\n" + "  ";
		String output1 = "";
		
		//create class Mf_table and its getters and setters method
		for(String s: ls_all_vars) {			
			if(!s.contains("_")) {
				output1 += getJavaEquivalentType(dbc.getColumnType(s)) 
						+" "+ s +";\r\n\n";
				
				output1 += "  public "+getJavaEquivalentType(dbc.getColumnType(s))+ " get" + s + "() {\n"
						 + "	return "+ s + ";\n"
						 + "  }\n\n"
						 + "  public void set" + s + "(" 
						 + getJavaEquivalentType(dbc.getColumnType(s)) 
						 + " " + s + ") {\n"
						 + "	this." + s + "="+ s + ";\n"
						 + "  }\n\n  ";	
			}else {
				output1 += getJavaEquivalentType(s) 
						+" "+ s +";\r\n\n";
				
				output1 += "  public "+getJavaEquivalentType(s)+ " get" + s + "() {\n"
						 + "	return "+ s + ";\n"
						 + "  }\n\n"
						 + "  public void set" + s + "(" 
						 + getJavaEquivalentType(s) 
						 + " " + s + ") {\n"
						 + "	this." + s + "="+ s + ";\n"
						 + "  }\n\n  ";
			}
		}			
						
		String output2=	"	\r" + "}\n\n";		
		
		String output3= 
				"public class GeneratedProgram {\r\n" + 
				"\r\n" + 
				"	public static void main(String[] args) throws java.sql.SQLException {\r\n" + 
				"	\r\n" + 
				"		java.sql.Connection con = null;\r\n" + 
				"	\r\n" + 
				"		con = java.sql.DriverManager.getConnection(\r\n" + 
				"				\"jdbc:postgresql://localhost:5432/db1\", \"postgres\", \"root\");\r\n" + 
				"		\r\n" + 
				"		java.sql.Statement statement = con.createStatement();		\r\n" + 
				"		\r\n" + 
				"		java.sql.ResultSet resultSet = statement.executeQuery(\"SELECT * FROM public.sales\");\r\n" + 
				"		\r\n" +
				"		System.out.printf(\"%-10.30s";
		
		//to format printing
		for(int s=1; s<ls_selection_attrs.size(); s++) {
			output3 += "   %-10.30s";
		}
		
		output3 +=
				"	\\n\",\r\n				" +
				" \""+ls_selection_attrs.get(0)+"\"";
		
		for(int s=1; s<ls_selection_attrs.size(); s++) {
			output3 +=", \""+ls_selection_attrs.get(s)+"\"";
		}
		
		output3 += ");		\r\n";
		
		output3 += 
				"	\r\n" + 
				"		java.util.HashMap<String, Mftable> hm = new java.util.HashMap<>();\r\n" + 
				"		\r\n";
		
		output3 += "		while (resultSet.next()) {\r\n" + 
				"			int year = resultSet.getInt(\"year\");\r\n" + 
				"			String cust = resultSet.getString(\"cust\");\r\n" + 
				"			String prod = resultSet.getString(\"prod\");\r\n" + 
				"			int day = resultSet.getInt(\"day\");\r\n" + 
				"			int month = resultSet.getInt(\"month\");\r\n" + 
				"			String state = resultSet.getString(\"state\");\r\n" + 				
				"			int quant = resultSet.getInt(\"quant\");				\r\n" +						
				"			\r\n"; 
		
		//to check if where condition exists
		if(fileContent.size() == 7) {
			output3 += "			if("+fileContent.get(6)+") {\n";
		}
		
		output3 += "				String key = ("+ls_grouping_attrs.get(0);

		//Create hashmap key as concatenation of all Grouping attributes
		for(int ga=1; ga<ls_grouping_attrs.size(); ga++) {			
			if(ls_grouping_attrs.size()>1)
				output3 += "+\"_\"+";
			output3 += ls_grouping_attrs.get(ga);
		}	
		
		output3 += ");\n";
		
		output3 += "				Mftable mf0 = new Mftable();\r\n";
		
		output3 += "				if(!hm.containsKey(key)) {					\r\n";
		
		//setting grouping attributes
		for(int ga=0; ga<ls_grouping_attrs.size(); ga++) {
			output3 += "					mf0.set"+ls_grouping_attrs.get(ga)+"("+ls_grouping_attrs.get(ga)+");					\r\n";
		}
		
		//initializing values for min aggregate
		for(int s=0; s<ls_selection_attrs.size(); s++) {
			if(ls_selection_attrs.get(s).contains("min")) {
				output3 += "					mf0.set"+ls_selection_attrs.get(s)+"(Integer.MAX_VALUE);\r\n";
			}
		}
		
		output3 +=  "					hm.put(key, mf0);\r\n" + 
					"				}\n";
		//if grouping variable scans whole block
		if(fileContent.get(3).contains("0")) {
			output3 += 
					"				for(Mftable mf : hm.values()) {\r\n" + 
					"\r\n"+
					"					if(";
			
			if(getJavaEquivalentType(dbc.getColumnType(ls_grouping_attrs.get(0))).equals("String"))
				output3 += "mf.get"+ls_grouping_attrs.get(0)+"().equals("+ls_grouping_attrs.get(0)+")"; 
			else
				output3 += "mf.get"+ls_grouping_attrs.get(0)+"() == ("+ls_grouping_attrs.get(0)+")"; 
			
			for(int ga=1; ga<ls_grouping_attrs.size(); ga++) {
				if(getJavaEquivalentType(dbc.getColumnType(ls_grouping_attrs.get(ga))).equals("String"))
					output3 += " && mf.get"+ls_grouping_attrs.get(ga)+"().equals("+ls_grouping_attrs.get(ga)+")"; 
				else
					output3 += " && mf.get"+ls_grouping_attrs.get(ga)+"() == ("+ls_grouping_attrs.get(ga)+")";				 
			}
			
			output3 += ") {\r\n";
		
			for(int i=0; i<gv0.size(); i++) {
				if(gv0.get(i).contains("sum")) {
					output3 += "						mf.set"+gv0.get(i)+"(mf.get"+gv0.get(i)+"()+quant);\r\n";
				}if(gv0.get(i).contains("count")) {
					output3 +="						mf.set"+gv0.get(i)+"(mf.get"+gv0.get(i)+"()+1);\r\n";
				}if(gv0.get(i).contains("max")) {
					output3 +="						mf.set"+gv0.get(i)+"(mf.get"+gv0.get(i)+"() < quant ? quant : mf.get"+gv0.get(i)+"());\r\n";
				}if(gv0.get(i).contains("min")) {
					output3 +="						mf.set"+gv0.get(i)+"(mf.get"+gv0.get(i)+"() > quant ? quant : mf.get"+gv0.get(i)+"());\r\n";
				}if(gv0.get(i).contains("avg")) {					
					output3 += "						float t = (float)mf.get"+gv0.get(i).replace("avg", "sum")+"()/mf.get"+gv0.get(i).replace("avg", "count")+"();\r\n" + 
							"						mf.set"+gv0.get(i)+"(Double.isNaN(t)?0:t);\r\n";
				}					
			}
			
			output3 += "					}\r\n" + 
					"				}\r\n";
		}
		
		//to check if where condition exists
		if(fileContent.size() == 7) {
			output3 += "			}\n";
		}		
					
		output3 +=	"		}\n";			
		
		//more scans based on number of grouping variables 
		for(int s=0; s<Integer.valueOf(fileContent.get(1)); s++) {
			output3 += 
					"\n		resultSet = statement.executeQuery(\"SELECT * FROM public.sales\");\n";
			output3 += 
					"		while (resultSet.next()) {\r\n" + 
					"			int year = resultSet.getInt(\"year\");\r\n" + 
					"			String cust = resultSet.getString(\"cust\");\r\n" + 
					"			String prod = resultSet.getString(\"prod\");\r\n" + 
					"			int day = resultSet.getInt(\"day\");\r\n" + 
					"			int month = resultSet.getInt(\"month\");\r\n" + 
					"			String state = resultSet.getString(\"state\");\r\n" + 				
					"			int quant = resultSet.getInt(\"quant\");				\r\n" +						
					"			\r\n";
			
			//to check if where condition exists
			if(fileContent.size() == 7) {
				output3 += "			if("+fileContent.get(6)+") {\n";
			}
			
			output3 += "				String key = ("+ls_grouping_attrs.get(0);

			//Create hashmap key as concatenation of all GAs
			for(int ga=1; ga<ls_grouping_attrs.size(); ga++) {			
				if(ls_grouping_attrs.size()>1)
					output3 += "+\"_\"+";
				output3 += ls_grouping_attrs.get(ga); 
			}
			
			output3 += ");\n";
			
			output3 += "				for(Mftable mf : hm.values()) {\r\n" + 
					"\r\n";
			
			//to check if such that condition exists
			if(fileContent.size() >= 4 && !fileContent.get(4).isEmpty()) {
				output3 +="					if("+fileContent.get(4).split(",")[s]+") {\r\n";
			}
			
			for(int i=0; i<ls_all_vars.size(); i++) {
				
				if(ls_all_vars.get(i).contains(String.valueOf(s+1))) {
					if(ls_all_vars.get(i).contains("sum")) {
						output3 += "						mf.set"+ls_all_vars.get(i)+"(mf.get"+ls_all_vars.get(i)+"()+quant);\r\n";
					}if(ls_all_vars.get(i).contains("count")) {
						output3 +="						mf.set"+ls_all_vars.get(i)+"(mf.get"+ls_all_vars.get(i)+"()+1);\r\n";
					}if(ls_all_vars.get(i).contains("max")) {
						output3 +="						mf.set"+ls_all_vars.get(i)+"(mf.get"+ls_all_vars.get(i)+"() < quant ? quant : mf.get"+ls_all_vars.get(i)+"());\r\n";
					}if(ls_all_vars.get(i).contains("min")) {
						output3 +="						mf.set"+ls_all_vars.get(i)+"(mf.get"+ls_all_vars.get(i)+"() > quant ? quant : mf.get"+ls_all_vars.get(i)+"());\r\n";
					}if(ls_all_vars.get(i).contains("avg")) {					
						output3 += "						float t = (float)mf.get"+ls_all_vars.get(i).replace("avg", "sum")+"()/mf.get"+ls_all_vars.get(i).replace("avg", "count")+"();\r\n" + 
								"						mf.set"+ls_all_vars.get(i)+"(Double.isNaN(t)?0:t);";
					}	
				}	
			}
			
			if(fileContent.size() >= 4 && !fileContent.get(4).isEmpty()) {
				output3 += "					}\r\n";
			} 
			
			output3 += "				}\r\n";
			
			if(fileContent.size() == 7) {
				output3 += "			}\n";
			}								
			output3 +=	"		}\n";
		}	
				
		String output4 = 
					"		\r\n\n" + 				
					"		for(Mftable mf : hm.values()) {\r\n" + 
					"\r\n";
			
		if(fileContent.size() >= 6 && !fileContent.get(5).isEmpty()) {
			output4 += "			if("+fileContent.get(5)+") \r\n";
		}				
		
		output4 += "				System.out.printf(\"";
		
		//formatting output
		for(int i=0; i<ls_selection_attrs.size(); i++){					
			if(ls_selection_attrs.get(i).contains("avg"))
				output4 += "%-10.3f   ";
			else if(ls_selection_attrs.get(i).contains("/"))
				output4 += "%-10.3f   ";
			else
				output4 += "%-10.30s   ";  
		}				
			
		output4 += "\\n\",\r\n";
		
		for(int i=0; i<ls_selection_attrs.size(); i++){
			
			if(ls_selection_attrs.get(i).contains("avg")) {
				output4 += "						mf.get"+ls_selection_attrs.get(i)+"()";
			}else if(ls_selection_attrs.get(i).contains("/")) {
				output4 += "						(float)mf.get"+ls_selection_attrs.get(i).split("/")[0]+"()/mf.get"+ls_selection_attrs.get(i).split("/")[1]+"()";
			}else 
				output4 += "						mf.get"+ls_selection_attrs.get(i)+"()";
			
			if(i == ls_selection_attrs.size()-1)
				output4 += ");\r\n";
			else
				output4 += ",\r\n";
			
		}
			 
		output4 += 
			"		}\r\n" + 
			"				\r\n" + 
			"	}\r\n" + 
			"}";
		
		//generate java file
		helper.writeToFile(output0+output1+output2+output3+output4, "GeneratedProgram");		
	}
	
	//returns data type for given string
	public static String getJavaEquivalentType(String sqlType) {
		if(sqlType.equals("character varying") || sqlType.equals("character"))
			return "String";
		else if(sqlType.contains("avg"))
			return "float";
		
		else return "int";
	}
}
