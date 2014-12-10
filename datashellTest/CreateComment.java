import java.io.*;
import java.util.*;

public class CreateComment{
public static void main(String[] args) {
    String[] name = {"Abandoned", "Acronym Finder", "Aeiou Encyclopedia", "African American Registry",
"Airdisaster", "Airiti Inc", "Airliners.net", "All Media Guide", "Allgame", "Allmovie", "Allmusic",
"American National Corpus", "Amiga Games Database", "Animal Diversity Web", "Animal Genome Size Database",
"Arachne", "ArchINFORM", "Archive site", "ArtCyclopedia", "Interment.net", "Philosophy", "Internet Archive",
"The Internet Book Database", "Internet Broadway Database", "Internet Movie Database", "Internet Public Library",
};

	String description="random description";


	List<String> names1 = Arrays.asList(name);
	
System.out.println("db.databases.insert(");
    for(int i = 1; i <=30; i++){
    int index = new Random().nextInt(names1.size());
    String name1 = names1.get(index);
    
 
    	System.out.println("{\ndatabaseID:'"+name1+"',");
   		System.out.println("reviews:'"+description+"'\n}, ");
    	
    }
    System.out.println(");");




	}
}
