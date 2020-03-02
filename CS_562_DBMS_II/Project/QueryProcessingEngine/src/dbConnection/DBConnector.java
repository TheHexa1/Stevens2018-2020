package dbConnection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


public class DBConnector {
	Connection con = null;	
	
	//default constructor to initialize database connection
	public DBConnector() {
		
		try {
			con = DriverManager.getConnection(
					"jdbc:postgresql://localhost:5432/db1", "postgres", "root");
			
		}catch(SQLException e) {
			System.out.println("Connection failure.");
			e.printStackTrace();
		}
	}	
	
	//helper function to print all sales table records
	public void printAllRecords() {
		
		try {
			Statement statement = con.createStatement();
			System.out.println("Reading sales records...\n");
			
			System.out.printf("%-10.30s  %-20.30s %-10.30s  %-10.30s  "
					+ "%-10.30s %-10.30s  %-10.30s%n",
					"cust", "prod", "day", "month", "year", "state", "quant");
			ResultSet resultSet = statement.executeQuery("SELECT * FROM public.sales");
			
			while (resultSet.next()) {
				System.out.printf("%-10.30s  %-20.30s %-10.30s  %-10.30s  "
						+ "%-10.30s %-10.30s  %-10.30s%n",
						resultSet.getString("cust"), resultSet.getString("prod"),
						resultSet.getString("day"), resultSet.getString("month"),
						resultSet.getString("year"), resultSet.getString("state"),
						resultSet.getString("quant"));
			}
		}catch(SQLException e) {
			System.out.println("Error while fetching records!");
			e.printStackTrace();
		}
	}
	
	//helper function to get column type from given schema
	public String getColumnType(String column) {
		
		try {
			Statement statement = con.createStatement();
			ResultSet res=statement.executeQuery
					("SELECT column_name, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS " + 
					"WHERE TABLE_NAME = 'sales'");
			
			while(res.next()) {
				if(res.getString("column_name").equals(column))
					return res.getString("data_type");
			}		
		}catch(SQLException e) {
			System.out.println("Error while fetching records!");
			e.printStackTrace();
		}
		
		return "";		
	}
}
