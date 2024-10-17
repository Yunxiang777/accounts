# Express Application

This project is an Express.js application that provides a simple web interface and API for managing accounts. The project includes session handling, MongoDB integration, and error handling.

## Features

- **Express.js**: The main framework for building the application.
- **MongoDB**: Database used to store user and session data.
- **Session Management**: Uses MongoDB to store session data with the help of `connect-mongo`.
- **API Routes**: Provides RESTful API for account and authentication operations.
- **Error Handling**: Custom error pages for 404 and general errors.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Routes](#routes)
- [License](#license)

## Installation

1. Clone the repository:

    \`\`\`bash
    git clone https://github.com/yourusername/yourproject.git
    cd yourproject
    \`\`\`

2. Install dependencies:

    \`\`\`bash
    npm install
    \`\`\`

3. Create a `.env` file in the root directory and add the necessary environment variables (see [Environment Variables](#environment-variables)).

## Environment Variables

Make sure to create a `.env` file in the root of your project with the following variables:

\`\`\`plaintext
# MongoDB connection URI
MONGO_URI=mongodb://localhost:27017/yourdb

# Session secret key for encrypting session data
SESSION_SECRET=your-session-secret
\`\`\`

These environment variables are used for:

- Connecting to the MongoDB database.
- Securing session data.

## Running the Application

1. Make sure MongoDB is running locally or use a cloud-based MongoDB service.
2. Start the server:

    \`\`\`bash
    npm start
    \`\`\`

3. The server should be running at \`http://localhost:3000\`.

## Routes

The application has a mix of web and API routes:

### Web Routes

| Method | Path          | Description                    |
|--------|---------------|--------------------------------|
| GET    | `/`           | Home page                      |
| GET    | `/login`      | Login page                     |
| GET    | `/register`   | Registration page              |

### API Routes

| Method | Path             | Description                        |
|--------|------------------|------------------------------------|
| POST   | `/api/account`    | Create a new account transaction   |
| GET    | `/api/account`    | Get list of account transactions   |
| POST   | `/api/auth/login` | Login user                        |
| POST   | `/api/auth/logout`| Logout user                       |

### Error Pages

- **404**: Custom page not found.
- **503**: Service unavailable when MongoDB is not connected.

## Error Handling

Custom error handling is provided for various cases:

- 404: Page not found.
- 503: Service unavailable when MongoDB is not connected.
- General server errors.

## License

This project is licensed under the MIT License.
"""
