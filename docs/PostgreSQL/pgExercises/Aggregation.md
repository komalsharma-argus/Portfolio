---
sidebar_position: 5
---

#### **Aggregation**



1. **Count the number of facilities:For our first foray into aggregates, we're going to stick to something simple. We want to know how many facilities exist - simply produce a total count.
Ans.** 
SELECT COUNT(\*) FROM cd.facilities;

2. **Count the number of expensive facilities: Produce a count of the number of facilities that have a cost to guests of 10 or more.
Ans.** 
SELECT COUNT(\*) FROM cd.facilities facs
WHERE facs.guestcost >= 10;

3. **Count the number of recommendations each member makes:Produce a count of the number of recommendations each member has made. Order by member ID.
Ans.** 
SELECT recommendedby, COUNT(\*) 
    FROM cd.members 
	WHERE recommendedby IS NOT NULL
	GROUP BY recommendedby
ORDER BY recommendedby;

4. **List the total slots booked per facility:Produce a list of the total number of slots booked per facility. For now, just produce an output table consisting of facility id and slots, sorted by facility id.
Ans.** 
SELECT facid, SUM(bks.slots) AS "Total Slots"
    FROM  cd.bookings bks
	GROUP BY facid 
ORDER BY facid;

5. **List the total slots booked per facility in a given month: Produce a list of the total number of slots booked per facility in the month of September 2012. Produce an output table consisting of facility id and slots, sorted by the number of slots.
Ans.** 
SELECT bks.facid, SUM(bks.slots) AS "Total Slots"
    FROM cd.bookings bks
	WHERE bks.starttime >= '2012-09-01' AND bks.starttime < '2012-10-01'
	GROUP BY bks.facid
ORDER BY SUM(bks.slots);

6. **List the total slots booked per facility per month:Produce a list of the total number of slots booked per facility per month in the year of 2012. Produce an output table consisting of facility id and slots, sorted by the id and month.
Ans.**
SELECT facid, EXTRACT(month FROM starttime) AS month, SUM(slots)
    FROM cd.bookings 
	WHERE starttime >= '2012-01-01' AND starttime < '2013-01-01' 
	GROUP BY facid, month
ORDER BY facid, month;

7. **Find the count of members who have made at least one booking:Find the total number of members (including guests) who have made at least one booking.
Ans.** 
SELECT COUNT(\*) 
FROM (SELECT DISTINCT memid FROM cd.bookings);

8. **List facilities with more than 1000 slots booked:Produce a list of facilities with more than 1000 slots booked. Produce an output table consisting of facility id and slots, sorted by facility id.
Ans.** 
SELECT facid, SUM(slots) AS "Total Slots" 
    FROM cd.bookings bks 
	GROUP BY facid
	HAVING SUM(slots) > 1000
ORDER BY facid;

9. **Find the total revenue of each facility:Produce a list of facilities along with their total revenue. The output table should consist of facility name and revenue, sorted by revenue. Remember that there's a different cost for guests and members!
Ans.** 
SELECT facs.name, SUM(slots \* CASE 
			        WHEN memid = 0 THEN facs.guestcost
				ELSE facs.membercost
				END) AS revenue 
  FROM cd.bookings bks 
  INNER JOIN cd.facilities facs ON (bks.facid = facs.facid)
  GROUP BY facs.name
ORDER BY revenue;

10. **Find facilities with a total revenue less than 1000: Produce a list of facilities with a total revenue less than 1000. Produce an output table consisting of facility name and revenue, sorted by revenue. Remember that there's a different cost for guests and members!
Ans.** 
SELECT name, revenue FROM (
  SELECT facs.name, 
  SUM(slots \* CASE 
	            WHEN memid = 0 THEN facs.guestcost
				ELSE facs.membercost
				END) AS revenue 
  FROM cd.bookings bks 
  INNER JOIN cd.facilities facs ON (bks.facid = facs.facid)
  GROUP BY facs.name
)WHERE revenue < 1000
ORDER BY revenue;

11. **Output the facility id that has the highest number of slots booked:Output the facility id that has the highest number of slots booked. For bonus points, try a version without a LIMIT clause. This version will probably look messy!
Ans.** 
WITH sum\_slots AS (
  SELECT facid, SUM(slots) as totalslots FROM cd.bookings
  GROUP BY facid
)
SELECT facid, totalslots AS "Total Slots"
FROM sum\_slots 
WHERE totalslots = (SELECT MAX(totalslots) FROM sum\_slots);

12. **List the total slots booked per facility per month, part 2:Produce a list of the total number of slots booked per facility per month in the year of 2012. In this version, include output rows containing totals for all months per facility, and a total for all months for all facilities. The output table should consist of facility id, month and slots, sorted by the id and month. When calculating the aggregated values for all months and all facids, return null values in the month and facid columns.
Ans.**
SELECT facid, EXTRACT(month FROM starttime) AS month, SUM(slots) AS slots
FROM cd.bookings 
WHERE starttime >= '2012-01-01' AND starttime < '2013-01-01'
GROUP BY ROLLUP(facid, month)
ORDER BY facid,month;

