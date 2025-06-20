# sfshare - Secure Role-Based File Sharing (PoC)
  This project simulates a comprehensive backend service for secure file sharing with role-based access control, real-time notifications, and audit logging.
  
  ### Features
  
  #### Core Requirements 
  - **Token-based Authentication**: JWT-based authentication system
  - **Role-based Access Control**: Using Casbin for flexible permission management
  - **File Operations**: Upload, list, search, and filter files with pagination
  - **Real-time Notifications**: 
    - Admin file uploads notify all connected users
    - Admin metadata updates notify file owners (if online)
  - **Permission Levels**: private, shared, public file access
  
  #### Bonus Features 
  - **File Encryption at Rest**: AES-256-GCM encryption for uploaded files
  - **Comprehensive Audit Logging**: Track all file operations and user actions
  - **Advanced Security**: Rate limiting, input validation, security headers
  
  #### Security Features
  - **Password Hashing**: bcrypt with salt rounds
  - **Input Validation**: Express-validator for all endpoints
  - **Security Headers**: Helmet.js for HTTP security headers
  - **CORS Protection**: Configurable cross-origin resource sharing
  
  ### Architecture
  
  #### Tech Stack
  - **Runtime**: Node.js with TypeScript
  - **Framework**: Express.js
  - **Database**: PostgreSQL with connection pooling
  - **Authorization**: Casbin for RBAC
  - **Real-time**: Socket.IO for WebSocket connections
  - **Encryption**: Node.js crypto module (AES-256-GCM)
  - **Logging**: Winston for structured logging
  

  ### API Endpoints
  
  #### Authentication
  ```
  POST /api/auth/register - Register new user
  POST /api/auth/login    - User login
  ```
  
  #### File Management
  ```
  POST   /api/files/upload - Upload new file
  GET    /api/files        - List files (with pagination, search, filters)
  GET    /api/files/:id    - Get specific file details
  PUT    /api/files/:id    - Update file metadata

  ```
  
  #### Audit (Admin only)
  ```
  GET /api/audit - Retrieve audit logs with filtering
  ```
  
  ### Role-Based Permissions
  
  #### Admin
  - Upload, read, update, delete files
  - Access all files regardless of permission level
  - Read audit logs
  - Manage users
  
  #### Manager
  - Upload, read, update files
  - Access own files + shared/public files
  
  #### Employee
  - Upload and read files only
  - Access own files + shared/public files
  
  ### Real-time Features
  
  #### WebSocket Events
  - `file_uploaded`: Broadcast when admin uploads a file
  - `file_metadata_updated`: Notify file owner when admin updates metadata
  - `connected`: Welcome message on connection
  
  ### Security Considerations
  
  #### File Encryption
  - AES-256-GCM encryption for files
  - Unique encryption keys per file
  - IV and authentication tag storage
  - Secure key generation
  
  #### Audit Trail
  - All file operations logged
  - User identification and IP tracking
  - Timestamp and action details
  - Browser fingerprinting via User-Agent
  
  ### Setup Instructions
  
  #### Prerequisites
  - Node.js 18+
  - PostgreSQL 12+ (or Docker)
  - pnpm or yarn
  
  #### Installation
  ```bash
  # Clone and install dependencies
  npm install

  # setup the DB
  docker compose up -d
  
  # Set up environment variables
  cp .env.example .env
  # Edit .env with your configuration
  
  # Development
  pnpm run dev
  
  # Production
  pnpm run build
  pnpm start
  ```
  
  #### Environment Configuration
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
  NODE_ENV=production
  ```
  
 
  
  #### Logging
  - Structured JSON logging with Winston
  - Separate error and combined log files
  - Request/response logging with IP tracking

  
  #### Health Check
  ```
  GET /health - Server health status
  ```
  
  ### Production Considerations
  
  #### Performance
  - Connection pooling for database
  - File upload size limits (100MB)
  - Pagination for large datasets
  - Compression middleware
  
  #### Scalability
  - Stateless design for horizontal scaling
  - Database indexing for query performance

  
  #### Security Hardening
  - Database connection encryption
  - Regular security audits

### TODO
- Refactor for cleaner types and separation of conserns
