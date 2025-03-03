# Seneca Backend Task

## Overview

This is a very simplified stats service developed using **Node.js**, **Express**, and **TypeScript**. The API provides endpoints to create and read session study events, as well as aggregating course stats. It uses a **DynamoDB** database and is hosted on **AWS Elastic Beanstalk**.

## Hosted URL

The API can be accessed at the following URL:

[http://seneca-backend-task.eba-dnvj8gai.eu-west-2.elasticbeanstalk.com/](http://seneca-backend-task.eba-dnvj8gai.eu-west-2.elasticbeanstalk.com/)

### Technologies Used

- **Node.js**
- **Express**: Web framework for building RESTful APIs.
- **TypeScript**: As specified in the brief.
- **AWS Elastic Beanstalk**: Platform-as-a-Service (PaaS) for deployment.
- **DynamoDB**: NoSQL database.

---

## Endpoints

This API has the following endpoints:

### 1. **POST /courses/:courseId**

- Adds a session study event for a course.
- **Request Body**:
  ```json
  {
    "sessionId": "string",
    "totalModulesStudied": "number",
    "averageScore": "number",
    "timeStudied": "number"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Created",
    "sessionStudyEvent": {
      "userId": "string",
      "courseId": "string",
      "sessionId": "string",
      "totalModulesStudied": "number",
      "averageScore": "number",
      "timeStudied": "number"
    }
  }
  ```
- **Example cURL**:
  ```bash
  curl -X POST http://seneca-backend-task.eba-dnvj8gai.eu-west-2.elasticbeanstalk.com/courses/course555 \
  -H "Content-Type: application/json" \
  -H "userid: user555" \
  -d '{
    "sessionId": "session555",
    "totalModulesStudied": 5,
    "averageScore": 85,
    "timeStudied": 120
  }'
  ```

### 2. **GET /courses/:courseId**

- Retrieves the aggregated statistics for a course.
- **Request**:
  - **Params**:
    - `courseId` (string): The ID of the course.
  - **Headers**:
    - `userid` (string): The ID of the user (sent as a header).
- **Response**:
  ```json
  {
    "message": "Course lifetime stats",
    "data": {
      "totalModulesStudied": "number",
      "averageScore": "number",
      "timeStudied": "number"
    }
  }
  ```
- **Description**: This endpoint returns the aggregated statistics for a specific course, including the total number of modules studied, the average score, and the total time spent studying the course.

---

### 3. **GET /courses/:courseId/sessions**

- Retrieves all sessions for a given course.
- **Request**:
  - **Params**:
    - `courseId` (string): The ID of the course.
  - **Headers**:
    - `userid` (string): The ID of the user (sent as a header).
- **Response**:
  ```json
  {
    "message": "Session stats",
    "sessionStats": [
      {
        "sessionId": "string",
        "totalModulesStudied": "number",
        "averageScore": "number",
        "timeStudied": "number"
      },
      {
        "sessionId": "string",
        "totalModulesStudied": "number",
        "averageScore": "number",
        "timeStudied": "number"
      }
    ]
  }
  ```
- **Description**: This endpoint returns a list of all sessions associated with a specific course, including details such as session ID, total modules studied, average score, and time studied.

---

## Database

This project uses **AWS DynamoDB**, which fits well with the document-style schema of the API. It stores session study data, with each entry having the following structure:

- `userId`: The ID of the user.
- `courseId#sessionId`: A composite key combining the `courseId` and `sessionId`.
- `totalModulesStudied`: The total number of modules the user studied.
- `averageScore`: The average score achieved by the user.
- `timeStudied`: The total time spent by the user studying, in minutes.

---

## Setup Instructions

To get started with this project locally:

```
git clone https://github.com/adyrmishi/stats-service.git
npm i
npm run start
```

To run tests locally:

```
git clone https://github.com/adyrmishi/stats-service.git
npm i
npx jest
```

### Assumptions

1. **User ID Validation**: I assumed any string is a valid user ID.
2. **Course ID and Session ID Validation**: I assumed these values are simple non-empty strings without a predefined format.
3. **No API Key Authentication**: I assumed open access was acceptable for this task.
4. **No Specific Session Data Validation**: I assumed no detailed validation was required for the session data (e.g., ensuring that `totalModulesStudied`, `averageScore`, and `timeStudied` are within specific ranges). Thus, no strict input validation was added.
5. **Endpoint Availability**: I assumed that we only needed the three endpoints provided in the API schema.
6. **Single Table for DynamoDB**: It was assumed that all session data could be stored in a single DynamoDB table, as the API schema suggested a relatively flat structure.
7. **Tests Writing to Production Table**: For simplicity and ease of setup, the tests currently write directly to the production DynamoDB table. In a production environment, it would be necessary to separate testing and production data by using different DynamoDB tables or mocking the database during tests.

### Deviations

1. **HTTP Instead of HTTPS**: The API is currently served over HTTP. Implementing HTTPS was not feasible within the scope of the assignment due to time constraints. For production deployment, this would need to be addressed for security reasons.
2. **Limited Input Validation**: As per the provided schema, no specific validation for user IDs, session IDs, or course IDs was included, even though stricter validation could improve data integrity.
3. **Error Handling**: The error handling is relatively simple. Ideally, more granular error messages or error codes would be used for different failure scenarios which would make the API more user friendly.
4. **No Pagination**: The API does not implement pagination for any of the endpoints. For large courses with many sessions, pagination would be necessary to avoid excessive load and response times.
5. **No Rate Limiting**: The project does not implement any form of rate limiting or request throttling, which would be useful in a production environment to prevent abuse or overload of the server.

---
