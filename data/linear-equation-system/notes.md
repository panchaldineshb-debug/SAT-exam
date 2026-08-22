# SAT Prep: Linear Equation System - Study Notes (notes.md)

This note sheet outlines all the essential concepts, solution methods, graph properties, and strategy tips for solving linear equation systems on the SAT.

---

## 1. What is a System of Linear Equations?

*   **Definition:** A system of linear equations consists of two or more linear equations containing the same variables (usually x and y).
*   **Solution:** A solution to the system is an ordered pair (x, y) that satisfies **both** equations simultaneously.
*   **Geometrically:** On the xy-plane, the solution represents the **intersection point(s)** where the graphs of the equations cross.

---

## 2. Number of Solutions (Graphical & Algebraic Rules)

A system of two linear equations in two variables can have one of three possibilities:

### Case A: Exactly One Solution
*   **Graphical Meaning:** The two lines intersect at exactly one point.
*   **Slopes:** The lines have **different slopes** (m1 != m2).
*   **Algebraic Condition:**
    *   For equations in standard form (A1x + B1y = C1 and A2x + B2y = C2):
    *   `A1 / A2 != B1 / B2`

### Case B: No Solution (Zero Solutions)
*   **Graphical Meaning:** The two lines are **parallel** and never intersect.
*   **Slopes & Intercepts:** The lines have the **same slope** (m1 = m2) but **different y-intercepts** (b1 != b2).
*   **Algebraic Condition:**
    *   `A1 / A2 = B1 / B2 != C1 / C2`
    *   *Example:* `2x - 3y = 4` and `4x - 6y = 10` (ratios of x and y coefficients are both 1/2, but ratio of constants is 4/10 = 2/5).

### Case C: Infinitely Many Solutions
*   **Graphical Meaning:** The two equations represent the **exact same line** (they lie directly on top of each other).
*   **Slopes & Intercepts:** The lines have the **same slope** (m1 = m2) and the **same y-intercept** (b1 = b2).
*   **Algebraic Condition:** One equation is a constant multiple of the other.
    *   `A1 / A2 = B1 / B2 = C1 / C2`
    *   *Example:* `2x - 3y = 4` and `6x - 9y = 12` (the second equation is exactly 3 times the first equation).

---

## 3. Algebraic Solution Methods

There are two primary methods to solve a system of linear equations:

### Method A: Substitution
*   **When to use:** Best when one of the variables is already isolated or has a coefficient of `1` or `-1` (e.g., `x = y - 3` or `y = 2x + 5`).
*   **Steps:**
    1.  Isolate one variable in one of the equations (if not already done).
    2.  Substitute this expression into the other equation.
    3.  Solve the resulting single-variable equation.
    4.  Plug that value back into either original equation to find the second variable.

### Method B: Elimination (Addition/Subtraction)
*   **When to use:** Best when the equations are in standard form (`Ax + By = C`) and coefficients can easily be aligned.
*   **Steps:**
    1.  Multiply one or both equations by constants so that the coefficients of one variable are equal (or opposites).
    2.  Add or subtract the equations to eliminate that variable.
    3.  Solve for the remaining variable.
    4.  Plug the value back in to find the eliminated variable.

---

## 4. SAT Shortcuts: Direct Combination

The SAT frequently asks for the value of a **combination of variables** (e.g., `x + y`, `2x - y`, `3x - 4y`) rather than the individual values of x or y. 

*   **DO NOT** automatically solve for x and y individually. Look for a way to combine the equations directly.
*   **Strategy:** Try adding or subtracting the two equations as they are.
    *   *Example 1:* If `4x + y = 17` and `x + 4y = 13`, adding them gives `5x + 5y = 30`. Divide by 5 to get `x + y = 6` directly!
    *   *Example 2:* If `5x - 3y = 14` and `2x + y = 10`, subtracting the second from the first gives `(5x - 2x) + (-3y - y) = 14 - 10`, which simplifies to `3x - 4y = 4` directly.

---

## 5. Translating Word Problems into Systems

Common scenarios on the SAT:

### Scenario A: Totals and Quantities (e.g., tickets, coins, items)
*   **Equation 1 (Quantity):** `x + y = Total Quantity` (e.g., number of people, tickets sold, items bought).
*   **Equation 2 (Value/Cost):** `(Value of x) * x + (Value of y) * y = Total Value` (e.g., total price, total ticket sales, total value of coins).

### Scenario B: Mixture Problems
*   *Example:* Mixing a 10% solution and a 25% solution to get 30 liters of a 15% solution.
    *   **Equation 1 (Total Volume):** `x + y = 30`
    *   **Equation 2 (Active Ingredient):** `0.10x + 0.25y = 0.15(30)`

---

## 6. Geometry and Graph Intersections

*   **Intersection on the x-axis:** If a system intersects on the x-axis, the y-coordinate of the intersection is `0` (point is `(x, 0)`). Plug `y = 0` into the equations to solve.
*   **Intersection on the y-axis:** If a system intersects on the y-axis, the x-coordinate of the intersection is `0` (point is `(0, y)`). Plug `x = 0` into the equations to solve.

---

## 7. Student's Practice Performance & Recommendations

This section outlines observations from Student's practice session on 2026-07-10 and recommendations for his studies.

### Areas to Watch & Practice:
1.  **Confirm the Target Variable:** When solving a system, double-check the final line of the question to confirm if it asks for `x`, `y`, or a combination (like `x + y`). Avoid the trap of solving for `y` and immediately picking the value of `y` if the question asks for `x`.
2.  **Explicitly Identify Slopes:** For "no solution" or "parallel lines" questions, write down the slope `m` of both lines explicitly (using standard slope-intercept form `y = mx + b`) before equating them. This prevents misidentifying values.
3.  **Write Intermediate Math Steps:** Take 5 extra seconds to write down simple calculations (e.g., dividing or multiplying decimals/fractions) instead of solving them in your head, to prevent minor calculation slips.

### Next Steps:
*   Review these notes before your next practice session.
*   Complete a focused exercise set on **Coordinate Geometry** to master slopes, equations of lines, and graphical systems.

