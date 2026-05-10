# Krytil Jobs - A Modern Job Portal

A full-stack job portal application that connects job seekers with employers. Krytil Jobs is built with modern technologies to provide a seamless experience for both job applicants and recruiters.

## 🌟 Features

### For Job Seekers
- **Job Search & Filtering** - Browse and filter jobs by title, company, location, and more
- **Job Applications** - Apply for jobs with a single click
- **Resume Management** - Upload and manage your resume
- **Application Tracking** - Track the status of your job applications
- **User Dashboard** - Personal profile and application history
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### For Recruiters
- **Post Jobs** - Create and manage job listings
- **View Applications** - See all applications for posted jobs
- **Manage Listings** - Edit, update, and delete job postings
- **Recruiter Dashboard** - Overview of all posted jobs and applications
- **Company Profile** - Setup and manage company information

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code quality tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Cloudinary** - Image storage and management

### Additional Tools
- **JWT** - Authentication
- **Multer** - File upload handling
- **Vercel** - Deployment platform

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Sharon-TN/Krytil-Jobs-Final.git
cd Krytil-Jobs
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

Create a `.env.local` file in the client directory (if needed):
```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Start Backend Server
```bash
cd server
npm start
```
The server will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd client
npm run dev
```
The client will run on `http://localhost:5173`

## 📁 Project Structure

```
Krytil-Jobs/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Context API
│   │   ├── assets/         # Static assets
│   │   └── App.jsx         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB schemas
│   ├── controllers/        # Route controllers
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
└── README.md               # This file
```

## 🔌 API Endpoints

### User Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Job Routes
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create new job (recruiter only)
- `PUT /api/jobs/:id` - Update job (recruiter only)
- `DELETE /api/jobs/:id` - Delete job (recruiter only)

### Application Routes
- `POST /api/applications` - Apply for a job
- `GET /api/applications` - Get user applications
- `GET /api/applications/:jobId` - Get applications for a job (recruiter only)
- `PUT /api/applications/:id` - Update application status (recruiter only)

### Company Routes
- `GET /api/companies/:id` - Get company profile
- `PUT /api/companies/:id` - Update company profile

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Users must login to:
- Apply for jobs
- Access their dashboard
- Upload resume (for job seekers)
- Post jobs (for recruiters)

## 📸 Image Upload

Images are stored using Cloudinary. Configure your Cloudinary credentials in the backend `.env` file.

## 🎯 Key Features Implementation

### Resume Upload
Job seekers can upload their resume which is stored using Cloudinary's file handling.

### Job Application
Users can view job listings and apply directly from the job detail page. Each application is tracked and stored in the database.

### Recruiter Dashboard
Recruiters can view all their posted jobs, see applications, and manage job listings from their dashboard.

## 🧪 Testing

To test the application:
1. Create user accounts (job seeker and recruiter)
2. As a recruiter, post a job
3. As a job seeker, search for and apply to the job
4. Check application status in both dashboards

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

For contributions, please contact the project owner.

## 📧 Contact

For questions or support, please reach out to the development team.

---

**Happy Job Hunting with Krytil Jobs! 🚀**
