# MERN_Youtube_Clone
## 🔧 Tech Stack
Backend Framework: Express.js
Database: MongoDB with Mongoose ODM
Authentication: JWT (JSON Web Tokens)
Password Security: bcrypt
Environment Variables: dotenv
Routing & Middleware: Express Router, Custom Middleware

## Project Description
This backend project is a simplified version of a YouTube-like platform, built with Express.js and MongoDB, focusing on core functionality such as user authentication, video interaction (like/unlike), and channel features (subscribe/unsubscribe). JWT is used for secure, stateless authentication and protected routes.

## 📂 Features
### 🧑‍💻 User Authentication
Register (Sign Up): Create a new user account with email, username, and hashed password.
Login: Authenticate user and issue a JWT token.
Logout: Token-based logout (handled client-side by clearing token).
Secure Routes: Middleware to protect private endpoints using JWT.
Update/Delete Profile: Authenticated users can update or delete their own profile.

### 🔐 JWT-Based Auth Middleware
Validate tokens and allow access to protected routes.
Token sent via Authorization header using Bearer schema.

### 📹 Video Features (basic model for video interaction)
Upload video (metadata only; no actual file storage in this version).
Like/Unlike a video.
Get list of likes on a video.
Fetch all videos or a specific video by ID.

### 📢 Channel Features
Subscribe to another user/channel.
Unsubscribe from a user/channel.
Get subscriber count for a channel.
Get list of subscriptions for the current user.

### ❤️ Like / Unlike System
Users can like or unlike videos.
Prevents duplicate likes.
Each video keeps track of liked user IDs.](url)
