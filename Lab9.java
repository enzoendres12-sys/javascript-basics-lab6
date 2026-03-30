import java.util.Scanner;

public class Lab9 {

    static int posInString(String str, char toFind) {

        for (int i = 0; i < str.length(); i++) {

            if (str.charAt(i) == toFind) {
                return i; 
            }
        }

        return -1;
    }

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        String text;
        char ch;

        System.out.print("Enter a string: ");
        text = sc.nextLine();

        System.out.print("Enter a character to find: ");
        ch = sc.next().charAt(0);

        int position = posInString(text, ch);

        System.out.println("Position: " + position);

        sc.close();
    }
}