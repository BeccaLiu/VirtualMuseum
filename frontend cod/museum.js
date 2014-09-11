//window.onload = showContents();
var req = false;
var json;
var artlist;
var title;




function checkbox(input) {
	var str;
	var j = 0;
	for (var i = 0; i < input.length; i++) {
		if (input[i].checked) {
			str[j] = input[i].value;
			j++;
		}
	}
}

function getCookie(c_name)
{
var c_value = document.cookie;
var c_start = c_value.indexOf(" " + c_name + "=");
if (c_start == -1)
{
c_start = c_value.indexOf(c_name + "=");
}
if (c_start == -1)
{
c_value = null;
}
else
{
c_start = c_value.indexOf("=", c_start) + 1;
var c_end = c_value.indexOf(";", c_start);
if (c_end == -1)
{
c_end = c_value.length;
}
c_value = unescape(c_value.substring(c_start,c_end));
}
return c_value;
}

function setCookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}
function makeRequest() {
	if (window.XMLHttpRequest) {
		try {
			req = new XMLHttpRequest();
		} catch(e) {
			req = false;
		}

	} else {
		if (window.ActiveXObject) {
			try {
				req = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
			}
		}
	}
	if (req) {
		var url = "";
		var searchkey = document.getElementById("title").value;
		var searchtype = document.getElementById("searchtype").value;
		var museum = document.getElementsByName("museum");
		var arttype = document.getElementsByName("arttype");
		var startyear = document.getElementById("s_year").value;
		var endyear = document.getElementById("e_year").value;

		url = "http://192.168.1.116:8088/myapp-0.1-dev/hello?search_type=" + searchtype;
		
		url += "&museum=";
		for (var i = 0; i < museum.length -1; i++) {
			if (museum[i].checked){
				url += museum[i].value + ",";
				
				}
		//		alert(museum[i].checked);
		}
		//alert(museum.length);
		if (museum[museum.length - 1].checked)
			url += museum[museum.length - 1].value;
	//		alert(museum[museum.length - 1].checked);

		url += "&type=";
		for (var i = 0; i < arttype.length - 1; i++) {
			if (arttype[i].checked)
				url += arttype[i].value + ",";
		}
		if (arttype[arttype.length - 1].checked)
			url += arttype[arttype.length - 1].value;

		url += "&syear=" + startyear + "&eyear=" + endyear + "&keyword=" + searchkey;
		//	alert(url);
	//	alert(url);
		req.onreadystatechange = showContents;
		req.open("GET", url, true);
		//	req.setRequestHeader("Connection", "Close");
		//	req.setRequestHeader("Method", "GET" + url + "HTTP/1.1");
		req.send(null);
	} else {
		document.getElementById("content").innerHTML = "Sorry, but I couldn't create an XMLHttpRequest";
	}
}

var page_index = 1;
var start_index = 1;
var end_index = 5;
var count = 0;

function first()
{
 if(count ==0){
 makeRequest();
 coount++;
 }
 
}

