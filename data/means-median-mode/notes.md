# SAT Prep: Mean, Median, and Mode - Personal Study & Improvement Notes

**Student:** Student (11th Grade, JP Stevens High School, Edison, NJ)  
**Date:** June 25, 2026  

Use these notes to review the core formulas, concepts, and SAT-specific tricks for Mean, Median, and Mode that we practiced. These are written in plain text for easy reading and quick review.

---

## 1. The Mean (Arithmetic Average)

The mean is calculated by taking the sum of all data values and dividing by the total number of values.

*   **Formula:** `Mean = (Sum of all values) / (Total number of values)`
*   **The "Target Sum" Trick (From Question 1):** If the SAT asks what score you need on a future test to reach a target average, find the total sum needed first:
    *   `Required Sum = Target Mean * Total Number of Tests`
    *   Once you have the required total sum, subtract the sum of your existing scores to find the missing score.

---

## 2. The Median (The Middle Value)

The median is the exact middle value when a dataset is arranged in ascending order (from smallest to largest).

*   **Finding the Position:**
    *   If the number of values (`N`) is **odd**, the median is the single middle value at position: `(N + 1) / 2`.
    *   If the number of values (`N`) is **even**, the median is the average of the two middle values at positions `N / 2` and `(N / 2) + 1`.
*   **Median from a Frequency Table (From Question 2):**
    1. Find the total number of data points (`N`) by adding up the frequencies.
    2. Determine the target middle position using the formula above.
    3. Keep a running total (cumulative count) of the frequencies from the top of the table down. The category where your cumulative count first reaches or passes the target position contains the median.

---

## 3. The Mode (Most Frequent Value)

The mode is the value that appears most frequently in a dataset.

*   **Tip:** Simply count how many times each value appears. The value with the highest count is the mode.
*   **Note:** A dataset can have one mode, more than one mode (if multiple values tie for the highest frequency), or no mode at all (if all values appear the same number of times).

---

## 4. Sensitivity to Outliers (Mean vs. Median)

The SAT frequently tests how adding a very large or very small number (an outlier) affects the mean and median.

*   **The Mean is sensitive:** Since the mean is calculated using the sum of all values, a single extremely large outlier will pull the mean up significantly.
*   **The Median is resistant (From Question 4):** Because the median only looks at the middle position of a sorted list, adding an outlier at the end of the list only shifts the median's position by half a step. The median value will change very little, or not at all.
*   **Rule of Thumb:** 
    *   If a dataset is skewed to the right (has high outliers), `Mean > Median`.
    *   If a dataset is skewed to the left (has low outliers), `Mean < Median`.
    *   If a dataset is symmetric, `Mean = Median`.

---

## 5. Mean from a Frequency Table

When data is grouped in a frequency table, you cannot simply average the unique values. You must account for how often each value occurs.

*   **Formula:** `Mean = (Sum of [Value * Frequency]) / (Total Frequency)`
*   **Practice Step (From Question 5):** 
    1. Multiply each value by its frequency to find the total sum for that category.
    2. Add all these products together to get the grand total.
    3. Divide by the total number of data points (the sum of the frequencies).

---

## 6. Weighted Averages (From Question 6)

You cannot average two averages directly unless the groups are the exact same size.

*   **The Method:**
    1. Find the total sum for Group 1: `Average 1 * Number of members in Group 1`.
    2. Find the total sum for Group 2: `Average 2 * Number of members in Group 2`.
    3. Add the two sums together to get the combined total.
    4. Divide the combined total by the total number of members in both groups combined.

---

## 7. Range and Standard Deviation (From Question 8)

These measures describe the spread or variability of the data.

*   **Range:** The difference between the maximum value and the minimum value: `Range = Max - Min`.
*   **Standard Deviation:** A measure of how far the data points are spread out from the mean.
    *   **Low Standard Deviation:** The data points are clustered closely around the mean (e.g., 72, 73, 72, 74).
    *   **High Standard Deviation:** The data points are spread far apart from the mean (e.g., 60, 68, 80, 88).
    *   *Note:* You do not need to calculate the actual standard deviation on the SAT; you only need to compare datasets conceptually based on their spread.

---

## 8. Median of Combined Sets (From Question 10)

If you know the median of two separate groups, you can determine properties of the combined group by looking at the definition of the median.

*   **The Principle:** If a group of size `N` (where `N` is odd) has a median `M`, then at least `(N + 1) / 2` of the items in that group must be greater than or equal to `M`.
*   For example:
    *   If Group A has 15 employees and a median of \$50,000, then at least `(15 + 1) / 2 = 8` employees earn \$50,000 or more.
    *   If Group B has 25 employees and a median of \$60,000, then at least `(25 + 1) / 2 = 13` employees earn \$60,000 or more (which is also \$50,000 or more).
    *   Therefore, in the combined company, at least `8 + 13 = 21` employees must earn \$50,000 or more.
