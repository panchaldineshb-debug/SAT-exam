# SAT Prep: Advanced Probability - Practice Questions (Q.md)

This file contains 10 practice questions on Advanced Probability for the SAT. Each question includes a multiple-choice layout followed by hints and guided steps — **no answers are given**. Work through the hints to find the solution yourself, Student!

---

### Question 1
**Difficulty:** Easy

If A and B are independent events such that P(A) = 0.60 and P(B) = 0.40, what is the probability that both events A and B occur?

A) 0.20

B) 0.24

C) 0.50

D) 0.76

**Hint / Guided Steps:**
1. Recall the definition of independent events: two events A and B are independent if the occurrence of one does not affect the probability of the other.
2. The formula for the probability of both independent events occurring (A AND B) is: `P(A and B) = P(A) * P(B)`.
3. Substitute the given values into the formula: `0.60 * 0.40`.
4. Multiply the two decimals.

---

### Question 2
**Difficulty:** Easy

A single card is drawn at random from a standard deck of 52 playing cards. What is the probability that the card drawn is a red card OR a King?

A) 1/13

B) 1/2

C) 7/13

D) 15/26

**Hint / Guided Steps:**
1. Recall the addition rule of probability: `P(A or B) = P(A) + P(B) - P(A and B)`.
2. Let A be drawing a red card: half the deck is red, so `P(A) = 26 / 52 = 1 / 2`.
3. Let B be drawing a King: there are 4 Kings in a deck, so `P(B) = 4 / 52 = 1 / 13`.
4. Find the probability of drawing a card that is both red AND a King: there are 2 red Kings in a deck (Heart and Diamond), so `P(A and B) = 2 / 52 = 1 / 26`.
5. Substitute these fractions into the addition rule: `(26 / 52) + (4 / 52) - (2 / 52)`.
6. Simplify the numerator and then reduce the fraction.

---

### Question 3
**Difficulty:** Easy

In a game, a player chooses 3 unique numbers from 1 to 10. If the numbers cannot be repeated and the order of selection does not matter, how many different combinations of numbers can the player choose?

A) 30

B) 120

C) 720

D) 1000

**Hint / Guided Steps:**
1. Since the order of selection does not matter, this is a combination problem. Use the combinations formula: `nCr = n! / (r! * (n - r)!)`, where `n = 10` (total numbers) and `r = 3` (chosen numbers).
2. Set up the formula: `10C3 = 10! / (3! * 7!)`.
3. Expand and simplify: `(10 * 9 * 8 * 7!) / ((3 * 2 * 1) * 7!)`.
4. Cancel out the `7!` in both numerator and denominator: `(10 * 9 * 8) / (3 * 2 * 1)`.
5. Calculate the numerator: `720`.
6. Divide the result by the denominator `6`.

---

### Question 4
**Difficulty:** Medium

If P(A) = 0.70, P(B) = 0.50, and P(A or B) = 0.90, what is the probability that both events A and B occur?

A) 0.10

B) 0.20

C) 0.30

D) 0.35

**Hint / Guided Steps:**
1. Recall the addition rule of probability: `P(A or B) = P(A) + P(B) - P(A and B)`.
2. Rearrange the formula to isolate the intersection `P(A and B)`: `P(A and B) = P(A) + P(B) - P(A or B)`.
3. Substitute the given values into the rearranged equation: `0.70 + 0.50 - 0.90`.
4. Perform the addition and subtraction.

---

### Question 5
**Difficulty:** Medium

A box contains 5 red balls, 3 green balls, and 2 blue balls. If 3 balls are drawn one after another at random without replacement, what is the probability of drawing a red ball first, a green ball second, and a blue ball third?

A) 1/24

B) 3/100

C) 1/8

D) 3/10

**Hint / Guided Steps:**
1. Find the probability of drawing a red ball first: `5 red / 10 total = 5 / 10`.
2. Assuming a red was drawn, calculate the new quantities: 9 total balls remain (4 red, 3 green, 2 blue).
3. Find the probability of drawing a green ball second: `3 green / 9 total = 3 / 9`.
4. Assuming a green was also drawn, calculate the new quantities: 8 total balls remain (4 red, 2 green, 2 blue).
5. Find the probability of drawing a blue ball third: `2 blue / 8 total = 2 / 8`.
6. Multiply the three probabilities together: `(5 / 10) * (3 / 9) * (2 / 8)`.
7. Simplify the fractions before multiplying to make it easier: `(1 / 2) * (1 / 3) * (1 / 4)`.

---

### Question 6
**Difficulty:** Medium