function showcontent(index)
{ 
count = 1;
  page_index = index;
  var tableOutput = "";
	var pageOutput = "";
  var num = artlist.length;
  
			var pagenum = Math.floor(num / 10);
			var k = 0;
			if (num != 0) {

				tableOutput += "<ul class=\"pic-mode-box clearfix\">";
				for (var i =  (page_index-1)*10  ; i < (page_index-1)*10+10 && i < num; i++) {
					tableOutput += "<li>";
					tableOutput += "<div class=\"pic-wrap\">";
			//		alert(artlist[i].imageurl);
					tableOutput += "<a class=\"pic\" href=\"detail.html?title="+encodeURIComponent(artlist[i].title)+"&artist="+encodeURIComponent(artlist[i].artist)+"&type="+encodeURIComponent(artlist[i].type)+"&year="+encodeURIComponent(artlist[i].year)+"&imageurl="+encodeURIComponent(artlist[i].imageurl)+"&dimensions="+encodeURIComponent(artlist[i].dimensions)+"&m_name="+encodeURIComponent(artlist[i].m_name);
					tableOutput += "&m_website="+encodeURIComponent(artlist[i].m_website)+"&m_address="+encodeURIComponent(artlist[i].m_address)+"&description="+encodeURIComponent(artlist[i].description)+  "\" target=\"_blank\">";
					tableOutput += "<img src=\"" + artlist[i].imageurl + "\"> </a> ";
					tableOutput += "</div>";
					tableOutput += "<h4><a href=\"/cell_phone/index359145.shtml\" target=\"_blank\">" + artlist[i].title + "</a></h4>";
					tableOutput += "</li>";
				}
				tableOutput += "</ul>";
			if(pagenum != 0)
			{
			    pageOutput += "<div class=\"pagebar\">";
			
				
				
				
				
				if(page_index > end_index)
				{
				  end_index = page_index;
				  start_index = end_index-4;
				  if(start_index < 1) start_index = 1;
				}
				else if(page_index <start_index)
				{
				   start_index = page_index;
				   end_index = start_index+4;
				   if(end_index > pagenum) end_index = pagenum;
				}
					var pre_page = page_index -1;
				if(pre_page <1) pre_page = 1;
		
				pageOutput += "<button  onclick=\"showcontent("+pre_page+")\" class=\"sel\"> Pre</button>";
				
				
				
				
				
				//pageOutput += "<button  onclick=\"showcontent("+pre_page+")\" class=\"sel\"> Pre</button>";
				for( k = start_index; k <= end_index ; k++)
				{
				  if (k <= pagenum) {
				            if(k == page_index) pageOutput += "<button  onclick=\"showcontent("+k+")\" class=\"selected\"  >" + k + "</button>";
							else pageOutput += "<button  onclick=\"showcontent("+k+")\" class=\"sel\">" + k + "</button>";
						}

				}
				var next_page = page_index+1;
									pageOutput += "<button  onclick=\"showcontent("+next_page+")\" class=\"sel\"> Next</button>";

									pageOutput += "<span class=\"sel\">" + "Total: " + num + " pages" + "</span>";
					pageOutput += "</div>";
			}


				document.getElementById("content").innerHTML = tableOutput;
				document.getElementById("page-change").innerHTML = pageOutput;
			} else {
				tableOutput = "<h1> can not find any result" + num + "</h1>";
				document.getElementById("content").innerHTML = tableOutput;
  
}

}

