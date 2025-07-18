# sfshare – Secure Role-Based File Sharing (PoC)

his project simulates a comprehensive backend service for secure file sharing with role-based access control, real-time notifications, and audit logging.

---

## Features

### Core
- **JWT Authentication**: Secure, stateless user sessions.
- **Role-Based Access Control (RBAC)**: Powered by Casbin for flexible, fine-grained permissions.
- **File Operations**: Upload, list, search, filter, and update files with pagination and permission levels.
- **Real-Time Notifications**: 
  - Admin file uploads notify all connected users.
  - Admin metadata updates notify file owners (if online).
- **Permission Levels**: Private, shared, and public file access.

### Security
- **File Encryption at Rest**: AES-256-GCM encryption for all uploaded files.
- **Password Hashing**: bcrypt with configurable salt rounds.
- **Input Validation**: All endpoints validated for type and content.
- **Security Headers**: Helmet.js for HTTP security.
- **CORS Protection**: Configurable origins.
- **Rate Limiting**: Prevent brute-force and abuse.

### Audit & Logging
- **Comprehensive Audit Trail**: All file/user actions logged with user, IP, timestamp, and action details.
- **Structured Logging**: Winston for JSON logs, error/combined log files, and request/response tracking.

### Architecture
- **Node.js + TypeScript**: Modern, type-safe backend.
- **Express.js**: REST API framework.
- **PostgreSQL**: Relational database with connection pooling.
- **Casbin**: RBAC and permission enforcement.
- **Socket.IO**: Real-time WebSocket communication.
- **Docker**: Easy local development and deployment.

---

## API Endpoints

### Authentication
```http
POST /api/auth/register   # Register new user
POST /api/auth/login      # User login
GET  /api/auth/me         # Get current user profile (JWT required)
```

### File Management
```http
POST   /api/files/upload      # Upload new file (multipart/form-data)
GET    /api/files             # List files (pagination, search, filters)
GET    /api/files/:id         # Get file details
PATCH  /api/files/:id         # Update file metadata
```

### Audit (Admin only)
```http
GET /api/audit               # Retrieve audit logs (filterable)
```

### User Management (Admin only)
```http
POST   /api/user             # Create user
GET    /api/user/:id         # Get user by ID
PATCH  /api/user/:id         # Update user (anyone)
```

### Health Check
```http
GET /health                  # Server health status
```

---

## Role-Based Permissions

| Role     | File Upload | File Read | File Update | File Delete | Audit Logs | User Management |
|----------|-------------|-----------|-------------|-------------|------------|-----------------|
| Admin    | ✅          | ✅        | ✅          | ✅          | ✅         | ✅              |
| Manager  | ✅          | ✅        | ✅          | ❌          | ❌         | ❌              |
| Employee | ✅          | ✅        | ❌          | ❌          | ❌         | ❌              |

- **Admin**: Full access to all files, audit logs, and user management.
- **Manager**: Access to own, shared, and public files; can update files.
- **Employee**: Access to own, shared, and public files; can upload and read only.

---

## Real-Time Features

### WebSocket Events
- `connected`: Welcome message on connection.
- `file_uploaded`: Broadcast when admin uploads a file.
- `file_metadata_updated`: Notify file owner when admin updates metadata.

---

## Security Considerations

- **File Encryption**: AES-256-GCM with unique keys per file; IV and auth tag stored securely.
- **Password Hashing**: bcrypt with salt.
- **Input Validation**: All endpoints.
- **Security Headers**: Helmet.js.
- **CORS**: Configurable.
- **Audit Trail**: All actions logged with user, IP, timestamp, and user-agent.

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 12+ (or Docker)
- pnpm or yarn
- Docker & Docker Compose (for containerized setup)

### Option 1: PostgreSQL Container + Host App (Recommended for Development)

This approach runs PostgreSQL in a container while running the application on your host machine for easier debugging and development.

```bash
# Clone repository and install dependencies
git clone https://github.com/Richd0tcom/sfshare.git
cd sfshare

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install

# Return to project root
cd ..

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your database and JWT settings

# Start PostgreSQL container only
docker compose up postgres -d

# Wait for PostgreSQL to be ready, then run database migrations
cd backend
pnpm run migrateup

# Run database seeds
pnpm run seed

# Start the backend development server
pnpm run start:dev

# In a new terminal, start the frontend development server
cd ../frontend
pnpm run dev
```

### Option 2: Full Containerized Setup 

This approach runs both PostgreSQL and the application in containers using docker-compose.

```bash
# Clone repository
git clone https://github.com/Richd0tcom/sfshare.git
cd sfshare

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your database and JWT settings

# Build and start all services
docker compose up -d

# Run database seeds
pnpm run seed

# The application will be available at:
# Backend API: http://localhost:3000
# Frontend: http://localhost:5173
# PostgreSQL: localhost:5434
```

``docker compose up -d`` should start up the frontend/UI

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=filesharing

# Security
JWT_SECRET=your-secure-secret-key
ENCRYPT_FILES=true

# Server
PORT=3000
NODE_ENV=development

# File Upload
MULTER_DEST=./uploads
```

### Development Commands

```bash
# Backend (from backend/ directory)
pnpm run start:dev          # Start development server with hot reload
pnpm run build              # Build for production
pnpm run start:prod         # Start production server
pnpm run test               # Run tests
pnpm run test:e2e           # Run end-to-end tests
pnpm run migrateup          # Run database migrations
pnpm run migratedown        # Rollback database migrations
pnpm run seed               # Run database seeds

# Frontend (from frontend/ directory)
pnpm run dev                # Start development server
pnpm run build              # Build for production
pnpm run preview            # Preview production build
```

### Database Management

```bash
# Run migrations
cd backend
pnpm run migrateup

# Rollback migrations
pnpm run migratedown

# Run seeds
pnpm run seed

# Test database connection
pnpm run db:test
```

---

## Logging

- **Winston**: Structured JSON logs.
- **Log Files**: Separate error and combined logs.
- **Request/Response Logging**: Includes IP and user-agent.

---

## Production Considerations

### Performance
- Database connection pooling.
- File upload size limits (default: 100MB).
- Pagination for large datasets.
- Compression middleware.

### Scalability
- Stateless design for horizontal scaling.
- Database indexing for query performance.

### Security Hardening
- Encrypted database connections.
- Regular security audits.

---

## Health Check

```http
GET /
```
Returns server health status.

---

## TODO

- Add more unit and integration tests.
- Improve error handling and validation feedback.
- Enhance documentation and API examples.

---

## License

MIT

---

## Authors

- [Your Name](https://github.com/your-profile)
- [Contributors](https://github.com/your-org/sfshare/graphs/contributors)

---

## Acknowledgements
-