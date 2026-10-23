---
sidebar_position: 3
---

1. **The EXTRACT() function** retrieves specific subfields (like year, month, day, hour, or minute) from a date, time, timestamp, or interval value.
* It returns a value of type numeric (or double precision in older versions)
* **Common Field Subfields**

  * YEAR: The full calendar year.
  * QUARTER: The quarter of the year (1 to 4).
  * MONTH: The month number (1 to 12).
  * DAY: The day of the month (1 to 31).
  * DOW: The day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday).
  * ISODOW: The ISO 8601 day of the week (1 = Monday, ..., 7 = Sunday).
  * DOY: The day of the year (1 to 365/366).
  * HOUR: The hour component (0 to 23).
  * MINUTE: The minute component (0 to 59).
  * SECOND: The seconds component, including fractional seconds.
  * EPOCH: The total number of seconds since 1970-01-01 00:00:00 UTC.
* **Examples:**

  * SELECT EXTRACT(YEAR FROM TIMESTAMP '2026-07-18 14:30:15') AS order\_year,

&#x20;             EXTRACT(MONTH FROM TIMESTAMP '2026-07-18 14:30:15') AS order\_month,

&#x20;             EXTRACT(DAY FROM TIMESTAMP '2026-07-18 14:30:15') AS order\_day;

* SELECT EXTRACT(HOUR FROM CURRENT\_TIMESTAMP) AS current\_hour;
* SELECT \*

&#x20;      FROM transactions

&#x20;      WHERE EXTRACT(MONTH FROM transaction\_date) = 5;

**2. The CASE expression** function acts like an if-then-else statement to add conditional logic directly inside your SQL queries.

* It runs through conditions in order and returns a value as soon as the first condition is met.
* Example-1:

SELECT

&#x20;   product\_name,

&#x20;   price,

&#x20;   CASE

&#x20;       WHEN price < 10 THEN 'Budget'

&#x20;       WHEN price BETWEEN 10 AND 50 THEN 'Normal'

&#x20;       ELSE 'Premium'

&#x20;   END AS price\_category

FROM products;

* Example-2:

SELECT

&#x20;   employee\_name,

&#x20;   department\_id,

&#x20;   CASE department\_id

&#x20;       WHEN 1 THEN 'Engineering'

&#x20;       WHEN 2 THEN 'Marketing'

&#x20;       WHEN 3 THEN 'Sales'

&#x20;       ELSE 'Other'

&#x20;   END AS department\_name

FROM employees;

* **Advanced Placement:** You are not limited to using CASE in SELECT lists. You can place it inside other clauses.

  * You can embed a CASE expression in almost any statement or clause that accepts a value, column name, or logic check.
  * SELECT, WHERE, ORDER BY, GROUP BY, HAVING, JOIN (specifically ON) Clauses, SET Clause (in UPDATE Statements, VALUES Clause (in INSERT Statements),Nested inside another CASE Expression.

