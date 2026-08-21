# SAT Prep: Probability - Practice Questions (Q.md)

This file contains 10 practice questions on Probability for the SAT. Each question includes a multiple-choice layout followed by hints and guided steps — **no answers are given**. Work through the hints to find the solution yourself, Sameer!

---

### Question 1
**Difficulty:** Easy

A bag contains 3 red marbles, 4 blue marbles, and 5 green marbles. If a marble is selected at random from the bag, what is the probability that the selected marble is blue?

A) 1/4

B) 1/3

C) 5/12

D) 7/12

**Hint / Guided Steps:**
1. Recall the probability formula: `Probability = (Number of favorable outcomes) / (Total number of possible outcomes)`.
2. Find the number of favorable outcomes (the number of blue marbles, which is 4).
3. Find the total number of possible outcomes by adding all the marbles in the bag: `3 + 4 + 5`.
4. Set up the fraction: `4 / (Total number of marbles)`.
5. Simplify the fraction.

---

### Question 2
**Difficulty:** Easy

The table below shows the results of a survey about student course preferences.

| Group | Preferred Math | Preferred Science | Total |
|-------|----------------|-------------------|-------|
| Boys  |       15       |        10         |  25   |
| Girls |       12       |        13         |  25   |
| Total |       27       |        23         |  50   |

If a student from the survey is selected at random, what is the probability that the selected student preferred Science?

A) 10/23

B) 13/23

C) 23/50

D) 27/50

**Hint / Guided Steps:**
1. Identify the group from which you are choosing: "a student from the survey", meaning the total group of 50 students.
2. Identify the favorable outcome: students who "preferred Science". Look at the bottom of the "Preferred Science" column to find this total (which is 23).
3. Divide the number of favorable outcomes by the total number of students.

---

### Question 3
**Difficulty:** Easy

A fair spinner is divided into 8 equal sectors, numbered 1 through 8. If the spinner is spun once, what is the probability that it lands on a prime number?

A) 1/4

B) 3/8

C) 1/2

D) 5/8

**Hint / Guided Steps:**
1. List all the possible outcomes: `1, 2, 3, 4, 5, 6, 7, 8`. There are 8 total outcomes.
2. Recall that a prime number is a whole number greater than 1 whose only divisors are 1 and itself.
3. Identify the prime numbers in the list: `2, 3, 5, 7`. (Note: 1 is not a prime number). Count how many prime numbers there are.
4. Set up the probability fraction: `(Number of prime numbers) / 8`.
5. Simplify the fraction.

---

### Question 4
**Difficulty:** Medium

Using the table from Question 2, if a student selected at random is a girl, what is the probability that the selected student preferred Math?

A) 12/50

B) 12/27

C) 12/25

D) 27/50

**Hint / Guided Steps:**
1. Notice that this is a conditional probability question: "if a student selected at random is a girl...". This restricts the total group to only the girls.
2. Find the total number of girls in the survey (which is 25). This is your new denominator.
3. From the girls' row, find the number of girls who preferred Math (which is 12). This is your numerator.
4. Divide the number of favorable outcomes by the restricted total to get the probability.

---

### Question 5
**Difficulty:** Medium

A box contains 10 pens, of which 3 are defective. If 2 pens are chosen at random from the box one after the other without replacement, what is the probability that both pens are defective?

A) 1/15

B) 3/50

C) 9/100

D) 1/3

**Hint / Guided Steps:**
1. Find the probability that the first pen chosen is defective: `(Number of defective pens) / (Total pens) = 3 / 10`.
2. Since the first pen is not replaced, calculate the new quantities in the box for the second choice:
   - Defective pens left = `3 - 1 = 2`.
   - Total pens left = `10 - 1 = 9`.
3. Find the probability that the second pen chosen is defective: `(Defective pens left) / (Total pens left) = 2 / 9`.
4. Since we want both events to happen, multiply the two probabilities together: `(3 / 10) * (2 / 9)`.
5. Simplify the resulting fraction.

---

### Question 6
**Difficulty:** Medium

A table shows the distribution of blood types in a group of people: Type A is 45%, Type B is 10%, Type AB is 5%, and Type O is 40%. If two people from this group are chosen at random, what is the probability that at least one of them has Type O blood?

