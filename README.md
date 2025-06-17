# Digital Banking Application

A modern, secure, and user-friendly digital banking platform built with Spring Boot and Angular. This project was developed by Aya Rabah as a comprehensive solution for digital banking needs.

## 🌟 Features

### User Features
- Secure user authentication and authorization
- Personal dashboard with account overview
- Real-time account balance monitoring
- Transaction history and details
- Money transfer capabilities
- Profile management
- Secure password management

### Admin Features
- User management dashboard
- Account monitoring and control
- Transaction oversight
- System analytics
- Role-based access control

## 🛠️ Technology Stack

### Backend
- Spring Boot 3.x
- Spring Security with JWT
- H2 Database (Development)
- MySQL Database (Production)
- Maven for dependency management

### Frontend
- Angular 17
- Modern UI/UX design
- Responsive layout
- Secure authentication flow
- Real-time updates

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- Angular CLI
- Maven
- MySQL (for production)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd digitalbanking-backend
   ```

2. Install dependencies:
   ```bash
   mvn install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd digitalbanking-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   ng serve
   ```

## 🔐 Security Features

- JWT-based authentication
- Password encryption
- Role-based access control
- CORS configuration
- Secure session management
- Input validation
- XSS protection

## 📱 User Interface

The application features a modern, responsive design with:
- Clean and intuitive navigation
- Real-time data updates
- Interactive dashboards
- Mobile-friendly layout
- Accessible design elements

## 🔄 API Endpoints

### Authentication
- POST `/api/auth/signup` - User registration
- POST `/api/auth/signin` - User login
- POST `/api/auth/refresh` - Refresh token

### User Operations
- GET `/api/accounts` - Get user accounts
- GET `/api/transactions` - Get transaction history
- POST `/api/transfers` - Perform money transfer
- GET `/api/profile` - Get user profile
- PUT `/api/profile` - Update user profile

### Admin Operations
- GET `/api/admin/users` - Get all users
- PUT `/api/admin/users/{id}` - Update user
- DELETE `/api/admin/users/{id}` - Delete user
- GET `/api/admin/analytics` - Get system analytics

## 🎨 Theme Customization

The application uses a modern, customizable theme with:
- Elegant color scheme
- Responsive design
- Dark/Light mode support
- Customizable components
- Consistent styling

## 🔧 Configuration

### Backend Configuration
```properties
# Database Configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# JWT Configuration
jwt.secret=your-secret-key
jwt.expiration=86400000

# Server Configuration
server.port=8085
```

### Frontend Configuration
```typescript
// Environment Configuration
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8085/api'
};
```

## 📦 Project Structure

```
digitalbanking/
├── digitalbanking-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── digitalbanking-frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   └── environments/
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Aya Rabah - Full Stack Developer
  - Backend Development (Spring Boot)
  - Frontend Development (Angular)
  - UI/UX Design
  - Security Implementation
  - Project Architecture

## 🙏 Acknowledgments

- Spring Boot Team for their excellent framework
- Angular Team for the powerful frontend framework
- All contributors and supporters of this project
- Special thanks to everyone who provided guidance and feedback during development

## 📞 Support

For support, email aya.goumri@digitalbanking.com or create an issue in the repository.
