package Assignments;

import java.util.Scanner;

public class Ass3 {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        double purchase;
        int change;

        // it keeps going 
        do {
            System.out.print("Enter purchase amount (0 - 100): ");
            purchase = sc.nextDouble();

            if (purchase < 0 || purchase > 100) {
                System.out.println("Invalid amount. Try again.");
            }

        } while (purchase < 0 || purchase > 100);

        // calculate change from $100
        change = (int)(100 - purchase); 

        System.out.println("Total change: $" + change);


        int fifty, twenty, ten, five, two, one;

        // calculate number of each bill/coin (largest to smallest)
        fifty = change / 50;
        change = change % 50;

        twenty = change / 20;
        change = change % 20;

        ten = change / 10;
        change = change % 10;

        five = change / 5;
        change = change % 5;

        two = change / 2;
        change = change % 2;

        one = change; // whatever is left

        // display results
        System.out.println("Change breakdown:");
        System.out.println("$50 bills: " + fifty);
        System.out.println("$20 bills: " + twenty);
        System.out.println("$10 bills: " + ten);
        System.out.println("$5 bills: " + five);
        System.out.println("$2 coins: " + two);
        System.out.println("$1 coins: " + one);

        sc.close();
    }
}

