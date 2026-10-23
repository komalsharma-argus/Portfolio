---
sidebar_position: 8
---

##### **Recursive**



###### Common Table Expressions allow us to, effectively, create our own temporary tables for the duration of a query - they're largely a convenience to help us make more readable SQL. Using the WITH RECURSIVE modifier, however, it's possible for us to create recursive queries. This is enormously advantageous for working with tree and graph-structured data - imagine retrieving all of the relations of a graph node to a given depth, for example.

###### 

###### This category shows you some basic recursive queries that are possible using our dataset.



1. **Find the upward recommendation chain for member ID 27: Find the upward recommendation chain for member ID 27: that is, the member who recommended them, and the member who recommended that member, and so on. Return member ID, first name, and surname. Order by descending member id.**

**Ans.**

WITH RECURSIVE recommenders(recommender) AS (

&#x20; SELECT recommendedby FROM cd.members WHERE memid = 27

&#x20; 

&#x20; UNION ALL

&#x20; 

&#x20; SELECT mems.recommendedby FROM recommenders recs 

&#x20;                           INNER JOIN cd.members mems ON (mems.memid = recs.recommender)

)



SELECT recs.recommender, mems.firstname, mems.surname

FROM recommenders recs 

INNER JOIN cd.members mems ON (mems.memid = recs.recommender)

ORDER BY memid DESC;



**2. Find the downward recommendation chain for member ID 1: Find the downward recommendation chain for member ID 1: that is, the members they recommended, the members those members recommended, and so on. Return member ID and name, and order by ascending member id.**

**Ans.**

WITH RECURSIVE recommendeds(memid) AS (

&#x20; SELECT memid FROM  cd.members WHERE recommendedby = 1

&#x20; 

&#x20; UNION ALL

&#x20; 

&#x20; SELECT mems.memid FROM recommendeds recs 

&#x20;                   INNER JOIN cd.members mems ON (mems.recommendedby = recs.memid)

)

SELECT recs.memid, mems.firstname, mems.surname 

FROM recommendeds recs 

INNER JOIN cd.members mems ON (recs.memid = mems.memid)

ORDER BY memid;



**3. Produce a CTE that can return the upward recommendation chain for any member: Produce a CTE that can return the upward recommendation chain for any member. You should be able to select recommender from recommenders where member=x. Demonstrate it by getting the chains for members 12 and 22. Results table should have member and recommender, ordered by member ascending, recommender descending.**

**Ans.** 

WITH RECURSIVE recommenders(recommender, member) AS (

&#x20; SELECT recommendedby, memid FROM cd.members

&#x20; 

&#x20; UNION ALL 

&#x20; 

&#x20; SELECT mems.recommendedby, recs.member 

&#x20; FROM recommenders recs 

&#x20; INNER JOIN cd.members mems ON (mems.memid = recs.recommender)                    

)

SELECT recs.member member, recs.recommender, mems.firstname, mems.surname

FROM recommenders recs 

INNER JOIN cd.members mems ON (recs.recommender = mems.memid)

WHERE recs.member in (12, 22)

ORDER BY recs.member ASC, recs.recommender DESC;



