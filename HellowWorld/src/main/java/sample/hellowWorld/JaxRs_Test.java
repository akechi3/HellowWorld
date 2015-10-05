package sample.hellowWorld;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

@Path("/JaxRsSample")
public class JaxRs_Test {
	
	private static final Logger LOG = LogManager.getLogger(JaxRs_Test.class);

	@GET
    @Path("/json")
    @Produces({ "application/json" })
    public String getJSON() {
        return "{\"\":\"World\"}";
    }

    @GET
    @Path("/xml")
    @Produces({ "application/xml" })
    public String getXml() {
        return "<xml><result>World</result></xml>";
    }
    
//    @GET
//    @Path("/html")
//    @Produces(MediaType.TEXT_HTML)
//    public Viewable findAll() {
//        return new Viewable("/user_list.jsp");
//    }

    @Path("/upload")
    @POST
    @Consumes("multipart/form-data")
    public Response uploadFile(MultipartFormDataInput input,
    		@HeaderParam("index") String index) {
//    		,@PathParam("index") String index) {
    	
		LOG.info("upload start");

		System.out.println("readpos:" + index);
		Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
        // upload parameter name
        List<InputPart> inputParts = uploadForm.get("file");

        int idx = 0;
		int read = 0;

		for (InputPart inputPart: inputParts) {
        	try (
    			InputStream inputStream = inputPart.getBody(InputStream.class,null);
	        	FileOutputStream fop = new FileOutputStream(
	        			new File("C:/usr/bin/eclipse/workspace/HellowWorld/upload/uploadFile-"  + idx), true);
			) {
	        	byte[] bytes = new byte[1024];
				while ((read = inputStream.read(bytes)) != -1) {
					fop.write(bytes, 0, read);
				}
    		} catch (IOException ioe) {
    			LOG.error("file output Error!!", ioe);
    		}
		}
		return Response.status(Response.Status.OK).build();
    }
}
