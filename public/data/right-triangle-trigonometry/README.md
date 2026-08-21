# SAT Prep: Right Triangle Trigonometry

Welcome to the **Right Triangle Trigonometry** study guide. Trigonometry on the SAT is highly structured, predictable, and covers a specific set of core concepts. By mastering the topics and practicing the questions in this guide, you will be prepared to answer any trigonometry question that appears on the SAT.

---

## 📖 Topic Introduction & Core Concepts

### 1. The Core Ratios (SOH-CAH-TOA)
Trigonometric ratios are based on the relationships between the angles and side lengths of a right triangle. For an acute angle $\theta$ in a right triangle:

```
          /|
         / |
Hypotenuse /  | Opposite
       /   |
      /____|
     θ  Adjacent
```

*   **Sine (sin):** $\sin(\theta) = \frac{\text{Opposite}}{\text{Hypotenuse}}$  *(SOH)*
*   **Cosine (cos):** $\cos(\theta) = \frac{\text{Adjacent}}{\text{Hypotenuse}}$  *(CAH)*
*   **Tangent (tan):** $\tan(\theta) = \frac{\text{Opposite}}{\text{Adjacent}}$  *(TOA)*

---

### 2. The Complementary Angle Identity (Crucial for SAT!)
The SAT frequently tests the relationship between the acute angles in a right triangle. Since the angles in a triangle add up to $180^\circ$, and one angle is $90^\circ$, the two acute angles must add up to $90^\circ$ (they are complementary).

If the two acute angles are $x^\circ$ and $y^\circ$, then $x + y = 90$. This leads to the following critical identity:
$$\sin(x^\circ) = \cos(90^\circ - x^\circ) = \cos(y^\circ)$$
$$\cos(x^\circ) = \sin(90^\circ - x^\circ) = \sin(y^\circ)$$

> [!IMPORTANT]
> **SAT Shortcut:** If you see an equation like $\sin(A) = \cos(B)$, you can immediately set $A + B = 90^\circ$ (or $A + B = \frac{\pi}{2}$ radians) to solve for variables.

---

### 3. Special Right Triangles
The SAT math section includes a reference sheet at the beginning of each module, which includes these two special right triangles. You must know how to use them quickly without re-deriving them:

#### 📐 $45^\circ-45^\circ-90^\circ$ Triangle (Isosceles Right Triangle)
*   **Side Ratios:** $x : x : x\sqrt{2}$
*   **Trig Values:**
    *   $\sin(45^\circ) = \cos(45^\circ) = \frac{\sqrt{2}}{2}$
    *   $\tan(45^\circ) = 1$

#### 📐 $30^\circ-60^\circ-90^\circ$ Triangle
*   **Side Ratios:** $x : x\sqrt{3} : 2x$ (opposite $30^\circ$ is $x$, opposite $60^\circ$ is $x\sqrt{3}$, hypotenuse is $2x$)
*   **Trig Values:**
    *   $\sin(30^\circ) = \cos(60^\circ) = \frac{1}{2}$
    *   $\sin(60^\circ) = \cos(30^\circ) = \frac{\sqrt{3}}{2}$
    *   $\tan(30^\circ) = \frac{\sqrt{3}}{3}$, $\tan(60^\circ) = \sqrt{3}$

---

### 4. Pythagorean Theorem & Common Triples
Knowing the Pythagorean Theorem ($a^2 + b^2 = c^2$) is essential, but recognizing **Pythagorean Triples** saves valuable time:
*   **$3-4-5$** (and its multiples: $6-8-10$, $9-12-15$, etc.)
*   **$5-12-13$** (and its multiples: $10-24-26$, etc.)
*   **$8-15-17$**
*   **$7-24-25$**

---

### 5. Radians and Degrees
Sometimes angles are given in radians instead of degrees.
*   **Conversion:** $\pi \text{ radians} = 180^\circ$
*   To convert degrees to radians: Multiply by $\frac{\pi}{180}$
*   To convert radians to degrees: Multiply by $\frac{180}{\pi}$
*   **Complementary angles in radians:** $x + y = \frac{\pi}{2}$

---

## 📝 SAT Practice Q&A (with Explanations)

Here are representative SAT-style questions ranging from easy to hard.

### Question 1: Finding Trig Ratios from Side Lengths
**Difficulty:** Easy
> In right triangle $ABC$, the right angle is at $C$. If $AC = 8$ and $BC = 15$, what is the value of $\cos(A)$?
>
> A) $\frac{8}{17}$
>
> B) $\frac{15}{17}$
>
> C) $\frac{8}{15}$
>
> D) $\frac{17}{8}$

<details>
<summary>💡 View Explanation & Answer</summary>

**Correct Answer: A**

**Step-by-step Solution:**
1.  **Identify the sides of the triangle:** Triangle $ABC$ is a right triangle with the right angle at $C$. The sides forming the right angle are $AC$ and $BC$.
2.  **Find the hypotenuse ($AB$):** Use the Pythagorean theorem $AB^2 = AC^2 + BC^2$.
    $$AB^2 = 8^2 + 15^2 = 64 + 225 = 289$$
    $$AB = \sqrt{289} = 17$$
    *(Note: This is the standard $8-15-17$ Pythagorean triple).*
3.  **Define $\cos(A)$:** Cosine is defined as $\frac{\text{Adjacent}}{\text{Hypotenuse}}$.
    *   The side adjacent to angle $A$ is $AC = 8$.
    *   The hypotenuse is $AB = 17$.
4.  **Calculate:**
    $$\cos(A) = \frac{AC}{AB} = \frac{8}{17}$$
