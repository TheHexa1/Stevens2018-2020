package queryProcessing;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class Helper {
	
	final static Charset ENCODING = StandardCharsets.ISO_8859_1;
	
	//function to read input from a file
	public List<String> readTextFile(String fileName) throws IOException {
	    Path path = Paths.get(fileName);
	    return Files.readAllLines(path, ENCODING);
	}

	//function to write to a file
	public void writeToFile(String content, String filename) {
		
		boolean append = false;
		boolean autoFlush = true;
		String charset = "UTF-8";
		String filePath = "./src/queryProcessing/" + filename + ".java";

		File file = new File(filePath);
		FileOutputStream fos;
		OutputStreamWriter osw;
		try {
			fos = new FileOutputStream(file, append);
			osw = new OutputStreamWriter(fos, charset);
			
			BufferedWriter bw = new BufferedWriter(osw);
			PrintWriter pw = new PrintWriter(bw, autoFlush);
			
			pw.write(content);			
			pw.close();
		} catch (Exception e) {
			e.printStackTrace();
		}		
	}
}
