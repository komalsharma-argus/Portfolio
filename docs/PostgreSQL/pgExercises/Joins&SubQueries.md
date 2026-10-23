---
sidebar_position: 3
---

Retrieve the start times of members' bookings: How can you produce a list of the start times for bookings by members named 'David Farrell'?
Ans: 
SELECT starttime FROM cd.bookings bk
INNER JOIN cd.members mems ON (bk.memid = mems.memid)
WHERE mems.firstname = 'David' AND mems.surname = 'Farrell';

SELECT starttime FROM cd.bookings 
WHERE memid = (SELECT memid FROM cd.members			       
				 WHERE firstname = 'David' and surname = 'Farrell');

Work out the start times of bookings for tennis courts: How can you produce a list of the start times for bookings for tennis courts, for the date '2012-09-21'? Return a list of start time and facility name pairings, ordered by the time.
Ans: 
```sql
SELECT bks.starttime AS start, facs.name AS name 
FROM cd.facilities facs 
INNER JOIN cd.bookings bks 
    ON (bks.facid = facs.facid) 
WHERE facs.name LIKE '%Tennis Court%' AND 
    bks.starttime >= '2012-09-21' AND 
	bks.starttime <= '2012-09-22' 
ORDER BY start;
```

Produce a list of all members who have recommended another member:How can you output a list of all members who have recommended another member? Ensure that there are no duplicates in the list, and that results are ordered by (surname, firstname).
Ans: SELECT DISTINCT mems1.firstname, mems1.surname FROM cd.members mems1 
INNER JOIN cd.members mems2 ON (mems1.memid = mems2.recommendedby)
ORDER BY surname, firstname;

Produce a list of all members, along with their recommender: How can you output a list of all members, including the individual who recommended them (if any)? Ensure that results are ordered by (surname, firstname).
Ans: SELECT mems.firstname AS memfname, mems.surname AS memsname, recs.firstname AS recfname, recs.surname AS recsname
FROM cd.members mems
LEFT OUTER JOIN cd.members recs ON (mems.recommendedby = recs.memid) 
ORDER BY memsname, memfname;

Produce a list of all members who have used a tennis court: How can you produce a list of all members who have used a tennis court? Include in your output the name of the court, and the name of the member formatted as a single column. Ensure no duplicate data, and order by the member name followed by the facility name.
Ans: SELECT DISTINCT mems.firstname || ' ' || mems.surname AS member, facs.name AS facility 
FROM cd.members mems 
    INNER JOIN cd.bookings bks ON (mems.memid = bks.memid)
	INNER JOIN cd.facilities facs ON (bks.facid = facs.facid) 
	WHERE facs.name IN ('Tennis Court 1', 'Tennis Court 2')
ORDER BY member, facility;

Produce a list of costly bookings: How can you produce a list of bookings on the day of 2012-09-14 which will cost the member (or guest) more than $30? Remember that guests have different costs to members (the listed costs are per half-hour 'slot'), and the guest user is always ID 0. Include in your output the name of the facility, the name of the member formatted as a single column, and the cost. Order by descending cost, and do not use any subqueries.
Ans: SELECT mems.firstname ||' '|| mems.surname AS member, facs.name AS facility, 
    CASE WHEN mems.memid = 0 THEN bks.slots*facs.guestcost
	ELSE bks.slots*facs.membercost 
	END AS cost 
FROM cd.members mems 
    INNER JOIN cd.bookings bks ON (mems.memid = bks.memid) 
	INNER JOIN cd.facilities facs ON (bks.facid = facs.facid) 
WHERE bks.starttime >= '2012-09-14' AND
    bks.starttime< '2012-09-15' AND 
	((mems.memid = 0 AND bks.slots*facs.guestcost > 30) OR (mems.memid != 0 AND bks.slots*facs.membercost > 30))
ORDER BY cost DESC;

Produce a list of all members, along with their recommender, using no joins.: How can you output a list of all members, including the individual who recommended them (if any), without using any joins? Ensure that there are no duplicates in the list, and that each firstname + surname pairing is formatted as a column and ordered.
Ans: SELECT DISTINCT mems.firstname || ' ' || mems.surname AS member, 
    (SELECT recs.firstname|| ' ' || recs.surname AS recommender 
	    FROM cd.members recs
	    WHERE recs.memid = mems.recommendedby) 
FROM cd.members mems
ORDER BY member;

Produce a list of costly bookings, using a subquery: The Produce a list of costly bookings exercise contained some messy logic: we had to calculate the booking cost in both the WHERE clause and the CASE statement. Try to simplify this calculation using subqueries. For reference, the question was:
How can you produce a list of bookings on the day of 2012-09-14 which will cost the member (or guest) more than $30? Remember that guests have different costs to members (the listed costs are per half-hour 'slot'), and the guest user is always ID 0. Include in your output the name of the facility, the name of the member formatted as a single column, and the cost. Order by descending cost.
Ans: SELECT member, facility, cost FROM( 
  SELECT mems.firstname|| ' ' ||mems.surname AS member,
         facs.name as facility,
         CASE WHEN mems.memid = 0 THEN bks.slots*facs.guestcost 
         ELSE bks.slots*facs.membercost 
         END AS cost 
  FROM cd.members mems
  INNER JOIN cd.bookings bks ON (mems.memid = bks.memid)
  INNER JOIN cd.facilities facs on (bks.facid = facs.facid) 
  WHERE bks.starttime >= '2012-09-14' AND bks.starttime < '2012-09-15'
) WHERE cost > 30 
ORDER BY cost DESC;