</details>

---

### Question 2: The Complementary Angle Identity
**Difficulty:** Medium
> In a right triangle, $\sin(\theta) = \frac{5}{13}$. If the other acute angle in the triangle is $\beta$, what is the value of $\cos(\beta)$?
>
> A) $\frac{5}{13}$
>
> B) $\frac{12}{13}$
>
> C) $\frac{13}{5}$
>
> D) $\frac{12}{5}$

<details>
<summary>💡 View Explanation & Answer</summary>

**Correct Answer: A**

**Step-by-step Solution:**
1.  **Understand the relationship between acute angles:** In any right triangle, the two acute angles ($\theta$ and $\beta$) are complementary, meaning $\theta + \beta = 90^\circ$.
2.  **Apply the identity:** For complementary angles, the sine of one angle is equal to the cosine of the other:
    $$\cos(\beta) = \sin(90^\circ - \beta) = \sin(\theta)$$
3.  **Find the value:** Since we are given that $\sin(\theta) = \frac{5}{13}$, then:
    $$\cos(\beta) = \frac{5}{13}$$
</details>

---

### Question 3: Solving Equations with Complementary Angles
**Difficulty:** Medium
> If $\sin(3x - 10)^\circ = \cos(2x + 15)^\circ$, where both angles are acute, what is the value of $x$?
>
> *(Grid-in / Student-Produced Response)*

<details>
<summary>💡 View Explanation & Answer</summary>

**Correct Answer: 17**

**Step-by-step Solution:**
1.  **Recall the identity:** If $\sin(A) = \cos(B)$ for acute angles $A$ and $B$, then $A + B = 90^\circ$.
2.  **Set up the equation:**
    $$(3x - 10) + (2x + 15) = 90$$
3.  **Combine like terms:**
    $$5x + 5 = 90$$
4.  **Solve for $x$:**
    $$5x = 85$$
    $$x = 17$$
</details>

---

### Question 4: Special Right Triangle Applications
**Difficulty:** Medium-Hard
> A builder is constructing a wheelchair ramp. The ramp must form a $30^\circ$ angle with the ground. If the top of the ramp rests on a platform that is $4$ feet above the ground, what is the length of the ramp, in feet?
>
> A) $4\sqrt{3}$
>
> B) $8$
>
> C) $8\sqrt{3}$
>
> D) $12$

<details>
<summary>💡 View Explanation & Answer</summary>

**Correct Answer: B**

**Step-by-step Solution:**
1.  **Visualize the scenario:** The ramp, the ground, and the vertical height form a right triangle.
    *   The angle of the ramp with the ground is $30^\circ$.
    *   The opposite side (height of the platform) is $4$ feet.
    *   The hypotenuse is the length of the ramp itself.
2.  **Identify the triangle type:** This is a $30^\circ-60^\circ-90^\circ$ special right triangle.
3.  **Use the ratios:**
    *   The side opposite the $30^\circ$ angle is $x$. Here, $x = 4$.
    *   The hypotenuse (length of the ramp) is $2x$.
4.  **Calculate:**
    $$\text{Hypotenuse} = 2 \times 4 = 8\text{ feet}$$
</details>

---

### Question 5: Similar Triangles and Trigonometry
**Difficulty:** Hard
> In the figure below, $\angle AED$ and $\angle ACB$ are right angles. If $AD = 10$, $AE = 8$, and $BC = 12$, what is the value of $\sin(\angle B)$?
>
> ```
>         A
>        /|
>       / |
>    D /__| E
>     /   |
>    /____|
>   B      C
> ```
> *(Note: The figure is not drawn to scale, but $\triangle ADE$ is nested inside $\triangle ABC$, sharing the angle $A$.)*
>
> A) $\frac{3}{5}$
>
> B) $\frac{4}{5}$
>
> C) $\frac{3}{4}$
>
> D) $\frac{5}{12}$

<details>
<summary>💡 View Explanation & Answer</summary>

**Correct Answer: B**

**Step-by-step Solution:**
1.  **Analyze the triangles:** Both $\triangle ADE$ and $\triangle ABC$ share angle $A$ ($\angle DAE \cong \angle BAC$) and have a right angle ($\angle AED \cong \angle ACB = 90^\circ$).
2.  **Establish similarity:** By Angle-Angle (AA) similarity, $\triangle ADE \sim \triangle ABC$.
3.  **Analyze the trigonometric properties of similar triangles:** Corresponding angles of similar triangles are equal, and their trigonometric ratios are identical. Therefore:
    $$\sin(\angle B) = \sin(\angle ADE)$$
4.  **Find the sides of $\triangle ADE$:**
    *   Hypotenuse $AD = 10$.
    *   Adjacent side to angle $A$ is $AE = 8$.
    *   Using the Pythagorean theorem (or recognizing a scaled $3-4-5$ triangle: $6-8-10$):
        $$DE = \sqrt{10^2 - 8^2} = \sqrt{36} = 6$$
5.  **Find $\sin(\angle ADE)$:**
    *   In right triangle $\triangle ADE$, the angle opposite to side $AE$ is $\angle ADE$.
    *   Therefore, for angle $\angle ADE$:
        *   $\text{Opposite side} = AE = 8$
        *   $\text{Hypotenuse} = AD = 10$
        $$\sin(\angle ADE) = \frac{\text{Opposite}}{\text{Hypotenuse}} = \frac{AE}{AD} = \frac{8}{10} = \frac{4}{5}$$
6.  **Conclude:** Since $\angle B \cong \angle ADE$, $\sin(\angle B) = \frac{4}{5}$.
</details>
