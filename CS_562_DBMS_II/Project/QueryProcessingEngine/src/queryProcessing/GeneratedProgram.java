package queryProcessing; 

class Mftable {

  float avg_quant_2;

  public float getavg_quant_2() {
	return avg_quant_2;
  }

  public void setavg_quant_2(float avg_quant_2) {
	this.avg_quant_2=avg_quant_2;
  }

  String cust;

  public String getcust() {
	return cust;
  }

  public void setcust(String cust) {
	this.cust=cust;
  }

  int count_quant_3;

  public int getcount_quant_3() {
	return count_quant_3;
  }

  public void setcount_quant_3(int count_quant_3) {
	this.count_quant_3=count_quant_3;
  }

  int sum_quant_3;

  public int getsum_quant_3() {
	return sum_quant_3;
  }

  public void setsum_quant_3(int sum_quant_3) {
	this.sum_quant_3=sum_quant_3;
  }

  int count_quant_2;

  public int getcount_quant_2() {
	return count_quant_2;
  }

  public void setcount_quant_2(int count_quant_2) {
	this.count_quant_2=count_quant_2;
  }

  int sum_quant_2;

  public int getsum_quant_2() {
	return sum_quant_2;
  }

  public void setsum_quant_2(int sum_quant_2) {
	this.sum_quant_2=sum_quant_2;
  }

  int count_quant_1;

  public int getcount_quant_1() {
	return count_quant_1;
  }

  public void setcount_quant_1(int count_quant_1) {
	this.count_quant_1=count_quant_1;
  }

  int sum_quant_1;

  public int getsum_quant_1() {
	return sum_quant_1;
  }

  public void setsum_quant_1(int sum_quant_1) {
	this.sum_quant_1=sum_quant_1;
  }

  float avg_quant_1;

  public float getavg_quant_1() {
	return avg_quant_1;
  }

  public void setavg_quant_1(float avg_quant_1) {
	this.avg_quant_1=avg_quant_1;
  }

  float avg_quant_3;

  public float getavg_quant_3() {
	return avg_quant_3;
  }

  public void setavg_quant_3(float avg_quant_3) {
	this.avg_quant_3=avg_quant_3;
  }

  	}

public class GeneratedProgram {

	public static void main(String[] args) throws java.sql.SQLException {
	
		java.sql.Connection con = null;
	
		con = java.sql.DriverManager.getConnection(
				"jdbc:postgresql://localhost:5432/db1", "postgres", "root");
		
		java.sql.Statement statement = con.createStatement();		
		
		java.sql.ResultSet resultSet = statement.executeQuery("SELECT * FROM public.sales");
		
		System.out.printf("%-10.30s   %-10.30s   %-10.30s   %-10.30s	\n",
				 "cust", "avg_quant_1", "avg_quant_2", "avg_quant_3");		
	
		java.util.HashMap<String, Mftable> hm = new java.util.HashMap<>();
		
		while (resultSet.next()) {
			int year = resultSet.getInt("year");
			String cust = resultSet.getString("cust");
			String prod = resultSet.getString("prod");
			int day = resultSet.getInt("day");
			int month = resultSet.getInt("month");
			String state = resultSet.getString("state");
			int quant = resultSet.getInt("quant");				
			
			if(year==1997) {
				String key = (cust);
				Mftable mf0 = new Mftable();
				if(!hm.containsKey(key)) {					
					mf0.setcust(cust);					
					hm.put(key, mf0);
				}
			}
		}

		resultSet = statement.executeQuery("SELECT * FROM public.sales");
		while (resultSet.next()) {
			int year = resultSet.getInt("year");
			String cust = resultSet.getString("cust");
			String prod = resultSet.getString("prod");
			int day = resultSet.getInt("day");
			int month = resultSet.getInt("month");
			String state = resultSet.getString("state");
			int quant = resultSet.getInt("quant");				
			
			if(year==1997) {
				String key = (cust);
				for(Mftable mf : hm.values()) {

					if(mf.getcust().equals(cust) && state.equals("NY")) {
						mf.setcount_quant_1(mf.getcount_quant_1()+1);
						mf.setsum_quant_1(mf.getsum_quant_1()+quant);
						float t = (float)mf.getsum_quant_1()/mf.getcount_quant_1();
						mf.setavg_quant_1(Double.isNaN(t)?0:t);					}
				}
			}
		}

		resultSet = statement.executeQuery("SELECT * FROM public.sales");
		while (resultSet.next()) {
			int year = resultSet.getInt("year");
			String cust = resultSet.getString("cust");
			String prod = resultSet.getString("prod");
			int day = resultSet.getInt("day");
			int month = resultSet.getInt("month");
			String state = resultSet.getString("state");
			int quant = resultSet.getInt("quant");				
			
			if(year==1997) {
				String key = (cust);
				for(Mftable mf : hm.values()) {

					if(mf.getcust().equals(cust) && state.equals("NJ")) {
						float t = (float)mf.getsum_quant_2()/mf.getcount_quant_2();
						mf.setavg_quant_2(Double.isNaN(t)?0:t);						mf.setcount_quant_2(mf.getcount_quant_2()+1);
						mf.setsum_quant_2(mf.getsum_quant_2()+quant);
					}
				}
			}
		}

		resultSet = statement.executeQuery("SELECT * FROM public.sales");
		while (resultSet.next()) {
			int year = resultSet.getInt("year");
			String cust = resultSet.getString("cust");
			String prod = resultSet.getString("prod");
			int day = resultSet.getInt("day");
			int month = resultSet.getInt("month");
			String state = resultSet.getString("state");
			int quant = resultSet.getInt("quant");				
			
			if(year==1997) {
				String key = (cust);
				for(Mftable mf : hm.values()) {

					if(mf.getcust().equals(cust) && state.equals("CT")) {
						mf.setcount_quant_3(mf.getcount_quant_3()+1);
						mf.setsum_quant_3(mf.getsum_quant_3()+quant);
						float t = (float)mf.getsum_quant_3()/mf.getcount_quant_3();
						mf.setavg_quant_3(Double.isNaN(t)?0:t);					}
				}
			}
		}
		

		for(Mftable mf : hm.values()) {

			if(mf.getavg_quant_1() > mf.getavg_quant_2() && mf.getavg_quant_1() > mf.getavg_quant_3()) 
				System.out.printf("%-10.30s   %-10.3f   %-10.3f   %-10.3f   \n",
						mf.getcust(),
						mf.getavg_quant_1(),
						mf.getavg_quant_2(),
						mf.getavg_quant_3());
		}
				
	}
}