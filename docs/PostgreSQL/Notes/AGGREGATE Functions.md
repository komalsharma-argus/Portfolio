---
sidebar_position: 2
---

##### **AGGREGATE FUNCTIONS**



The five most used SQL aggregate functions are COUNT(), SUM(), AVG(), MIN(), and MAX().



**General Syntax Structure**

* Aggregate functions are generally placed in the SELECT list and are frequently paired with a GROUP BY clause to summarize categories.
* SELECT column\_name, AGGREGATE\_FUNCTION(column\_to\_aggregate)

&#x20;   FROM table\_name

&#x20;   WHERE condition

&#x20;   GROUP BY column\_name

&#x20;   HAVING AGGREGATE\_FUNCTION(column\_to\_aggregate) > value;



**General-Purpose Aggregates**



**COUNT(\*)**: Counts total input rows.

**COUNT(expression)**: Counts rows with non-null values.

**SUM(expression)**: Calculates the total of numeric values.

**AVG(expression)**: Computes the arithmetic mean.

**MIN(expression):** Finds the minimum value.

**MAX(expression):** Finds the maximum value.

ARRAY\_AGG(expression): Concatenates input values into an array.

STRING\_AGG(expression, delimiter): Concatenates values into a single string.

JSON\_AGG(expression): Aggregates rows into a JSON array.

JSONB\_AGG(expression): Aggregates rows into a JSONB array.

JSON\_OBJECT\_AGG(key, value): Aggregates key-value pairs into a JSON object.

JSONB\_OBJECT\_AGG(key, value): Aggregates key-value pairs into a JSONB object.

BOOL\_AND(expression): Returns true if all values are true.

BOOL\_OR(expression): Returns true if any value is true.

EVERY(expression): Identical equivalent to BOOL\_AND.

XMLAGG(expression): Concatenates XML values across input rows.



**Statistical Aggregates**



STDDEV(expression): Alias for sample standard deviation.

STDDEV\_SAMP(expression): Computes sample standard deviation.

STDDEV\_POP(expression): Computes population standard deviation.

VARIANCE(expression): Alias for sample variance.

VAR\_SAMP(expression): Computes sample variance.

VAR\_POP(expression): Computes population variance.

CORR(Y, X): Computes the correlation coefficient.

COVAR\_POP(Y, X): Computes population covariance.

COVAR\_SAMP(Y, X): Computes sample covariance.



**Linear Regression Aggregates**



REGR\_COUNT(Y, X): Counts rows where both inputs are non-null.

REGR\_AVGX(Y, X): Computes independent variable average.

REGR\_AVGY(Y, X): Computes dependent variable average.

REGR\_SLOPE(Y, X): Computes the least-squares-fit slope.

REGR\_INTERCEPT(Y, X): Computes the y-intercept value.

REGR\_R2(Y, X): Computes the square of correlation coefficient.

REGR\_SXX(Y, X): Computes independent "sum of squares".

REGR\_SYY(Y, X): Computes dependent "sum of squares".

REGR\_SXY(Y, X): Computes "sum of products".



