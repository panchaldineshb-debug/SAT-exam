# SAT Prep: Absolute Values - Study Notes (notes.md)

This note sheet outlines all the essential concepts, equations, graph properties, and strategy tips for solving absolute value problems on the SAT.

---

## 1. What is Absolute Value?

*   **Geometrically:** The absolute value of a number represents its **distance** from `0` on the number line. Since distance is never negative, absolute value is always non-negative:
    *   `|5| = 5` (5 is 5 units from 0)
    *   `|-5| = 5` (-5 is also 5 units from 0)
*   **Algebraically:** 
    *   `|x| = x` if `x` is positive or zero (`x >= 0`)
    *   `|x| = -x` if `x` is negative (`x < 0`)

---

## 2. Distance Interpretation on the Number Line

The SAT frequently tests your ability to interpret absolute values as distances between two numbers.

*   **The Equation `|x - a| = b`:**
    *   **Meaning:** The distance between `x` and `a` is exactly `b`.
    *   **Solutions:** `x` can be `b` units to the right of `a` (`a + b`) or `b` units to the left of `a` (`a - b`).
*   **The Inequality `|x - a| <= b`:**
    *   **Meaning:** The distance between `x` and `a` is at most `b`. This means `x` lies within `b` units of `a`.
    *   **Equivalent range:** `a - b <= x <= a + b`.

### Midpoint and Radius Formula (Tolerances)
To convert a range of values `Min <= x <= Max` into an absolute value inequality `|x - Midpoint| <= Radius`:
1.  **Find the Midpoint (average of boundaries):**
    *   `Midpoint = (Min + Max) / 2`
2.  **Find the Radius (half-distance or maximum deviation):**
    *   `Radius = (Max - Min) / 2`  *(or simply: Max - Midpoint)*
3.  **Write the inequality:**
    *   `|x - Midpoint| <= Radius`

*Example:* If a measurement `L` must be between `12` and `16`, then:
*   `Midpoint = (12 + 16) / 2 = 14`
*   `Radius = 16 - 14 = 2`
*   Inequality: `|L - 14| <= 2`

---

## 3. Solving Absolute Value Equations

When solving `|expression| = target`:

### Case A: Target is a Constant
*   If `|expression| = positive constant`, split it into two cases:
    1.  `expression = constant`
    2.  `expression = -constant`
*   If `|expression| = 0`, there is only one case: `expression = 0`.
*   If `|expression| = negative constant`, there are **no real solutions** (e.g., `|x - 3| = -2` has no solutions because distance cannot be negative).

### Case B: Target contains a Variable (Extraneous Solutions)
*   When solving `|expression_1| = expression_2` (where `expression_2` has a variable), split into:
    1.  `expression_1 = expression_2`
    2.  `expression_1 = -expression_2`
*   **CRITICAL STEP:** You must check all candidate solutions in the original equation. 
    *   Since the left side `|expression_1|` must be non-negative, any valid solution must make `expression_2 >= 0`.
    *   If a solution makes `expression_2` negative, it is an **extraneous solution** and must be discarded.

---

## 4. Solving Absolute Value Inequalities

For any positive constant `c`:

### Less-Than Inequalities (`|u| < c` or `|u| <= c`)
*   These represent an **intersection** (an "AND" inequality). The expression is sandwiched between `-c` and `c`.
*   `|u| < c` becomes: `-c < u < c`

### Greater-Than Inequalities (`|u| > c` or `|u| >= c`)
*   These represent a **union** (an "OR" inequality). The expression is outside the boundaries.
*   `|u| > c` becomes: `u > c` OR `u < -c`

### Special Cases (Negative Constants)
*   `|u| < -5` has **no solutions** (absolute value can never be less than a negative number).
*   `|u| > -5` has **infinitely many solutions** (all real numbers, since absolute value is always >= 0, which is always > -5).

---

## 5. Quadratic Equations with Absolute Values

Some SAT questions feature quadratics containing absolute values, such as:
`x^2 - 5|x| + 6 = 0`

*   **Key Property:** Since `x^2 = |x|^2` for all real numbers, rewrite the equation as:
    `|x|^2 - 5|x| + 6 = 0`
*   **Substitution Method:** Let `u = |x|`. Solve the resulting quadratic:
    `u^2 - 5u + 6 = 0` -> `(u - 2)(u - 3) = 0` -> `u = 2` or `u = 3`
*   **Substitute Back:** 
    *   `|x| = 2` -> `x = 2` or `x = -2`
    *   `|x| = 3` -> `x = 3` or `x = -3`
    *   This gives a total of 4 solutions.

---

## 6. Graphing Absolute Value Functions

The standard vertex form of an absolute value function is:
`y = a|x - h| + k`

*   **Vertex:** The vertex (the turning point of the V) is always at **`(h, k)`**.
*   **Direction of Opening:**
    *   If `a > 0`, the V-shape opens **upwards** (the vertex is a minimum).
    *   If `a < 0`, the V-shape opens **downwards** (the vertex is a maximum).
*   **Slopes:** The right-hand side has a slope of `a`, and the left-hand side has a slope of `-a`.
*   **Intersections / Systems:**
    *   An upward-opening graph `y = |x - h| + k` and a downward-opening graph `y = -|x - h| + m` intersect at exactly two points if and only if the downward vertex is higher than the upward vertex (`m > k`).

---

## 7. Optimization / Distance Sum Minimization

*   **Finding the Minimum of a Sum:** For a function representing the sum of absolute distances to different points, such as `f(x) = |x - a| + |x - b| + |x - c|`:
    *   The sum of distances is minimized at the **median** of the points.
    *   For `f(x) = |x - 1| + |x - 5| + |x - 10|`, the points are `{1, 5, 10}`. The median is `5`, so the minimum value of `f(x)` occurs at `x = 5`.
