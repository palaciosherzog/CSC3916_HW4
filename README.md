# CSC3916_HW4
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/c9a433c8703def7216c6?action=collection%2Fimport#?env%5BHW4%5D=W3sia2V5IjoidmFsaWRfdXNlciIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImFueSIsInNlc3Npb25WYWx1ZSI6IiIsInNlc3Npb25JbmRleCI6MH0seyJrZXkiOiJ0b2tlbiIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImFueSIsInNlc3Npb25WYWx1ZSI6IiIsInNlc3Npb25JbmRleCI6MX0seyJrZXkiOiJtb3ZpZV9yZXZpZXdzIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6IiIsInNlc3Npb25JbmRleCI6Mn0seyJrZXkiOiJtb3ZpZV9kZXRhaWxzIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6IiIsInNlc3Npb25JbmRleCI6M31d)

### A note about the postman tests

These tests should be run in order, otherwise some might fail.

## React Website Hosted At
https://hw5-movies.herokuapp.com/


---

### Some implementation notes
- Right now, if there is a validation error with the record during a post or put, it will return the message from the mongodb error.
- Titles for movies must be unique. This is because it is what we are using to identify them right now, so I opted for preventing undefined behavior by simply making them unique.

