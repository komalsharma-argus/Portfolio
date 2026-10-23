---
sidebar_position: 5
---

1\. **TO\_CHAR()** converts data types like dates, timestamps, or numbers into formatted text strings.

* The TO\_CHAR() function formats timestamp, interval, integer, float, or numeric data into structured text based on a template.
* **Syntax:** TO\_CHAR(value, 'format\_pattern')
* **Common Examples** 

  * Format Current Date: Formats a date into a standard YYYY-MM-DD layout. 

    * SELECT TO\_CHAR(CURRENT\_DATE, 'YYYY-MM-DD');    -- Result: '2026-07-19'
  * Format Time with AM/PM: Extracts 12-hour formatted time with minutes and indicators.

    * SELECT TO\_CHAR(NOW(), 'HH12:MI AM');           -- Result: '05:29 PM'
  * Format Currency \& Decimals: Rounds numbers and maps local currency or thousands separators.

    * SELECT TO\_CHAR(12345.67, '$99,999.99');        -- Result: ' $12,345.67'    

2\. **The TRIM() Function**

* The TRIM() function strips blank spaces or designated unwanted characters from the edges of text strings.
* **Syntax:** TRIM(\[LEADING | TRAILING | BOTH] \[characters] FROM string)
* **Note: If no positioning or character targets are passed, it defaults to stripping spaces from BOTH ends.**
* **Common Examples:** 

  * Remove Surrounding Spaces: Cleans white space off both sides. 

    * SELECT TRIM('  hello world  ');             -- Result: 'hello world'
  * Remove Leading Characters Only: Strips target elements from the start.

    * SELECT TRIM(LEADING '0' FROM '00012345');   -- Result: '12345'
  * Remove Specific Multi-Character Sets: Strips any matching character from the edge sets.

    * SELECT TRIM(BOTH 'xyz' FROM 'xyxTomxx');    -- Result: 'Tom'

