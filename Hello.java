package mypackage;
import java.io.*;
import java.net.URLDecoder;

import javax.servlet.*;
import javax.servlet.http.*;

import java.util.ArrayList;
import java.util.List;

import org.openrdf.OpenRDFException;
import org.openrdf.repository.RepositoryConnection;
import org.openrdf.repository.Repository;
import org.openrdf.repository.RepositoryException;
import org.openrdf.repository.http.HTTPRepository;
import org.openrdf.model.Value;
import org.openrdf.query.TupleQuery;
import org.openrdf.query.TupleQueryResult;
import org.openrdf.query.BindingSet;
import org.openrdf.query.QueryLanguage;

public class Hello extends HttpServlet {
	public void doGet(HttpServletRequest request, HttpServletResponse response  ) throws ServletException, IOException
	{
		
		response.setHeader("Access-Control-Allow-Origin", "*");
		String seasameServer = "http://127.0.0.1:8088/openrdf-sesame";
		String repositoryID = "VirtualMuseum";
	
		String keyword = request.getParameter("keyword"); // keyword is handled
		
		if(keyword == null) keyword = "";
		else keyword = URLDecoder.decode(keyword, "utf-8");
		StringBuilder sb = new StringBuilder();

		//sb.append(keyword);
		String syear = request.getParameter("syear"); // year is handled
		if(syear == null) syear = "0";
		String eyear = request.getParameter("eyear");
		if(eyear == null) eyear = "3000";
		ArrayList<String> museums = new ArrayList<String>();
		ArrayList<String> types = new ArrayList<String>();
		
		
		String type = request.getParameter("type"); // may have multiple choices
		if(type == null) type = "all";
		if(type.equals("all")){
			types.add("Costumes");
			types.add("Photographs");
			types.add("Sculpture");
			types.add("Paintings");
			//types.add("Prints");
		}
		else{
			String[] arr = type.split(",");
			int len = arr.length;
			for(int i = 0; i < len ;i++)
				types.add(arr[i]);
		}
		
		
		String museum = request.getParameter("museum"); // museum is handled
		if(museum == null) museum = "all";
		if(museum.equals("all"))
		{
			museums.add("LACMA");
			museums.add("The J. Paul Getty Museum");
			
		}
		else{
			 String[] arr = museum.split(",");
			 int len = arr.length;
			 for(int i = 0; i< len ;i++){
				 museums.add(URLDecoder.decode(arr[i],"utf-8"));
			 //    if(arr[i].equals("The J. Paul Getty Museum"))
			  //  	 sb.append("good");
			   //   if(museums.get(i).equals("The J. Paul Getty Museum"))
			   // 	 sb.append("good");
			    //  sb.append(arr[i]);
			    //  sb.append("\n");
			   //   sb.append(museums.get(i));
			 }
		}
		
		String search_type = request.getParameter("search_type");
		
	//	search_type = "artwork";
	//	if(search_type.equals("artist"))
	//		search_type = "<http://xmlns.com/vtm/0.1/Artist>";
	//		else search_type = "<http://xmlns.com/vtm/0.1/Artwork>"; // type is handled
		

		Repository repo = new HTTPRepository(seasameServer,repositoryID);
		PrintWriter out = response.getWriter();
	//	sb.append(museums.toString());
	//	sb.append("  "+types.toString());
		sb.append("{\"records\":[");
		
	//	String[] years = year.split(" ");
	//	int start_year = Integer.parseInt(years[0]);
	//	int end_year = Integer.parseInt(years[1]); // year is handled
		
	//	StringBuilder strb = new StringBuilder();
		
		
			try {
				RepositoryConnection con = repo.getConnection();
				try{
					
					if(search_type == null) search_type = "artwork";
					
					
					if(search_type.equals("artwork"))
					{
						int i = 0;
				//		sb.append("in artwork \n");
						search_type = "<http://xmlns.com/vtm/0.1/Artwork>";
						String query_start = "select  distinct ?description ?m_address ?m_website ?dimension ?imageurl ?type ?title ?artistname ?year where { ?artwork <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>"+search_type+".?artwork <http://xmlns.com/vtm/0.1/title> ?title FILTER REGEX(?title,\".*"+keyword+".*\",\"i\"). ?artwork <http://xmlns.com/vtm/0.1/artist> ?artist. ?artist  <http://xmlns.com/foaf/0.1/name> ?artistname. ?artwork <http://xmlns.com/vtm/0.1/year> ?year  FILTER(?year >= "+syear+") FILTER( ?year <= " +eyear+").  ?artwork <http://xmlns.com/vtm/0.1/dimension> ?dimension.   ?artwork <http://xmlns.com/vtm/0.1/imageURL> ?imageurl. OPTIONAL{?artwork <http://xmlns.com/vtm/0.1/description> ?description.}";
						
						for(int m = 0; m < museums.size(); m++)
						{
						//	sb.append("in museum: "+m+" \n");
							String qm = query_start + "?museum <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/vtm/0.1/Museum> . ?artwork  <http://xmlns.com/vtm/0.1/museum> ?museum .  ?museum <http://xmlns.com/vtm/0.1/address> ?m_address. ?museum <http://xmlns.com/vtm/0.1/website> ?m_website.      ?museum <http://xmlns.com/foaf/0.1/name> " +"\""+ museums.get(m)+"\". ";
							
							
							for(int t = 0; t < types.size(); t++)
							{
							//	sb.append("in types: "+t+"\n");
								String queryString = qm +  "?artwork  <http://xmlns.com/vtm/0.1/type> \""+types.get(t)+"\" .}";
						//		sb.append("get query string \n");
								TupleQuery tupleQuery = con.prepareTupleQuery(QueryLanguage.SPARQL, queryString);
					//			sb.append("prepare query \n" + queryString+ " \n" );
								TupleQueryResult result = tupleQuery.evaluate();
						//		sb.append("get result  \n");
								List<String> bindingNames = result.getBindingNames();
						//		sb.append("before while "+ bindingNames.size()+" \n");
								
								try{
									while(result.hasNext()){
									   BindingSet bindingSet = result.next();
									   Value vTitle= bindingSet.getValue("title");
									   String vType = types.get(t);
									   Value vYear = bindingSet.getValue("year");
									   Value vDimension = bindingSet.getValue("dimension");
									   Value vImage = bindingSet.getValue("imageurl");
									   Value vArtist = bindingSet.getValue("artistname");
									   Value vm_address = bindingSet.getValue("m_address");
									   Value vm_website = bindingSet.getValue("m_website");
									   
									   Value vDes ;
									   if(bindingSet.hasBinding("description"))
										   vDes = bindingSet.getValue("description");
									   else vDes = null;
									//   Value vDes = bindingSet.getValue("description");
									   String mDes="";
									   if(vDes == null) mDes= "\"No Description\"";
									   else mDes = vDes.toString();
									   if(i != 0) sb.append(",");
									//   String ye = vYear.toString();
									 //  sb.append(" \n "+ye.split("\\^")[0]+" \n");
									   sb.append("{\"title\":"+vTitle.toString() +",\"artist\":"+vArtist.toString() +",\"type\":\""+vType.toString()+"\",\"year\":"+vYear.toString().split("\\^")[0]+",\"imageurl\":"+vImage.toString()+ ",\"dimensions\":"+vDimension.toString() +",\"m_website\":" +vm_website.toString()+",\"m_address\":"+vm_address.toString()+",\"description\":"+mDes+",\"m_name\":\""+museums.get(m).toString()+"\"}");
									   i++;
									}
									
									
									//sb.append("]}");
					//				sb.append("after while \n");
								}
								finally{
									result.close();
								}
							}
						}
						
						sb.append("]}");
						
						
					}
					else
					{
						int i = 0;
						search_type = "<http://xmlns.com/vtm/0.1/Artist>";
String query_start = "select distinct ?description ?m_address ?m_website ?dimension ?imageurl ?type ?title ?artistname ?year where { ?artwork <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>  <http://xmlns.com/vtm/0.1/Artwork>.?artwork <http://xmlns.com/vtm/0.1/title> ?title. ?artwork <http://xmlns.com/vtm/0.1/artist> ?artist.  ?artist  <http://xmlns.com/foaf/0.1/name> ?artistname FILTER REGEX(?artistname,\".*"+keyword+".*\",\"i\"). ?artwork <http://xmlns.com/vtm/0.1/year> ?year  FILTER(?year >= "+syear+") FILTER( ?year <= " +eyear+").  ?artwork <http://xmlns.com/vtm/0.1/dimension> ?dimension.  ?artwork <http://xmlns.com/vtm/0.1/imageURL> ?imageurl. OPTIONAL{?artwork <http://xmlns.com/vtm/0.1/description> ?description. ";
						
						for(int m = 0; m < museums.size(); m++)
						{
						//	sb.append("in museum: "+m+" \n");
							String qm = query_start + "?museum <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/vtm/0.1/Museum> . ?artwork  <http://xmlns.com/vtm/0.1/museum> ?museum .  ?museum <http://xmlns.com/vtm/0.1/address> ?m_address. ?museum <http://xmlns.com/vtm/0.1/website> ?m_website.      ?museum <http://xmlns.com/foaf/0.1/name> " +"\""+ museums.get(m)+"\". ";
							
							
							for(int t = 0; t < types.size(); t++)
							{
							//	sb.append("in types: "+t+"\n");
								String queryString = qm +  "?artwork  <http://xmlns.com/vtm/0.1/type> \""+types.get(t)+"\" .}";
						//		sb.append("get query string \n");
								TupleQuery tupleQuery = con.prepareTupleQuery(QueryLanguage.SPARQL, queryString);
						//		sb.append("prepare query \n" + queryString+ " \n" );
								TupleQueryResult result = tupleQuery.evaluate();
						//		sb.append("get result  \n");
								List<String> bindingNames = result.getBindingNames();
						//		sb.append("before while "+ bindingNames.size()+" \n");
								
								try{
									while(result.hasNext()){
									   BindingSet bindingSet = result.next();
									   Value vTitle= bindingSet.getValue("title");
									   String vType = types.get(t);
									   Value vYear = bindingSet.getValue("year");
									   Value vDimension = bindingSet.getValue("dimension");
									   Value vImage = bindingSet.getValue("imageurl");
									   Value vArtist = bindingSet.getValue("artistname");
									   Value vm_address = bindingSet.getValue("m_address");
									   Value vm_website = bindingSet.getValue("m_website");
									   Value vDes;
									   String mDes;
									   if(bindingSet.hasBinding("description"))
										   vDes = bindingSet.getValue("description");
									   else vDes= null;
									   if(vDes == null) mDes = "\"No Description\"";
									   else mDes = vDes.toString();
									   if(i != 0) sb.append(",");
									   i++;
									   sb.append("{\"title\":"+vTitle.toString() +",\"artist\":"+vArtist.toString() +",\"type\":"+vType.toString()+",\"year\":"+vYear.toString().split("\\^")+",\"imageurl\":"+vImage.toString()+ ",\"dimensions\":"+vDimension.toString() +",\"m_website\":" +vm_website.toString()+",\"m_address\":"+vm_address.toString()+",\"description\":"+mDes+"}");
									   
									}
									
									
									//sb.append("]}");
					//				sb.append("after while \n");
								}
								finally{
									result.close();
								}
							}
						}
						
						sb.append("]}");
						
						
					}
					
					
					
					
					
					
					
					
					
				//	String queryString = "SELECT ?imageurl  ?dimension ?year  ?title  ?type ?m_address ?m_name ?m_website ?museum  ?artistname where{ ?artwork <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> "+search_type+". ?artwork <http://xmlns.com/vtm/0.1/title> ?title.  ?artwork  <http://xmlns.com/vtm/0.1/type> ?type . ?artwork <http://xmlns.com/vtm/0.1/artist> ?artist. ?artist  <http://xmlns.com/foaf/0.1/name> ?artistname. ?artwork <http://xmlns.com/vtm/0.1/year> ?year. ?artwork <http://xmlns.com/vtm/0.1/dimension> ?dimension. ?artwork <http://xmlns.com/vtm/0.1/imageURL> ?imageurl. }";
					// ?artwork <http://example.com/artists/Dimension> ?dimension.
			
				
				}
				finally{
				con.close();
				}
				
			} catch (OpenRDFException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			out.println(sb.toString());
			out.close();
	
		
	}

}
