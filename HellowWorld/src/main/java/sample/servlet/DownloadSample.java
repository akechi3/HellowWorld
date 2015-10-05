package sample.servlet;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class DownloadSample
 */
@WebServlet("/DownloadSample")
public class DownloadSample extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DownloadSample() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    OutputStream out = null;
	    InputStream in = null;
	    try {
	        response.setContentType("application/octet-stream");
	        response.setHeader(
	            "Content-Disposition",
	            "filename=\"test.zip\"");
	        in = new FileInputStream("C:/usr/bin/eclipse/workspace/HellowWorld/3G.zip");
	        out = response.getOutputStream();
	        byte[] buff = new byte[2048];
	        int len = 0;
	        while ((len = in.read(buff, 0, buff.length)) != -1) {
	            out.write(buff, 0, len);
	        }
	    } finally {
	        if (in != null) {
	            try {
	                in.close();
	            } catch (IOException e) {
	            }
	        }
	        if (out != null) {
	            try {
	                out.close();
	            } catch (IOException e) {
	            }
	        }
	    }
	}

}
