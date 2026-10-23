---
sidebar_position: 1
---

##### **Syntax Writing Order:**

* When writing a SELECT statement in ⁠PostgreSQL, clauses must be written in this exact sequence:



SELECT column\_list

FROM table\_name

JOIN other\_table ON condition

WHERE row\_filter\_conditions

GROUP BY grouping\_columns

HAVING group\_filter\_conditions

WINDOW window\_name AS (window\_spec)

ORDER BY sorting\_columns

LIMIT number\_of\_rows

OFFSET number\_to\_skip;



##### **Clauses Execution Order:**

|STEP|CLAUSE|PostgreSQL Execution|
|-|-|-|
|1. |FROM/JOIN|Selects the base tables and merges them to create the initial dataset.|
|2.|WHERE|Filters out rows that do not meet individual conditions.|
|3.|GROUP BY|Collapses the remaining individual rows into groups.|
|4.|HAVING|Filters out aggregated groups that do not meet specified criteria.|
|5.|WINDOW|Executes window functions (like ROW\_NUMBER()) over the grouped data.|
|6.|SELECT |Emits the final columns and evaluates expressions or structural aliases.|
|7.|DISTINCT|Scans the columns to eliminate any duplicate result rows.|
|8.|ORDER BY|Sorts the final result set in ascending or descending order.|
|9.|LIMIT/OFFSET|Trims the result set to skip a specific number of rows or keep only the top rows.|



**Alias Visibility:** Because SELECT runs after WHERE and GROUP BY, you cannot use column aliases inside those clauses. For example, SELECT price \* 2 AS double\_price ... WHERE double\_price > 10 will throw an error.



**ORDER BY Capabilities:** Because ORDER BY executes after SELECT, you can use your SELECT aliases or positional numbers (like ORDER BY 1) to sort your data.



**WHERE vs. HAVING:** Use WHERE to filter raw rows before aggregation, and use HAVING only to filter aggregated values (like COUNT(\*) or SUM()).

