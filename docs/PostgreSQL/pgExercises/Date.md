---
sidebar_position: 6
---

#### **Date**



1. **Produce a timestamp for 1 a.m. on the 31st of August 2012**

**Ans:**

SELECT timestamp '2012-08-31 01:00:00';



**2. Subtract timestamps from each other: Find the result of subtracting the timestamp '2012-07-30 01:00:00' from the timestamp '2012-08-31 01:00:00'**

**Ans.**

SELECT timestamp '2012-08-31 01:00:00' - timestamp '2012-07-30 01:00:00' AS interval;



**3. Generate a list of all the dates in October 2012: Produce a list of all the dates in October 2012. They can be output as a timestamp (with time set to midnight) or a date.**

**Ans.** 

SELECT GENERATE\_SERIES(TIMESTAMP '2012-10-01', TIMESTAMP '2012-10-31', INTERVAL '1 day') AS ts;



**4. Get the day of the month from a timestamp:Get the day of the month from the timestamp '2012-08-31' as an integer.**

**Ans.** 

SELECT EXTRACT(DAY FROM '2012-08-31'::TIMESTAMP);



**5.Work out the number of seconds between timestamps: Work out the number of seconds between the timestamps '2012-08-31 01:00:00' and '2012-09-02 00:00:00'**

**Ans.** 

SELECT EXTRACT(epoch FROM (TIMESTAMP '2012-09-02 00:00:00' - TIMESTAMP '2012-08-31 01:00:00'))::INT AS date\_part;



**6. Work out the number of days in each month of 2012: For each month of the year in 2012, output the number of days in that month. Format the output as an integer column containing the month of the year, and a second column containing an interval data type.**

**Ans.** 

SELECT EXTRACT(month FROM cal.month) AS month,

&#x20;   (cal.month + interval '1 month') - cal.month AS length

&#x09;FROM 

&#x09;(

&#x09;  SELECT GENERATE\_SERIES('2012-01-01'::TIMESTAMP, '2012-12-01'::TIMESTAMP, INTERVAL '1 month') AS month

&#x09;) cal

ORDER BY month;



**7.Work out the number of days remaining in the month: For any given timestamp, work out the number of days remaining in the month. The current day should count as a whole day, regardless of the time. Use '2012-02-11 01:00:00' as an example timestamp for the purposes of making the answer. Format the output as a single interval value.**

**Ans.** 





**8. Work out the end time of bookings: Return a list of the start and end time of the last 10 bookings (ordered by the time at which they end, followed by the time at which they start) in the system.**

**Ans.**





**9. Return a count of bookings for each month: Return a count of bookings for each month, sorted by month**

**Ans.**





**10. Work out the utilisation percentage for each facility by month: Work out the utilisation percentage for each facility by month, sorted by name and month, rounded to 1 decimal place. Opening time is 8am, closing time is 8.30pm. You can treat every month as a full month, regardless of if there were some dates the club was not open.**

**Ans.** 



