package com.campuswriteruo;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.*;

@SuppressWarnings("serial")
public class CampuswriteruoServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
        resp.setContentType("application/json");
        String variable = req.getParameter("variable"); 
        PrintWriter writer = resp.getWriter();
        writer.write("{\"variable\":\""+variable+"\"}");
	}

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
           resp.setContentType("application/json");
           String variable = req.getParameter("variable"); 
           PrintWriter writer = resp.getWriter();
           writer.write("{\"variable\":\""+variable+"\"}");
    }

}