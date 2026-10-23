---
sidebar_position: 2
---

Link: https://pgexercises.com/questions/basic/
The schema contains three distinct tables mapping column names to their specific SQL data types:
Left Table (Members): Focuses on user registry data.
    memid: integer (primary key)
    surname: character varying(200)
    firstname: character varying(200)
    address: character varying(300)
    zipcode: integer
    telephone: character varying(20)
    recommendedby: integer (Self-referencing foreign key tracking referrals)
    joindate: timestamp
Middle Table (Bookings): Functions as a junction table tracking facility usage by members.
    facid: integer (Foreign key linking to Facilities)
    memid: integer (Foreign key linking to Members)
    starttime: timestamp
    slots: integer
Right Table (Facilities): Defines physical assets or services available for booking.
    facid: integer (primary key)
    name: character varying(100)
    membercost: numeric
    guestcost: numeric
    initialoutlay: numeric
    monthlymaintenance: numeric 
