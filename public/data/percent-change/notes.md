# SAT Prep: Percent Change - Personal Study & Improvement Notes

**Student:** Student (11th Grade, JP Stevens High School, Edison, NJ)  
**Date:** June 24, 2026  

Use these notes to review the specific percent-change rules and SAT shortcut tricks we used during practice. These are written in plain text for easy reading.

---

## 1. The Multiplier Concept (Base Rule)

Instead of calculating a percentage and adding/subtracting it in two separate steps, always use a single multiplier:
*   **Percent Increase:** Multiplier = 1 + (rate as decimal)
    *   Example: A 20% increase is a multiplier of 1 + 0.20 = 1.20.
*   **Percent Decrease:** Multiplier = 1 - (rate as decimal)
    *   Example: A 15% discount is a multiplier of 1 - 0.15 = 0.85.

### Practice Lesson (From Question 3):
If a price after a 20% increase is $72, set up a simple one-step equation:
*   1.20 * (original price) = 72
*   original price = 72 / 1.20 = $60.

---

## 2. Consecutive Percent Changes (Do NOT Add Percentages!)

When a value changes multiple times in sequence, you must **multiply** the individual multipliers. You can never add or subtract the percentages directly.
*   **The Trap:** A stock goes up 10% then down 10%. Many students think the net change is 0%.
*   **The Math:** 
    *   First year multiplier = 1.10
    *   Second year multiplier = 0.90
    *   Net multiplier = 1.10 * 0.90 = 0.99
    *   Since 0.99 is 1 - 0.01, the value actually decreased by 1% overall.

---

## 3. The Reverse Percent Change Trick

If a value is increased by a percentage, it requires a **smaller** percentage decrease to return to the original value.
*   **The Rule:** If you increase by 25% (multiplier 1.25), the return multiplier is 1 / 1.25 = 0.80.
*   A multiplier of 0.80 means a 20% decrease.
*   **SAT Tip:** If you ever get stuck with variables, plug in 100 as a starting number:
    1. Start at 100.
    2. Increase by 25% to get 125.
    3. To get back to 100, you need to decrease by 25.
    4. 25 / 125 = 1/5 = 20% decrease.

---

## 4. Exponential Models with Time Intervals

The SAT tests exponential growth/decay functions with scaled exponents, usually in the form:
*   P(t) = P_initial * (1 + r)^(t / k)
*   **The Rule:** The percentage rate of change is still r, but this change occurs every "k" units of time.

### Practice Lesson (From Question 7):
For the model P(t) = 45,000 * (1.08)^(t/5):
*   The base is 1.08, which represents an 8% increase.
*   The exponent is t/5, which means the population increases by 8% every 5 years.

---

## 5. Rewriting Exponents to Find Annual Rates

If a function has a multiplier on the time variable in the exponent, you can rewrite the base using power rules:
*   (Base)^(t / k) = ((Base)^(1 / k))^t

### Practice Lesson (From Question 12):
For the decay model M(t) = M_initial * (0.81)^(t/2):
*   Rewrite the term as: ((0.81)^(1/2))^t
*   Since raising to 1/2 is the square root, this becomes: (0.90)^t
*   A base of 0.90 represents a 10% decrease each year (since 1 - 0.10 = 0.90).
*   **The Trap to Avoid:** Do not assume the annual decay is 19% (which is the decay every 2 years, 1 - 0.81 = 0.19) or 9% (which comes from incorrectly taking the square root as 0.09).

---

## 6. Geometric and Formula-Based Percent Changes

When the dimensions of a shape change by a percentage, substitute the scaled variables directly into the geometric formula.

### Practice Lesson (From Question 13):
For a cylinder with volume V = pi * r^2 * h:
*   If radius (r) increases by 20%, replace r with (1.20 * r).
*   If height (h) decreases by 25%, replace h with (0.75 * h).
*   New Volume = pi * (1.20 * r)^2 * (0.75 * h)
*   New Volume = pi * 1.44 * r^2 * 0.75 * h
*   New Volume = (1.44 * 0.75) * (pi * r^2 * h) = 1.08 * V
*   This represents an 8% increase in volume.

---

## 7. Ratio and Comparison Percent Changes

When a question asks for the percent change of a ratio (like land area per person):
1. Write the original ratio: L / P
2. Apply the individual percentage changes as multipliers to the numerator and denominator.
3. Simplify the resulting fraction to find the net multiplier.

### Practice Lesson (From Question 15):
*   Land area (numerator) decreases by 12% -> multiplier is 0.88.
*   Population (denominator) increases by 10% -> multiplier is 1.10.
*   New Ratio = (0.88 * L) / (1.10 * P) = (0.88 / 1.10) * (L / P)
*   Divide the coefficients: 0.88 / 1.10 = 0.80.
*   The new ratio is 0.80 times the original ratio, which represents a 20% decrease.