function showContents() {
	var tableOutput = "";
	var pageOutput = "";
	if (req.readyState == 4) {
		if (req.status == 200) {
			json = eval("(" + req.responseText + ")");
			artlist = json.records;
			var num = artlist.length;
			var pagenum = Math.floor(num / 10);
			var iteatorPage = pagenum / 5;
			var iteator = 0;
			var k = 0;
			if (num != 0) {

				tableOutput += "<ul class=\"pic-mode-box clearfix\">";
				for (var i =  (page_index-1)*10  ; i < (page_index-1)*10+10; i++) {
					tableOutput += "<li>";
					tableOutput += "<div class=\"pic-wrap\">";
					tableOutput += "<a class=\"pic\" href=\"detail.html?title="+artlist[i].title+"&artist="+artlist[i].artist+"&type="+artlist[i].type+"&year="+artlist[i].year+"&imageurl="+artlist[i].imageurl+"&dimensions="+artlist[i].dimensions+"&m_name="+artlist[i].m_name;
					tableOutput += "&m_website="+artlist[i].m_website+"&m_address="+artlist[i].m_address+"&description="+artlist[i].description+  "\" target=\"_blank\">";
					tableOutput += "<img src=\"" + artlist[i].imageurl + "\"> </a> ";
					tableOutput += "</div>";
					tableOutput += "<h4><a href=\"/cell_phone/index359145.shtml\" target=\"_blank\">" + artlist[i].title + "</a></h4>";
					tableOutput += "</li>";
				}
				tableOutput += "</ul>";
			if(pagenum != 0)
			{
			    pageOutput += "<div class=\"pagebar\">";
				if(page_index > end_index)
				{
				  end_index = page_index;
				  start_index = end_index-4;
				  if(start_index < 1) start_index = 1;
				}
				else if(page_index <start_index)
				{
				   start_index = page_index;
				   end_index = start_index+4;
				   if(end_index > page_num) end_index = page_num;
				}
				var pre_page = page_index -1;
				if(pre_page <1) pre_page = 1;
				pageOutput += "<button  onclick=\"showcontent("+pre_page+")\" class=\"sel\"> Pre</button>";
				
				for( k = start_index; k <= end_index; k++)
				{
				  if (k <= pagenum) {
				  if(k == page_index) pageOutput += "<button  onclick=\"showcontent("+k+")\" class=\"sel\">" + k + "</button>";
						else	pageOutput += "<button  onclick=\"showcontent("+k+")\" class=\"sel\">" + k + "</button>";
						}
				
				}
					var next_page = page_index+1;
									pageOutput += "<button  onclick=\"showcontent("+next_page+")\" class=\"sel\"> Next</button>";
					pageOutput += "<span class=\"sel\">" + "Total: " + num + " pages" + "</span>";
					pageOutput += "</div>";
			}

/*			if (pagenum != 0) {
					pageOutput += "<div class=\"pagebar\">";
					for ( k = (1 + iteator * 5); k <= (iteator + 1) * 5; k++) {
						if (k <= pagenum) {
							pageOutput += "<button  onclick=\"showContents("+k+")\" class=\"sel\">" + k + "</button>";
						}
					}
					if (k < pagenum) {
						pageOutput += "<span class=\"sel\">" + "next" + "</span>";
					}
					pageOutput += "<span class=\"sel\">" + "Total: " + num + " pages" + "</span>";
					pageOutput += "</div>";
				}
				*/

				document.getElementById("content").innerHTML = tableOutput;
				document.getElementById("page-change").innerHTML = pageOutput;
			} else {
				tableOutput = "<h1> can not find any result" + num + "</h1>";
				document.getElementById("content").innerHTML = tableOutput;
			}
		} else {
			if (status == 500)
				var outMsg = "not working now!!";
			else
				var outMsg = " error" + req.status;
			document.getElementById("content").innerHTML = outMsg;
		}
	}

}

