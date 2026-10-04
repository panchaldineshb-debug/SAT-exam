---
skill_id: "advanced_math_functions"
domain: "Advanced Math"
current_level: "Advanced"
mastery_score: 0.82
last_evaluated_test_id: "test4"
target_check_risk: "Medium"
citations:
  - test_id: "test4"
    question_id: "6"
    status: "correct"
    decoy_type: "sign_flip_trap"
---

# Skill Summary
Function notation, compositions, transformations, and domain/range constraints bridge Advanced Algebra 2 concepts directly into Module 2 of the Digital SAT Math section. Tested areas include vertical and horizontal translations (f(x +/- c) vs. f(x) +/- c), reflections across axes, and function evaluation f(g(x)). Student shows solid command of function definitions and evaluation, with focus needed on horizontal shifts where signs operate counter-intuitively.

## Decoys Defeated vs. Trapped

### Decoys Defeated
- **Vertical Shift Direction Decoy (`sign_flip_trap`):** On test4 question 6, when given f(x) = 7x^3 shifted down 2 units, Student successfully avoided Choice C (+2 shift up) and correctly selected Choice D (7x^3 - 2).

### Active Traps to Monitor
- **Horizontal Shift Inversion Trap:** Moving the graph right by h units is f(x - h), whereas moving left is f(x + h). Rushing often leads to picking f(x + h) for a rightward shift.
- **Inner vs. Outer Function Evaluation:** On compound functions f(g(3)), evaluating g(f(3)) instead of starting strictly from the innermost parentheses.

## Step-by-Step Lesson Breakdown (Foundations / Medium / Advanced)

### Foundations (Easy): Function Evaluation & Interpretation
- **Core Concept:** f(a) means replace every instance of the variable with the value a.
- **Protocol:**
  1. Wrap the input in parentheses before substituting: f(-2) = 3(-2)^2 - 4(-2) + 1.
  2. Follow order of operations (PEMDAS) strictly on scratch paper.

### Medium: Translations & Geometric Transformations
- **Vertical Shifts:**
  - f(x) + c shifts UP c units.
  - f(x) - c shifts DOWN c units.
- **Horizontal Shifts:**
  - f(x - c) shifts RIGHT c units.
  - f(x + c) shifts LEFT c units.
- **Reflections:**
  - -f(x) reflects across the x-axis.
  - f(-x) reflects across the y-axis.

### Advanced (Hard): Function Composition & Minimum/Maximum Ranges
- **Composition Protocol:** For (f o g)(x) = f(g(x)):
  1. First compute the numerical output of g(x).
  2. Feed that output as the direct input into f(x).
- **Domain Constraints:**
  - Denominators cannot equal zero (division by zero).
  - Radicands under square roots cannot be negative (real number domain).

## Prescribed Micro-Drill Routines
1. **Parenthesis Substitution Rule:** Never substitute negative inputs without enclosing them in parentheses on scratch paper.
2. **Translation Quick Cards:** Recite the horizontal inversion rule: "Inside the function, opposite sign = horizontal direction."
3. **Desmos Verification:** Graph both f(x) and the candidate transformation g(x) side-by-side to verify the visual shift direction.
