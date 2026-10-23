---
sidebar_position: 7
---

##### **String**



1. **Format the names of members: Output the names of all members, formatted as 'Surname, Firstname'**

**Ans.** 

SELECT surname || ', ' || firstname AS name FROM cd.members;



**2.Find facilities by a name prefix: Find all facilities whose name begins with 'Tennis'. Retrieve all columns.**

**Ans.** 

SELECT \* FROM cd.facilities facs

WHERE facs.name LIKE 'Tennis%';



**3. Perform a case-insensitive search: Perform a case-insensitive search to find all facilities whose name begins with 'tennis'. Retrieve all columns.**

**Ans.**

SELECT \* FROM cd.facilities facs

WHERE facs.name ILIKE 'Tennis%';



**4. Find telephone numbers with parentheses: You've noticed that the club's member table has telephone numbers with very inconsistent formatting. You'd like to find all the telephone numbers that contain parentheses, returning the member ID and telephone number sorted by member ID.**

**Ans.** 

SELECT memid, telephone FROM cd.members

WHERE telephone LIKE '%(%)%' 

ORDER BY memid;



**5. Pad zip codes with leading zeroes: The zip codes in our example dataset have had leading zeroes removed from them by virtue of being stored as a numeric type. Retrieve all zip codes from the members table, padding any zip codes less than 5 characters long with leading zeroes. Order by the new zip code.**

**Ans.** 

SELECT LPAD(CAST(zipcode AS VARCHAR), 5, '0') FROM cd.members AS zip

ORDER BY zip;



**6. Count the number of members whose surname starts with each letter of the alphabet: You'd like to produce a count of how many members you have whose surname starts with each letter of the alphabet. Sort by the letter, and don't worry about printing out a letter if the count is 0.**

**Ans.** 

SELECT SUBSTR(mems.surname, 1, 1) AS letter, COUNT(\*) AS count 

FROM cd.members mems

GROUP BY letter

ORDER BY letter;



**7. Clean up telephone numbers: The telephone numbers in the database are very inconsistently formatted. You'd like to print a list of member ids and numbers that have had '-','(',')', and ' ' characters removed. Order by member id.**

**Ans.** 

SELECT memid, TRANSLATE(telephone, '-() ', '') as telephone

FROM cd.members

ORDER BY memid;

