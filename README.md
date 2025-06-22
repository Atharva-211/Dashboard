# User Dashboard - Full Stack Application

A modern, responsive user management dashboard built with Next.js, TypeScript, Tailwind CSS, and a Node.js + Express backend using MongoDB.

📄 Includes setup instructions, CRUD API documentation, and a video demo link.


## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, Delete user data
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Built with TypeScript for better development experience
- **Form Validation**: Client-side validation using Zod and React Hook Form
- **Real-time Updates**: Instant UI updates after operations
- **Docker Support**: Containerized for easy deployment
- **Backend API**: Node.js Express API connected to MongoDB

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Axios** - HTTP client for API calls

### Backend
- **Express.js** - Web framework for API routes
- **MongoDB** - NoSQL document database
- **Mongoose** - ODM for MongoDB and Node.js
- **CORS** - Cross-origin resource sharing


### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

Before running this application, make sure you have:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- [Firebase CLI](https://firebase.google.com/docs/cli) (for backend deployment)
- Google Cloud Project with Firestore enabled

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Dashboard-main
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - The application will automatically connect to the deployed Cloud Functions API

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000

## 🔧 Backend Setup

The backend is a Node.js + Express server connected to MongoDB.

1. Make sure MongoDB is running locally or provide a remote MongoDB URI.
2. Set your `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/your-db-name
```

## Start the backend server (Docker or locally):
```
npm run build
npm run start
```

## 📚 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Endpoints

#### 1. Get All Users
```http
GET /users
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "age": 30,
        "department": "Engineering",
        "role": "Software Engineer",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  },
  "message": "Users fetched successfully"
}
```

#### 2. Create User
```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "department": "Engineering",
  "role": "Software Engineer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "department": "Engineering",
    "role": "Software Engineer",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User created successfully"
}
```

#### 3. Get User by ID
```http
GET /users/{id}
```

#### 4. Update User
```http
PUT /users/{id}
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "age": 31,
  "department": "Engineering",
  "role": "Senior Software Engineer"
}
```

#### 5. Delete User
```http
DELETE /users/{id}
```

#### 6. Health Check
```http
GET /health
```

### Error Responses

All endpoints return error responses in this format:
```json
{
  "success": false,
  "error": "Error message description"
}
```

## 🎨 UI Components

### User Form
- **Validation**: Real-time form validation with Zod schemas
- **Responsive**: Works on all screen sizes
- **Accessibility**: Proper labels and ARIA attributes
- **Loading States**: Visual feedback during operations

### User List
- **Responsive Table**: Desktop table view with mobile card view
- **Actions**: Edit and delete buttons for each user
- **Loading States**: Skeleton loading animation
- **Empty State**: Helpful message when no users exist

## 🐳 Docker Commands

### Build Image
```bash
docker build -t user-dashboard .
```

### Run Container
```bash
docker run -p 3000:3000 user-dashboard
```

### Stop Container
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f frontend
```

## 🔍 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Docker
docker-compose up    # Start with Docker Compose
docker-compose down  # Stop containers
```

## 🚀 Deployment

### Frontend Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

### Backend Deployment

1. **Deploy Cloud Functions**
   ```bash
   cd functions
   firebase deploy --only functions
   ```

2. **Update environment variables** with the new function URL

## 🔒 Security

- **Input Validation**: Server-side validation for all user inputs
- **CORS**: Configured for secure cross-origin requests
- **Firestore Rules**: Secure database access rules
- **Environment Variables**: Sensitive data stored in environment variables

## 🧪 Testing

The application includes:
- **Type Safety**: TypeScript prevents runtime errors
- **Form Validation**: Zod schemas ensure data integrity
- **Error Handling**: Comprehensive error handling throughout the app

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify the API endpoint is accessible
3. Ensure all environment variables are set correctly
4. Check Docker logs if using containerized deployment

## 🎥 Demo

For a video demonstration of the CRUD operations and Docker deployment, please refer to the project documentation:
https://youtu.be/uwQM2W8oQQM
