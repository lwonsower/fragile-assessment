A simple rest api for a todo list

## Instructions
1. Clone repo
```
git@github.com:lwonsower/fragile-assessment.git
```

2. Install dependencies
```
npm install
```

3. Start server
```
npm start
```

4. Create an account
- `POST localhost:8080/accounts`
example request body
```
{
    "username": "jeff_goldblum",
    "password": "very_good_password"
}
```
- Use your accountId for the next steps

5. Create some notes
- `POST localhost:8080/notes/:accountId`
example request body
```
{
    "text": "Do laundry"
}
```

5. View your created notes
- `GET localhost:8080/notes/:accountId`

6. Update a note
- `PATCH localhost:8080/notes/:noteId`
example request body
```
{
    "complete": true
}
```

6. Delete a note
- `DELETE localhost:8080/notes/:noteId`
