import java.io.*;
import java.util.*;

public class CreateDataTest{
public static void main(String[] args) {
    String[] firstnames = {"Richard", "Racheal","Marcie","Kena","Tod", "Lauretta", "Clement", "Rafael", "Liana", 
	"Chelsea", "Kary", "Linwood", "Kyung", "Merrilee", "Lucinda", "Zena", "Altha", "Heather", "Broderick", "Shawnna", "Daniell",
	"Jeanmarie", "Penni", "Shaquita", "Sherril", "Norman", "Natacha", "Elayne", "Margaret", "Hildred"};

	String[] lastnames = {"Huong", "Jene", "Odilia", "Emmett", "Willene", "Whitney", "Marvel", "Charleen", "Trudy",
	"Ben", "Felisa", "Lora", "Sammie", "Melita", "Tayna", "Boris", "Loma", "Kayleigh", "Joana", "Bryanna", "Marchele",
	"Samual", "Hilary", "Laurene", "Lisandra", "Cindie", "Lazaro", "Zenaida", "Lonna" ,"Steffanie"};

	String[] researchTopics = { "Educational Testing", "Elections", "Emotions", "Endangered Species", "Environment",
	"Environmental Protection", "Fairy Tales", "Fashion", "Fast Foods", "FBI", "Forecasting", "Free and Fair Trade",
	"Freedom of Speech", "Freedom of the Press", "Junk Food", "Juvenile Crime", "Labor Unions", "Learning Disabilities",
	"Literacy and Illiteracy", "Malpractice", "Marriage", "Medical Ethics", "Mental Health", "Millennium",
	"Minors' Rights"};

	String password ="rleon94";


	List<String> names1 = Arrays.asList(firstnames);
	List<String> names2 = Arrays.asList(lastnames);
	List<String> researchT = Arrays.asList(researchTopics);
   
    
System.out.println("db.users.insert(");
    for(int i = 1; i <=30; i++){
    int index = new Random().nextInt(names1.size());
    int indexR = new Random().nextInt(researchT.size());


    String name1 = names1.get(index);
    String name2 = names2.get(index);
    String researchTs = researchT.get(indexR);
    
    	System.out.println("{username:'"+i+"@ufl.edu',");
    	System.out.println("password: 'rleon94',");
    	System.out.println("firstName:'"+name1+"',");
    	System.out.println("lastName:'"+name2+"',");
    	System.out.println("researchinterests'"+researchTs+"'}");
    }
    System.out.println(");");




	}
}