A student takes a test with 5 multiple-choice questions. Each question has 4 options, and only one option is correct. If the student guesses randomly on all 5 questions, what is the probability that they get all 5 questions correct?

A) 1/1024

B) 1/625

C) 1/20

D) 5/4

**Hint / Guided Steps:**
1. Find the probability of guessing a single question correctly: `1 / 4`.
2. Since the guesses are independent events, the probability of getting all 5 questions correct is the product of the probabilities for each question.
3. Set up the equation: `(1/4) * (1/4) * (1/4) * (1/4) * (1/4) = (1/4)^5`.
4. Calculate the value of `4^5` in the denominator.

---

### Question 7
**Difficulty:** Medium

A circular dartboard is made of three concentric circles with radii of 1, 2, and 3 inches. If a dart hits the board at a completely random location, what is the probability that it lands in the outermost ring (between the circles of radii 2 and 3)?

A) 1/3

B) 4/9

C) 5/9

D) 2/3

**Hint / Guided Steps:**
1. Recall the area of a circle formula: `Area = \pi * r^2`.
2. Find the total area of the entire dartboard (the circle with radius 3): `A_total = \pi * 3^2 = 9\pi`.
3. Find the area of the inner region that we want to *exclude* (the circle with radius 2): `A_inner = \pi * 2^2 = 4\pi`.
4. Calculate the area of the outermost ring by subtracting the inner area from the total area: `9\pi - 4\pi = 5\pi`.
5. Calculate the probability by dividing the area of the target region by the total area: `(5\pi) / (9\pi)`.
6. Simplify the fraction by cancelling `\pi`.

---

### Question 8
**Difficulty:** Hard

In a city, 60% of people own a car, 40% own a house, and 20% own both a car and a house. If a randomly selected person from the city owns a car, what is the probability that they also own a house?

A) 1/5

B) 1/3

C) 1/2

D) 2/3

**Hint / Guided Steps:**
1. Recognize that this is a conditional probability problem: "given that the selected person owns a car, what is the probability that they also own a house?".
2. Recall the conditional probability formula: `P(House given Car) = P(House and Car) / P(Car)`.
3. Identify the probabilities from the prompt:
   - `P(Car) = 60% = 0.60`
   - `P(House and Car) = 20% = 0.20`
4. Substitute these values into the formula: `0.20 / 0.60`.
5. Simplify the fraction.

---

### Question 9
**Difficulty:** Hard

A bag contains 6 black keys and 4 silver keys. If keys are drawn at random one after another without replacement, what is the probability that the 3rd key drawn is the first silver key drawn?

A) 1/12

B) 1/6

C) 1/3

D) 5/12

**Hint / Guided Steps:**
1. For the 3rd key to be the first silver key, the sequence of draws must be exactly: **Black first**, **Black second**, **Silver third**.
2. Calculate the probability of each draw:
   - Draw 1 (Black): `6 black / 10 total = 6 / 10`.
   - Draw 2 (Black): since one black was removed, `5 black / 9 total = 5 / 9`.
   - Draw 3 (Silver): since two black keys were removed, `4 silver / 8 total = 4 / 8`.
3. Multiply the three probabilities: `(6 / 10) * (5 / 9) * (4 / 8)`.
4. Simplify the fractions before multiplying: `(3 / 5) * (5 / 9) * (1 / 2)`.
5. Cancel terms to find the final simplified fraction.

---

### Question 10
**Difficulty:** Hard

Two fair six-sided dice are rolled. What is the probability that the sum of the two numbers rolled is greater than 8, given that at least one of the dice shows a 5?

A) 5/36

B) 5/18

C) 5/11

D) 1/2

**Hint / Guided Steps:**
1. Find the size of the restricted sample space (the denominator) based on the condition: "at least one of the dice shows a 5".
2. List all the possible pairs `(die1, die2)` where at least one number is 5:
   - Pairs starting with 5: `(5,1), (5,2), (5,3), (5,4), (5,5), (5,6)`.
   - Pairs ending with 5 (excluding duplicates): `(1,5), (2,5), (3,5), (4,5), (6,5)`.
   - Count the total number of unique pairs in this list. This is your denominator (11).
3. From this restricted list, identify the pairs whose sum is greater than 8 (i.e., sum of 9, 10, 11, or 12):
   - Check the sum for each pair: `(5,4)` has sum 9, `(5,5)` has sum 10, etc.
   - Count how many pairs satisfy this sum condition. This is your numerator.
4. Set up the probability fraction: `(Number of favorable pairs) / 11`.
