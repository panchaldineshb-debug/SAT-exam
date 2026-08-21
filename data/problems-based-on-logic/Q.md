# SAT Prep: Problems Based on Logic - Practice Questions (Q.md)

This file contains 10 practice questions on Problems Based on Logic for the SAT. Each question includes a multiple-choice layout followed by hints and guided steps — **no answers are given**. Work through the hints to find the solution yourself, Sameer!

---

### Question 1
**Difficulty:** Easy

If a and b are odd integers, which of the following expressions must result in an even integer?

A) a * b

B) a + b

C) 2a + b

D) a^b

**Hint / Guided Steps:**
1. Substitute simple odd numbers for `a` and `b` to test the expressions. Let `a = 3` and `b = 5`.
2. Evaluate each option:
   - For A: `3 * 5`
   - For B: `3 + 5`
   - For C: `2(3) + 5 = 6 + 5`
   - For D: `3^5`
3. Identify which result is divisible by 2 (an even number).
4. Alternatively, recall the number theory rules:
   - `Odd * Odd = Odd`
   - `Odd + Odd = Even`
   - `Even + Odd = Odd`

---

### Question 2
**Difficulty:** Easy

In a group of 20 students, 12 students speak Spanish and 15 students speak English. What is the minimum number of students in the group who must speak both languages?

A) 3

B) 5

C) 7

D) 12

**Hint / Guided Steps:**
1. Let the number of students who speak both languages be `x`.
2. The total number of students who speak at least one of the two languages cannot exceed the total number of students in the group (which is 20).
3. Set up an inequality using the union formula: `Spanish + English - Both <= Total`.
4. Substitute the given values: `12 + 15 - x <= 20` -> `27 - x <= 20`.
5. Solve for the minimum value of `x`.

---

### Question 3
**Difficulty:** Easy

Consider the following statements:
- All dogs are mammals.
- All mammals have warm blood.
Based only on the statements above, which of the following conclusions must be true?

A) All warm-blooded animals are dogs.

B) All warm-blooded animals are mammals.

C) All dogs have warm blood.

D) No mammals are dogs.

**Hint / Guided Steps:**
1. Analyze the logical progression (transitive property of conditionals):
   - Statement 1: If it is a dog, then it is a mammal. (`Dog -> Mammal`)
   - Statement 2: If it is a mammal, then it has warm blood. (`Mammal -> Warm Blood`)
2. Combine these two implications to draw a direct conclusion: `Dog -> Mammal -> Warm Blood` implies `Dog -> Warm Blood`.
3. Match this combined implication to one of the options.

---

### Question 4
**Difficulty:** Medium

If x is an integer, and the expression 3x + 1 results in an even integer, which of the following statements must be true?

A) x is even

B) x is odd

C) x is a multiple of 3

D) x^2 is even

**Hint / Guided Steps:**
1. Set up an equation representing the condition: `3x + 1 = Even`.
2. Subtract 1 from both sides. Recall that `Even - Odd = Odd`. Therefore: `3x = Odd`.
3. For the product `3 * x` to be an odd number, both factors must be odd. Since 3 is odd, `x` must also be odd.
4. (Alternative approach) Test values for `x`:
   - If `x = 2` (even): `3(2) + 1 = 7` (odd - incorrect).
   - If `x = 3` (odd): `3(3) + 1 = 10` (even - correct).
5. Identify the rule that fits the correct test value.

---

### Question 5
**Difficulty:** Medium

A box contains red, blue, and green hats. A student makes the statement: "If you select a hat from the box at random, the hat is either red or blue." If this statement is true, what can you conclude about the green hats in the box?

A) There are more green hats than red hats.

B) There are no green hats in the box.

C) The green hats are all at the bottom of the box.

D) The probability of selecting a green hat is 1.

**Hint / Guided Steps:**
1. The student's statement means that every possible selection from the box will result in either a red hat or a blue hat.
2. If it is impossible to select anything other than red or blue, evaluate the presence of any other color, like green, in the box.

---

### Question 6
**Difficulty:** Medium

If x is a positive integer that is divisible by both 6 and 8, which of the following numbers must also divide x?

A) 12

B) 16

C) 18

D) 48

