import java.io.*;
import java.util.*;

public class CreateDataBaseServerTest{
public static void main(String[] args) {
    String[] name = {"Abandoned", "Acronym Finder", "Aeiou Encyclopedia", "African American Registry",
"Airdisaster", "Airiti Inc", "Airliners.net", "All Media Guide", "Allgame", "Allmovie", "Allmusic",
"American National Corpus", "Amiga Games Database", "Animal Diversity Web", "Animal Genome Size Database",
"Arachne", "ArchINFORM", "Archive site", "ArtCyclopedia", "Interment.net", "Philosophy", "Internet Archive",
"The Internet Book Database", "Internet Broadway Database", "Internet Movie Database", "Internet Public Library",
};

	String description="random description";
	String url="google.com";


	List<String> names1 = Arrays.asList(name);
	
System.out.println("db.databases.insert(");
    for(int i = 1; i <=30; i++){
    int index = new Random().nextInt(names1.size());
    String name1 = names1.get(index);
    
   
    
    	System.out.println("{\nname:'"+name1+"',");
    	System.out.println("descrpitonLong:'"+description+"',");
    	System.out.println("descriptionShort:'"+description+"',");
    	System.out.println("url:'"+url+"'\n}, ");
    	
    }
    System.out.println(");");




	}
}
