# CSC3916_HW3
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/c1d211aef0cbf1ab042c?action=collection%2Fimport#?env%5BHW3%5D=W3sia2V5IjoibW92aWVfZGV0YWlscyIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImFueSIsInNlc3Npb25WYWx1ZSI6Ilt7XCJ0aXRsZVwiOlwiVGhlIEJhdG1hblwiLFwieWVhclJlbGVhc2VkXCI6MjAyMixcImdlbnJlXCI6XCJBY3Rpb25cIixcImFjdG9yc1wiOlt7XCJhY3Rvck5hbWVcIjpcIlpvZS4uLiIsInNlc3Npb25JbmRleCI6MH0seyJrZXkiOiJ2YWxpZF91c2VyIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiYW55Iiwic2Vzc2lvblZhbHVlIjoie1widXNlcm5hbWVcIjpcIk1heWhRbGNXc2xcIixcInBhc3N3b3JkXCI6XCJDbmt3QWhcIn0iLCJzZXNzaW9uSW5kZXgiOjF9LHsia2V5IjoidG9rZW4iLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJhbnkiLCJzZXNzaW9uVmFsdWUiOiJKV1QuLi4iLCJzZXNzaW9uSW5kZXgiOjJ9XQ==)

## React Website Hosted At
https://hw5-movies.herokuapp.com/


---

### Some implementation notes
- Right now, if there is a validation error with the record during a post or put, it will return the message from the mongodb error.
- Titles for movies must be unique. This is because it is what we are using to identify them right now, so I opted for preventing undefined behavior by simply making them unique.