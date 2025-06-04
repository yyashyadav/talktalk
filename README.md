# TalkTalk - Real-time Chat Application

A modern real-time chat application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.IO for real-time communication.

## Features

- Real-time messaging
- User authentication
- Group chats
- File sharing
- Message reactions
- Message replies
- Message forwarding
- Online/offline status
- Typing indicators
- Message deletion
- Profile customization
- Admin dashboard
- Responsive design

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Material-UI
- Socket.IO Client
- Axios
- React Router
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary (for file storage)
- Bcrypt (for password hashing)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for file storage)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/talktalk.git
cd talktalk
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd mechat-backend
npm install

# Install frontend dependencies
cd ../mechat-frontend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_SECRET_KEY=your_admin_secret_key
```

4. Create a `.env` file in the frontend directory:
```env
VITE_SERVER_URL=http://localhost:5000
```

## Running the Application

1. Start the backend server:
```bash
cd mechat-backend
npm run dev
```

2. Start the frontend development server:
```bash
cd mechat-frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## Guest Login

For demonstration purposes, you can use the guest login:
- Username: username
- Password: password

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 