//var responseText = "{\"records\" :[{\"title\": \"A Battle from the Trojan War\",\"artist\" : \"Joseph Baumhauer\",\"type\": \"painting\",\"year\" : 1765,\"imageurl\":\"http://www.getty.edu/art/collections/images/thumb/00653601-T.JPG\",\"dimensions\":\"Leaf: 38.3 x 29.8 cm (15 1/16 x 11 3/4 in.)\",\"description\":\"Textile Fragment,  Unknown, France, Paris, 17th century, Textiles, Satin damask\"},{\"title\": \"Cameo Gem set into a Ring\",\"artist\": \"Unknown\",\"type\": \"drawing\",\"year\": 1880,\"imageurl\":\"http://www.getty.edu/collection/GRI/thumb/grioc0002474-T.jpg\",\"dimensions\":\"Object: H: 63.5 x W (body): 24.9 cm (25 x 9 13/16 in.)\",\"description\":\"\"},{\"title\": \"A Battle from the Trojan War\",\"artist\" : \"Joseph Baumhauer\",\"type\": \"painting\",\"year\" : 1765,\"imageurl\":\"http://www.getty.edu/art/collections/images/thumb/00653601-T.JPG\",\"dimensions\":\"Leaf: 38.3 x 29.8 cm (15 1/16 x 11 3/4 in.)\",\"description\":\"Textile Fragment,  Unknown, France, Paris, 17th century, Textiles, Satin damask\"},{\"title\": \"Cameo Gem set into a Ring\",\"artist\": \"Unknown\",\"type\": \"drawing\",\"year\": 1880,\"imageurl\":\"http://www.getty.edu/collection/GRI/thumb/grioc0002474-T.jpg\",\"dimensions\":\"Object: H: 63.5 x W (body): 24.9 cm (25 x 9 13/16 in.)\",\"description\":\"\"},{\"title\": \"A Battle from the Trojan War\",\"artist\" : \"Joseph Baumhauer\",\"type\": \"painting\",\"year\" : 1765,\"imageurl\":\"http://www.getty.edu/art/collections/images/thumb/00653601-T.JPG\",\"dimensions\":\"Leaf: 38.3 x 29.8 cm (15 1/16 x 11 3/4 in.)\",\"description\":\"Textile Fragment,  Unknown, France, Paris, 17th century, Textiles, Satin damask\"},{\"title\": \"Cameo Gem set into a Ring\",\"artist\": \"Unknown\",\"type\": \"drawing\",\"year\": 1880,\"imageurl\":\"http://www.getty.edu/collection/GRI/thumb/grioc0002474-T.jpg\",\"dimensions\":\"Object: H: 63.5 x W (body): 24.9 cm (25 x 9 13/16 in.)\",\"description\":\"\"},{\"title\": \"A Battle from the Trojan War\",\"artist\" : \"Joseph Baumhauer\",\"type\": \"painting\",\"year\" : 1765,\"imageurl\":\"http://www.getty.edu/art/collections/images/thumb/00653601-T.JPG\",\"dimensions\":\"Leaf: 38.3 x 29.8 cm (15 1/16 x 11 3/4 in.)\",\"description\":\"Textile Fragment,  Unknown, France, Paris, 17th century, Textiles, Satin damask\"},{\"title\": \"Cameo Gem set into a Ring\",\"artist\": \"Unknown\",\"type\": \"drawing\",\"year\": 1880,\"imageurl\":\"http://www.getty.edu/collection/GRI/thumb/grioc0002474-T.jpg\",\"dimensions\":\"Object: H: 63.5 x W (body): 24.9 cm (25 x 9 13/16 in.)\",\"description\":\"\"},{\"title\": \"A Battle from the Trojan War\",\"artist\" : \"Joseph Baumhauer\",\"type\": \"painting\",\"year\" : 1765,\"imageurl\":\"http://www.getty.edu/art/collections/images/thumb/00653601-T.JPG\",\"dimensions\":\"Leaf: 38.3 x 29.8 cm (15 1/16 x 11 3/4 in.)\",\"description\":\"Textile Fragment,  Unknown, France, Paris, 17th century, Textiles, Satin damask\"},{\"title\": \"Cameo Gem set into a Ring\",\"artist\": \"Unknown\",\"type\": \"drawing\",\"year\": 1880,\"imageurl\":\"http://www.getty.edu/collection/GRI/thumb/grioc0002474-T.jpg\",\"dimensions\":\"Object: H: 63.5 x W (body): 24.9 cm (25 x 9 13/16 in.)\",\"description\":\"\"},{\"title\": \"A Battle from the Trojan War\",\"artist\" : \"Joseph Baumhauer\",\"type\": \"painting\",\"year\" : 1765,\"imageurl\":\"http://www.getty.edu/art/collections/images/thumb/00653601-T.JPG\",\"dimensions\":\"Leaf: 38.3 x 29.8 cm (15 1/16 x 11 3/4 in.)\",\"description\":\"Textile Fragment,  Unknown, France, Paris, 17th century, Textiles, Satin damask\"},{\"title\": \"Cameo Gem set into a Ring\",\"artist\": \"Unknown\",\"type\": \"drawing\",\"year\": 1880,\"imageurl\":\"http://www.getty.edu/collection/GRI/thumb/grioc0002474-T.jpg\",\"dimensions\":\"Object: H: 63.5 x W (body): 24.9 cm (25 x 9 13/16 in.)\",\"description\":\"\"}]}";

