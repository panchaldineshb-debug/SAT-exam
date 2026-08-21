# SAT Prep: Trigonometry Personal Study & Improvement Notes

**Student:** Sameer (11th Grade, JP Stevens High School, Edison, NJ)  
**Date:** June 23, 2026  

Use these notes to review the specific areas and SAT tricks you encountered during practice. These are formatted in plain text for easy reading.

---

## 1. The Cofunction Identity (Complementary Angles)

The SAT frequently tests the relationship between the two sharp (acute) angles in a right triangle. 

### The Core Rule:
In any right triangle, the two sharp angles always add up to 90 degrees (or pi/2 radians). 
Because of this, the sine of one angle is always equal to the cosine of the other:
*   sin(Angle A) = cos(Angle B)
*   cos(Angle A) = sin(Angle B)

### Key Notations to Recognize:
*   **In Degrees:** If one angle is "x", the other is "90 - x".
    *   sin(x) = cos(90 - x)
    *   cos(x) = sin(90 - x)
*   **In Radians:** If one angle is "x", the other is "pi/2 - x" (since pi/2 radians is 90 degrees).
    *   sin(x) = cos(pi/2 - x)
    *   cos(x) = sin(pi/2 - x)

### Practice Lesson (From Question 3):
If you are told that sin(x) = 3/5, and the question asks for the value of cos(pi/2 - x):
*   Do NOT draw a triangle or calculate the other sides.
*   Recognize that cos(pi/2 - x) is the exact same thing as sin(x).
*   The answer is instantly 3/5.
*   *Trap to avoid:* Do not calculate cos(x) = 4/5 unless the question specifically asks for cos(x).

---

## 2. Angle Tracking in Nested & Similar Triangles

When a smaller right triangle is drawn inside a larger right triangle, they often share an angle. This makes them "similar" triangles (same shape, different size).

### The Angle Matching Rule:
If small triangle ADE is nested inside large triangle ABC, and they both share the corner angle A:
*   Both triangles have a 90-degree angle.
*   Both triangles share angle A.
*   Therefore, their third angles must be equal: **angle ADE = angle C**.

```text
       C (top angle)
      /|
     / |
  E /__| D (corresponds to C)
   /   |
  /____|
 A      B
(shared corner)
```

### Practice Lesson (From Question 6):
If you need to find the tangent of angle ADE in the small triangle:
*   Recognize that angle ADE is equal to angle C at the top of the large triangle.
*   Instead of working with the small triangle, calculate tan(C) on the large triangle:
    tan(C) = Opposite / Adjacent = AB / BC = 9 / 12 = 3/4.

### Study Tip:
If nested triangles confuse you, redraw the small triangle and the large triangle side-by-side. Make sure you orient them the same way (with the shared corner in the same position) so you can easily see which angles match up.

---

## 3. Tangent Reciprocals for Complementary Angles

If you are looking at the two sharp angles (let's call them Angle A and Angle B) in a single right triangle:

### The Core Rule:
The tangents of the two sharp angles are always reciprocals (flipped fractions) of each other.
*   tan(Angle A) = 1 / tan(Angle B)

### Practice Lesson:
*   If tan(Angle A) = 4/3, then the tangent of the other sharp angle in that triangle is 3/4.
*   If tan(Angle A) = 5/2, then the tangent of the other sharp angle is 2/5.
