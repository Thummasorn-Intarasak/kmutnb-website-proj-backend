# API Documentation

## Base URL
```
http://localhost:3002/api
```

## User Endpoints

### Register User
- **POST** `/users/register`
- **Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```
- **Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string"
  }
}
```

### Login User
- **POST** `/users/login`
- **Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
- **Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string"
  }
}
```

### Get All Users
- **GET** `/users`
- **Response:**
```json
[
  {
    "id": 1,
    "username": "string",
    "email": "string"
  }
]
```

### Get User by ID
- **GET** `/users/:id`
- **Response:**
```json
{
  "id": 1,
  "username": "string",
  "email": "string"
}
```

### Update User
- **PUT** `/users/:id`
- **Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

### Delete User
- **DELETE** `/users/:id`

## Item Endpoints

### Get All Items
- **GET** `/items`
- **Response:**
```json
[
  {
    "id": 1,
    "game_name": "string",
    "description": "string",
    "price": 100.00,
    "game_image": "Buffer"
  }
]
```

### Get Item by ID
- **GET** `/items/:id`

### Search Items by Name
- **GET** `/items/search?name=game`
- **Query Parameters:**
  - `name`: string (required)

### Search Items by Price Range
- **GET** `/items/price-range?min=100&max=500`
- **Query Parameters:**
  - `min`: number (required)
  - `max`: number (required)

### Create Item
- **POST** `/items`
- **Body:**
```json
{
  "game_name": "string",
  "description": "string",
  "price": 100.00,
  "game_image": "Buffer"
}
```

### Update Item
- **PUT** `/items/:id`
- **Body:**
```json
{
  "game_name": "string",
  "description": "string",
  "price": 100.00,
  "game_image": "Buffer"
}
```

### Delete Item
- **DELETE** `/items/:id`

## Banner Endpoints

### Get All Banners
- **GET** `/banners`
- **Response:**
```json
[
  {
    "id": 1,
    "title": "string",
    "subtitle": "string",
    "description": "string",
    "image": "string",
    "buttonText": "string",
    "buttonColor": "string",
    "titleColor": "string",
    "backgroundColor": "string",
    "isActive": true,
    "sortOrder": 0
  }
]
```

### Get Banner by ID
- **GET** `/banners/:id`

### Create Banner
- **POST** `/banners`
- **Body:**
```json
{
  "title": "string",
  "subtitle": "string",
  "description": "string",
  "image": "string",
  "buttonText": "string",
  "buttonColor": "string",
  "titleColor": "string",
  "backgroundColor": "string",
  "isActive": true,
  "sortOrder": 0
}
```

### Update Banner
- **PUT** `/banners/:id`
- **Body:**
```json
{
  "title": "string",
  "subtitle": "string",
  "description": "string",
  "image": "string",
  "buttonText": "string",
  "buttonColor": "string",
  "titleColor": "string",
  "backgroundColor": "string",
  "isActive": true,
  "sortOrder": 0
}
```

### Toggle Banner Status
- **PUT** `/banners/:id/toggle`

### Delete Banner
- **DELETE** `/banners/:id`

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Item with id 1 not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Username or email already exists",
  "error": "Conflict"
}
```

## Database Configuration

- **Type:** PostgreSQL
- **Host:** localhost
- **Port:** 5432
- **Database:** kmutnb-db
- **Username:** belle
- **Password:** 123456

## Running the Server

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Start production server
npm run start:prod
```

The server will be available at `http://localhost:3002/api`
