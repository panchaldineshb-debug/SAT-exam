# SAT Math Study Notes: Quadratic-Linear Systems & Linear Modeling

These topics align directly with your school Algebra 2 curriculum (Systems of Equations & Quadratic Functions). Mastering them raises both your SAT score and your school grade!

---

## 1. Quadratic-Linear Systems of Equations
A quadratic-linear system consists of one linear equation (such as y = mx + b) and one quadratic equation (such as y = ax^2 + bx + c).

### Core Solution Method: Substitution
1.  **Set them equal:** Since both equations equal y, set the linear expression equal to the quadratic expression:
    mx + b = ax^2 + cx + d
2.  **Move all terms to one side:** Set the equation to zero:
    ax^2 + (c - m)x + (d - b) = 0
3.  **Solve the quadratic equation:** Solve by factoring, or by using the Quadratic Formula:
    x = [-b +/- sqrt(b^2 - 4ac)] / (2a)
4.  **Check Constraints:** Read the question carefully! The SAT often adds constraints like "where x > 0" or "find the sum of all x solutions".

### Walkthrough Example (from Test 5, Q13):
*   **System:**
    y = 4x
    y = x^2 - 12
*   **Step 1:** Substitute 4x for y in the second equation:
    4x = x^2 - 12
*   **Step 2:** Subtract 4x from both sides to set to zero:
    0 = x^2 - 4x - 12
*   **Step 3:** Factor the quadratic (find two numbers that multiply to -12 and add to -4):
    These numbers are -6 and +2.
    0 = (x - 6)(x + 2)
    This gives solutions: x = 6 and x = -2.
*   **Step 4:** The question states that x must be greater than 0 (x > 0). Therefore, the correct answer is x = 6.

---

## 2. Interpreting Linear Coefficients & Constraints
The SAT will give you a real-world equation and ask you to explain the meaning of a specific number, variable, or coefficient.

### Core Strategies
*   **Know the Anatomy of a Linear Model:**
    y = mx + b
    *   **m (Slope / Coefficient):** The rate of change. It is the cost per item, the speed per hour, or the price per container. In word problems, look for keywords like *each*, *every*, *per*, or *rate*.
    *   **b (y-intercept / Constant):** The starting value, initial cost, flat fee, or leftover amount. In word problems, look for keywords like *flat fee*, *initial*, *started with*, or *leftover*.
*   **Anatomy of a Combined Model (e.g., Ax + By = C):**
    *   If x and y are the *quantities* of two different items:
        *   A is the price/unit of item x.
        *   B is the price/unit of item y.
        *   C is the total cost/revenue.

### Common SAT Traps
*   **Mixing Variables and Coefficients:** A choice might say "4.51 is the number of containers" when it actually represents the "price per container". Make sure you align units!
*   **Slope vs y-intercept:** Don't confuse the variable rate (the slope) with the starting flat value (the y-intercept).
