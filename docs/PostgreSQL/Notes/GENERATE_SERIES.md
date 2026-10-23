---
sidebar_position: 4
---

**GENERATE\_SERIES()**



* generate\_series() is a built-in Set Returning Function (SRF) used to create ordered lists of numbers, dates, or timestamps on the fly. It behaves like a virtual table, making it highly effective for generating test data, filling missing gaps in reporting timelines, or replacing programmatic loops.
* Syntax Overview: generate\_series(start, stop \[, step])
* start: The beginning value of your sequence.
* stop: The termination limit; the sequence will not cross this value.
* step: (Optional) The increment/decrement size. Defaults to 1 for numeric data types.
* **Basic Examples:**



  1. **Generating Numbers:** You can generate a sequential list of integers, bigints, or numeric fractions.
  * Default step (1): SELECT \* FROM generate\_series(1, 5);     -- Returns: 1, 2, 3, 4, 5
  * Custom step: SELECT \* FROM generate\_series(10, 50, 10);    -- Returns: 10, 20, 30, 40, 50
  * Counting backwards (Requires a negative step): SELECT \* FROM generate\_series(5, 1, -1);    -- Returns: 5, 4, 3, 2, 1

&#x20;  2. Generating Dates \& Timestamps: When generating time series, the step parameter must be specified as an INTERVAL.

* **Daily interval:** 

  * SELECT generate\_series(

&#x20;         '2026-07-01'::timestamp, 

&#x20;         '2026-07-05'::timestamp, 

&#x20;         '1 day'::interval

&#x20;         ) AS days;

* **Hourly interval:** 

  * SELECT generate\_series(

&#x20;        '2026-07-19 00:00'::timestamp, 

&#x20;        '2026-07-19 04:00'::timestamp, 

&#x20;        '1 hour'::interval

&#x20;        ) AS hours;

