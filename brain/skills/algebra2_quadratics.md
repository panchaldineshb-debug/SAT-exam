---
skill_id: "alg2_quadratics"
domain: "Advanced Math"
current_level: "Medium"
mastery_score: 0.78
last_evaluated_test_id: "test4"
target_check_risk: "High"
citations:
  - test_id: "test4"
    question_id: "8"
    status: "correct"
    decoy_type: "sign_flip_trap"
---

# Skill Summary
Quadratic equations and polynomial operations represent the most heavily tested domain in Digital SAT Math and a cornerstone of 11th Grade Algebra 2. Core topics include factoring by grouping, vertex form vs. standard form, discriminant analysis for root determination, and polynomial sign distribution. Student demonstrates strong conceptual understanding but maintains a High Target Check Risk due to historical sign flip vulnerabilities during factoring and expansion.

## Decoys Defeated vs. Trapped

### Decoys Defeated
- **Sign Distribution Decoy (`sign_flip_trap`):** In polynomial expansion involving negative distribution (e.g., test4 question 8, -3x(2x^2 - 1)), Student correctly distributed the negative sign (-3x * -1 = +3x) to reach x^3 + 10x without falling into sign inversion traps.

### Active Traps to Monitor
- **Opposite Root Decoy:** When factoring x^2 - x - 12 = 0 into (x - 4)(x + 3) = 0, decoys offer the factors' interior signs (x = -4 or x = 3) rather than the true roots (x = 4 or x = -3).
- **Intermediate Step Trap (`intermediate_step_trap`):** On questions asking for the sum of roots (x1 + x2) or the positive root difference, stopping at isolating x1 alone.

## Step-by-Step Lesson Breakdown (Foundations / Medium / Advanced)

### Foundations (Easy): Factoring & Root Identification
- **Standard Form:** ax^2 + bx + c = 0.
- **Rule:** If (x - p)(x - q) = 0, then solutions are x = p and x = q.
- **Protocol:**
  1. Set the equation equal to zero before factoring.
  2. Write factors explicitly on scratch paper: (x - r1)(x - r2) = 0.
  3. Flip interior signs to obtain true roots.

### Medium: Vertex Form & Completing the Square
- **Vertex Form:** y = a(x - h)^2 + k, where the vertex is (h, k).
- **Axis of Symmetry:** x = -b / (2a).
- **Max / Min Value:** If a > 0, parabola opens upward with minimum k at x = h. If a < 0, parabola opens downward with maximum k at x = h.
- **Trap Defense:** Beware the sign inside the parenthesis: (x - 3)^2 has h = +3, NOT -3.

### Advanced (Hard): The Discriminant & Vieta's Formulas
- **Discriminant Formula:** D = b^2 - 4ac.
  - D > 0: 2 distinct real solutions (2 x-intercepts).
  - D = 0: Exactly 1 distinct real solution (vertex touches x-axis).
  - D < 0: 0 real solutions (no real x-intercepts).
- **Vieta's Formulas (Speed Shortcuts):**
  - Sum of roots: x1 + x2 = -b / a.
  - Product of roots: x1 * x2 = c / a.
- **Target Check:** When asked for the sum of solutions, evaluate -b / a directly rather than computing roots individually.

## Prescribed Micro-Drill Routines
1. **Factoring Sign Double-Check:** Re-multiply (FOIL) factored expressions on scratch paper before marking roots.
2. **Discriminant Quick Check Drill:** 3 questions identifying parameter k values such that ax^2 + bx + k = 0 has 1 real solution.
3. **Desmos Graphing Visual Sanity Check:** Graph the quadratic in Desmos to visually confirm x-intercepts, vertex, and y-intercept before submitting grid-ins.