A) 0.16

B) 0.40

C) 0.64

D) 0.80

**Hint / Guided Steps:**
1. Recall the complement rule for "at least one": `P(at least one Type O) = 1 - P(neither person has Type O)`.
2. Find the probability that a single person does *not* have Type O blood: `1 - P(Type O) = 1 - 0.40 = 0.60` (or 60%).
3. Assuming the choices are independent, find the probability that *both* people do not have Type O blood: `0.60 * 0.60`.
4. Subtract the result from 1 to find the probability of at least one person having Type O.

---

### Question 7
**Difficulty:** Medium

A set of cards is numbered 1 to 20. If one card is drawn at random from the set, what is the probability that the number on the card is a multiple of 3 or a multiple of 5?

A) 9/20

B) 1/2

C) 11/20

D) 3/5

**Hint / Guided Steps:**
1. List the total possible outcomes: numbers 1 through 20 (20 total cards).
2. List the numbers that are multiples of 3 within this range: `3, 6, 9, 12, 15, 18`.
3. List the numbers that are multiples of 5 within this range: `5, 10, 15, 20`.
4. Combine the two lists, making sure to count shared numbers (like 15) only once to get the set of unique favorable outcomes.
5. Count the total number of unique cards in your combined list.
6. Set up the probability fraction: `(Number of unique favorable outcomes) / 20`.

---

### Question 8
**Difficulty:** Hard

In a class of 30 students, 18 play soccer, 12 play basketball, and 5 play both sports. If a student is chosen at random from the class, what is the probability that the selected student plays neither sport?

A) 1/6

B) 1/3

C) 1/2

D) 5/6

**Hint / Guided Steps:**
1. Use a Venn diagram concept to find the number of students who play at least one of the two sports.
2. Recall the union formula: `Soccer union Basketball = Soccer + Basketball - Both`.
3. Substitute the given values: `18 + 12 - 5`. Calculate the number of students who play soccer, basketball, or both.
4. To find the number of students who play *neither* sport, subtract the union value from the total number of students in the class (30).
5. Set up the probability fraction: `(Number of students playing neither sport) / 30`.
6. Simplify the fraction.

---

### Question 9
**Difficulty:** Hard

A quality control inspector tests items coming off an assembly line. Past records show that 98% of non-defective items pass the test, and 5% of defective items pass the test. If 10% of the items produced are defective, what is the probability that a randomly chosen item is defective AND passes the test?

A) 0.005

B) 0.05

C) 0.098

D) 0.882

**Hint / Guided Steps:**
1. Identify the two probabilities given for a defective item:
   - The probability that an item is defective: `P(Defective) = 10% = 0.10`.
   - The probability that a defective item passes the test: `P(Pass given Defective) = 5% = 0.05`.
2. Recall that the probability of both events happening (Defective AND Pass) is the product of the probability of the first event and the conditional probability of the second: `P(Defective and Pass) = P(Defective) * P(Pass given Defective)`.
3. Multiply the two decimals: `0.10 * 0.05`.

---

### Question 10
**Difficulty:** Hard

A bag contains 4 red balls and 6 blue balls. If a ball is drawn at random, its color is recorded, and it is then returned to the bag along with 2 additional balls of the same color. If a second ball is then drawn at random, what is the probability that both balls drawn are red?

A) 4/25

B) 1/5

C) 6/25

D) 4/15

**Hint / Guided Steps:**
1. Find the probability that the first ball drawn is red: `(Number of red balls) / (Total balls) = 4 / 10`.
2. Record that a red ball was drawn. The ball is returned to the bag along with 2 more red balls. Calculate the new composition of the bag for the second draw:
   - Red balls = `4 + 2 = 6`.
   - Blue balls = `6` (unchanged).
   - Total balls = `6 + 6 = 12`.
3. Find the probability that the second ball drawn is red: `(New red balls) / (New total balls) = 6 / 12` (which simplifies to `1 / 2`).
4. Multiply the probability of the first draw being red by the probability of the second draw being red: `(4 / 10) * (1 / 2)`.
5. Calculate and simplify the fraction.
