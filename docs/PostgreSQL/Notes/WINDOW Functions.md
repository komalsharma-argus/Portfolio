---
sidebar_position: 7
---

###### **WINDOW Functions**



* PostgreSQL window functions perform calculations across a set of rows related to the current row without collapsing them into a single output row.
* The basic syntax requires an OVER clause, which controls how rows are grouped (PARTITION BY) and sorted (ORDER BY): SELECT column, function() OVER (PARTITION BY group\_col ORDER BY sort\_col) FROM table;



* **Ranking Functions:** 



* These functions assign numerical rankings or sequential positions to rows within a partition.

  * ROW\_NUMBER(): Assigns a unique sequential integer to each row starting at 1.
  * RANK(): Assigns rankings with gaps for duplicate values (e.g., 1, 2, 2, 4).
  * DENSE\_RANK(): Assigns rankings without any gaps for duplicate values (e.g., 1, 2, 2, 3).
  * PERCENT\_RANK(): Calculates the relative rank of a row as a percentage between 0 and 1.
  * CUME\_DIST(): Calculates the cumulative distribution of a value (relative position) within the partition.
  * NTILE(num\_buckets): Splits rows into a specific number of approximately equal buckets and assigns a bucket ID.



* **Value \& Offset Functions:** 



* These functions allow you to grab values from other rows without performing complex self-joins.

  * LAG(col, offset, default): Fetches data from a previous row at a specific offset.
  * LEAD(col, offset, default): Fetches data from a subsequent row at a specific offset.
  * FIRST\_VALUE(col): Returns the value from the very first row in the window frame.
  * LAST\_VALUE(col): Returns the value from the very last row in the window frame.
  * NTH\_VALUE(col, n): Returns the value from the exact n-th row in the window frame.



* **Aggregate Functions (Used as Window Functions):** 



* Standard aggregate functions automatically act as window functions when paired with an OVER clause. Instead of a total summary, they produce running calculations.

  * SUM(col): Computes running totals.
  * AVG(col): Computes moving averages.
  * COUNT(col): Computes cumulative counts.
  * MIN(col) / MAX(col): Finds the lowest or highest value in the window.