**Hint / Guided Steps:**
1. Find the Least Common Multiple (LCM) of 6 and 8.
   - Multiples of 6: `6, 12, 18, 24, 30...`
   - Multiples of 8: `8, 16, 24, 32...`
   - The LCM is 24.
2. Since `x` is divisible by both 6 and 8, `x` must be a multiple of their LCM (24).
3. Any number that divides `x` must be a divisor of 24 (or 24 itself).
4. Review the options to find which number is a factor (divisor) of 24.

---

### Question 7
**Difficulty:** Medium

A group of 50 students were surveyed about their ice cream preferences. The survey showed that 30 students like chocolate, 25 students like vanilla, and 10 students like both. How many students do not like either chocolate or vanilla?

A) 5

B) 10

C) 15

D) 20

**Hint / Guided Steps:**
1. Find the number of students who like chocolate, vanilla, or both (the union) using the formula: `Chocolate + Vanilla - Both`.
2. Substitute the values: `30 + 25 - 10`. Calculate this union value.
3. To find the number of students who like neither flavor, subtract the union value from the total number of students surveyed (50).

---

### Question 8
**Difficulty:** Hard

If x and y are positive integers such that x^2 - y^2 = 17, what is the value of x?

A) 8

B) 9

C) 10

D) 17

**Hint / Guided Steps:**
1. Factor the left side of the equation using the difference of squares identity: `(x - y)(x + y) = 17`.
2. Notice that the right side, 17, is a prime number. Since `x` and `y` are positive integers, the factors `(x - y)` and `(x + y)` must also be integers. The only integer factors of 17 are 1 and 17.
3. Since `x` and `y` are positive, `(x + y)` must be the larger factor:
   - `x + y = 17`
   - `x - y = 1`
4. Set up a system of linear equations and add them together to eliminate `y`: `(x + y) + (x - y) = 17 + 1` -> `2x = 18`.
5. Solve for `x`.

---

### Question 9
**Difficulty:** Hard

Three friends, A, B, and C, have different heights. They make the following statements:
- A says: "I am not the shortest."
- B says: "I am the tallest."
If exactly one of these statements is true, and B is taller than A, who is the shortest of the three friends?

A) A

B) B

C) C

D) Cannot be determined from the information given

**Hint / Guided Steps:**
1. Test the two cases for which statement is true (since exactly one is true):
   - **Case 1: Assume B's statement is true** (B is the tallest).
     - This means A's statement must be false. Since A's statement ("I am not the shortest") is false, A must be the shortest.
     - Height order: `A < C < B`.
     - Check consistency: Is B taller than A? Yes. Does exactly one statement hold? Yes (B's is true, A's is false). This case is consistent.
   - **Case 2: Assume A's statement is true** (A is not the shortest).
     - This means B's statement must be false (B is not the tallest).
     - Since B is not the tallest, but B is taller than A, C must be the tallest.
     - Height order: B is taller than A, and C is taller than B, so `B < A < C` or `A < B < C`?
     - But if A is not the shortest, then B must be the shortest: `B < A < C`.
     - Check consistency: In this order, `B` is the shortest. But the prompt states "B is taller than A". This is a contradiction, so Case 2 is impossible.
2. Identify the shortest friend from the consistent case (Case 1).

---

### Question 10
**Difficulty:** Hard

If the conditional statement "If it rains, the grass is wet" is assumed to be true, which of the following statements must also be true?

A) If the grass is wet, it rained.

B) If it does not rain, the grass is not wet.

C) If the grass is not wet, it did not rain.

D) If it rains, the grass is not wet.

**Hint / Guided Steps:**
1. Recall the rules of logical equivalence for conditional statements of the form "If P, then Q" (`P -> Q`):
   - **Converse:** "If Q, then P" (`Q -> P`) - not necessarily true.
   - **Inverse:** "If not P, then not Q" (`~P -> ~Q`) - not necessarily true.
   - **Contrapositive:** "If not Q, then not P" (`~Q -> ~P`) - **always logically equivalent (must be true)**.
2. Identify the contrapositive of the given statement "If it rains (P), the grass is wet (Q)".
3. Translate the contrapositive back into English: "If the grass is not wet (not Q), then it did not rain (not P)".
4. Match this translation to the options.