13. **List the total hours booked per named facility: Produce a list of the total number of hours booked per facility, remembering that a slot lasts half an hour. The output table should consist of the facility id, name, and hours booked, sorted by facility id. Try formatting the hours to two decimal places.
Ans.** 
SELECT facs.facid, facs.name, TRIM(TO\_CHAR(SUM(bks.slots)/2.0, '99999.99')) AS "Total Hours"
FROM cd.bookings bks
INNER JOIN cd.facilities facs ON (bks.facid = facs.facid)
GROUP BY facs.facid, facs.name
ORDER BY facs.facid;

14. **List each member's first booking after September 1st 2012: Produce a list of each member name, id, and their first booking after September 1st 2012. Order by member ID.
Ans.** 
SELECT mems.surname, mems.firstname, mems.memid, MIN(bks.starttime)
FROM cd.members mems
INNER JOIN cd.bookings bks ON (bks.memid = mems.memid)
WHERE bks.starttime > '2012-09-01'
GROUP BY mems.surname, mems.firstname, mems.memid
ORDER BY memid;

15. **Produce a list of member names, with each row containing the total member count: Produce a list of member names, with each row containing the total member count. Order by join date, and include guest members.
Ans.** 
SELECT COUNT(\*) OVER(), mems.firstname, mems.surname 
FROM cd.members mems
ORDER BY joindate;

16. **Produce a numbered list of members: Produce a monotonically increasing numbered list of members (including guests), ordered by their date of joining. Remember that member IDs are not guaranteed to be sequential.
Ans.** 
SELECT ROW\_NUMBER() OVER(ORDER BY joindate), firstname, surname 
FROM cd.members;

17. **Output the facility id that has the highest number of slots booked, again: Output the facility id that has the highest number of slots booked. Ensure that in the event of a tie, all tieing results get output.
Ans.** 
SELECT facid, total FROM (
  SELECT facid, SUM(slots) AS total,
  RANK() OVER(ORDER BY SUM(slots) DESC)
  FROM cd.bookings 
  GROUP BY facid)
WHERE rank = 1;

18. **Rank members by (rounded) hours used: Produce a list of members (including guests), along with the number of hours they've booked in facilities, rounded to the nearest ten hours. Rank them by this rounded figure, producing output of first name, surname, rounded hours, rank. Sort by rank, surname, and first name.
Ans.** 


19. **Find the top three revenue generating facilities: Produce a list of the top three revenue generating facilities (including ties). Output facility name and rank, sorted by rank and facility name.
Ans.** 
SELECT name, rank FROM(
  SELECT facs.name, RANK() OVER(
	ORDER BY SUM(CASE 
				 WHEN bks.memid = 0 THEN bks.slots\*facs.guestcost
				 ELSE bks.slots\*facs.membercost
				END) DESC) AS rank
  FROM cd.bookings bks 
  INNER JOIN cd.facilities facs ON (facs.facid = bks.facid)
  GROUP BY facs.name
  ) WHERE rank < 4
ORDER BY rank, name;

20. **Classify facilities by value: Classify facilities into equally sized groups of high, average, and low based on their revenue. Order by classification and facility name.
Ans.** 
SELECT name, CASE WHEN class=1 THEN 'high'
                  WHEN CLASS=2 THEN 'average'
				  ELSE 'low' END AS revenue 
FROM(
  SELECT facs.name AS name, NTILE(3) OVER(
	ORDER BY SUM(CASE WHEN bks.memid = 0 THEN bks.slots\*facs.guestcost
				 ELSE bks.slots\*facs.membercost END) DESC) AS class
  FROM cd.bookings bks
  INNER JOIN cd.facilities facs ON (facs.facid = bks.facid)
  GROUP BY facs.name
  ) 
ORDER BY class, name;

21. **Calculate the payback time for each facility: Based on the 3 complete months of data so far, calculate the amount of time each facility will take to repay its cost of ownership. Remember to take into account ongoing monthly maintenance. Output facility name and payback time in months, order by facility name. Don't worry about differences in month lengths, we're only looking for a rough value here!
Ans.** 
SELECT facs.name as name,
       facs.initialoutlay/((SUM(CASE 
								WHEN memid = 0 THEN slots \* facs.guestcost
								ELSE slots \* membercost
								END)/3) - facs.monthlymaintenance) AS months
FROM cd.bookings bks 
INNER JOIN cd.facilities facs ON (bks.facid = facs.facid)
GROUP BY facs.facid
ORDER BY name;

22. **Calculate a rolling average of total revenue: For each day in August 2012, calculate a rolling average of total revenue over the previous 15 days. Output should contain date and revenue columns, sorted by the date. Remember to account for the possibility of a day having zero revenue. This one's a bit tough, so don't be afraid to check out the hint!**

**Ans.** 





